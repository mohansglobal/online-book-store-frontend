// Page-wise API integration configuration.
// Controls real API vs Mock Data on a per-page / per-feature basis.
// Set any page key to true to show the real API-integrated version
// even if the global environment (.env) is set to mock mode.

import { IS_API_ENABLED, IS_MOCK_MODE } from "./env";

export type PageIntegrationKey =
  | "homepage"
  | "books"
  | "bookDetails"
  | "authors"
  | "authorDetails"
  | "publishers"
  | "publisherDetails"
  | "categories"
  | "categoryDetails"
  | "cart"
  | "checkout"
  | "orders"
  | "profile"
  | "wishlist"
  | "auth"
  | "sellerDashboard"
  | "sellerInventory"
  | "sellerAddBook"
  | "sellerDiscounts";

export type PageIntegrationConfig = Record<PageIntegrationKey, boolean>;

// Master page-by-page progress flags.
// true  = use real backend API (http://localhost:5000/api/v1)
// false = use local mock store (when global mock mode is active)
export const PAGE_INTEGRATION_FLAGS: PageIntegrationConfig = {
  // API Integrated Pages (Real backend at http://localhost:5000/api/v1)
  homepage: true,
  auth: true, // Login & Register
  categories: true, // Category list page
  categoryDetails: true, // Category dedicated page
  publishers: true, // Publishers page
  publisherDetails: true, // Publisher dedicated page
  authors: true, // Authors page
  authorDetails: true, // Author dedicated page

  // Mock Mode Pages (Local mock store)
  books: false,
  bookDetails: false,
  cart: false,
  checkout: false,
  orders: false,
  profile: false,
  wishlist: false,

  // Seller Pages (Mock Mode)
  sellerDashboard: false,
  sellerInventory: false,
  sellerAddBook: false,
  sellerDiscounts: false,
};

// Check if a specific page or feature has real API integration enabled.
export function isPageApiEnabled(pageKey: PageIntegrationKey): boolean {
  // 1. If global API mode is fully active, all pages use real API
  if (IS_API_ENABLED && !IS_MOCK_MODE) {
    return true;
  }

  // 2. Secret query param override for live client demos: e.g. ?__api=true or ?__api=homepage
  if (typeof window !== "undefined") {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const secretApiAll = searchParams.get("__api");
      if (secretApiAll === "true" || secretApiAll === "1") {
        return true;
      }
      if (secretApiAll && secretApiAll.split(",").includes(pageKey)) {
        return true;
      }
    } catch {
      // Ignore browser URL search param errors
    }
  }

  // 3. Per-page configuration flag
  return Boolean(PAGE_INTEGRATION_FLAGS[pageKey]);
}

// Check if query params indicate a homepage section query.
function isHomeSectionParam(params?: unknown): boolean {
  if (!params) return false;
  if (params instanceof URLSearchParams) {
    return params.get("homesection") === "true";
  }
  if (typeof params === "object" && params !== null) {
    const raw = (params as Record<string, unknown>).homesection;
    return raw === true || raw === "true";
  }
  return false;
}

// Map common API endpoint paths to their corresponding page/feature keys.
export function getEndpointPageKey(endpoint: string, params?: unknown): PageIntegrationKey | null {
  // If request contains homesection: true, it belongs to the homepage
  if (isHomeSectionParam(params)) {
    return "homepage";
  }

  const cleanEndpoint = endpoint.replace(/^\/+/, "").toLowerCase();
  const firstSegment = cleanEndpoint.split("/")[0];

  if (firstSegment === "authors") {
    return "authors";
  }

  if (firstSegment === "publishers") {
    return "publishers";
  }

  if (firstSegment === "categories") {
    return "categories";
  }

  if (firstSegment === "books" || firstSegment === "listings") {
    return "books";
  }

  if (firstSegment === "cart") {
    return "cart";
  }

  if (firstSegment === "checkout" || firstSegment === "coupons") {
    return "checkout";
  }

  if (firstSegment === "orders") {
    return "orders";
  }

  if (firstSegment === "wishlist") {
    return "wishlist";
  }

  if (firstSegment === "users" || firstSegment === "addresses" || firstSegment === "countries") {
    return "profile";
  }

  if (firstSegment === "auth") {
    return "auth";
  }

  if (firstSegment === "seller") {
    return "sellerDashboard";
  }

  return null;
}

// Determine if an API request should hit the real Express backend.
export function shouldEndpointUseApi(
  endpoint: string,
  explicitPageKey?: PageIntegrationKey | string,
  forceApi?: boolean,
  params?: unknown,
): boolean {
  // 1. Explicit force flag
  if (forceApi === true) {
    return true;
  }

  // 2. If explicit page key is provided, check its status
  if (explicitPageKey && explicitPageKey in PAGE_INTEGRATION_FLAGS) {
    return isPageApiEnabled(explicitPageKey as PageIntegrationKey);
  }

  // 3. Infer page key from endpoint path & params
  const inferredKey = getEndpointPageKey(endpoint, params);
  if (inferredKey) {
    return isPageApiEnabled(inferredKey);
  }

  // 4. Default to global API status
  return !IS_MOCK_MODE && IS_API_ENABLED;
}
