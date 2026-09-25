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
  | "addresses"
  | "profile"
  | "wishlist"
  | "auth"
  | "sellerDashboard"
  | "sellerInventory"
  | "sellerAddBook"
  | "sellerDiscounts";

export type PageIntegrationConfig = Record<PageIntegrationKey, boolean>;

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
  authorDetails: true, // Author dedicated page (GET /authors/:idOrSlug & PATCH /authors/:id) 

  // Book Catalog & Details Pages (Real backend API enabled) 
  books: true, 
  bookDetails: true, 
   
  // Book Purchase & Order Flow (Real backend at http://localhost:5000/api/v1) 
  cart: true,
  checkout: true,
  orders: true,
  addresses: true,
  profile: true,
  wishlist: true, 

  // Seller Pages
  sellerDashboard: false,
  sellerInventory: false,
  sellerAddBook: true,
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

  const cleanEndpoint = endpoint.replace(/^\/+/, "").toLowerCase().split("?")[0];
  const segments = cleanEndpoint.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const secondSegment = segments[1];

  if (firstSegment === "stats") {
    return "homepage";
  }

  if (firstSegment === "authors") {
    return secondSegment ? "authorDetails" : "authors";
  }

  if (firstSegment === "publishers") {
    return secondSegment ? "publisherDetails" : "publishers";
  }

  if (firstSegment === "categories") {
    return secondSegment ? "categoryDetails" : "categories";
  }

  if (firstSegment === "books" || firstSegment === "listings") {
    if (segments.includes("discount")) {
      return "sellerDiscounts";
    }
    return secondSegment ? "bookDetails" : "books";
  }

  if (firstSegment === "book-listings") {
    if (segments.includes("discount")) {
      return "sellerDiscounts";
    }
    return "sellerInventory";
  }

  if (firstSegment === "reviews") {
    return "bookDetails";
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

  if (firstSegment === "addresses") {
    return "addresses";
  }

  if (firstSegment === "users" || firstSegment === "countries") {
    return "profile";
  }

  if (firstSegment === "auth") {
    return "auth";
  }

  if (firstSegment === "seller") {
    if (secondSegment === "inventory") {
      return "sellerInventory";
    }
    if (secondSegment === "add-book" || secondSegment === "books") {
      return "sellerAddBook";
    }
    if (secondSegment === "discounts") {
      return "sellerDiscounts";
    }
    return "sellerDashboard";
  }

  if (firstSegment === "dashboard") {
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

  // 2. Image upload endpoints always route to Express backend
  const cleanEndpoint = endpoint.replace(/^\/+/, "").toLowerCase();
  const firstSegment = cleanEndpoint.split("/")[0];
  if (firstSegment === "upload") {
    return true;
  }

  // 3. If explicit page key is provided, check its status
  if (explicitPageKey && explicitPageKey in PAGE_INTEGRATION_FLAGS) {
    return isPageApiEnabled(explicitPageKey as PageIntegrationKey);
  }

  // 4. Infer page key from endpoint path & params
  const inferredKey = getEndpointPageKey(endpoint, params);
  if (inferredKey) {
    return isPageApiEnabled(inferredKey);
  }

  // 4. Default to global API status
  return !IS_MOCK_MODE && IS_API_ENABLED;
}
