// auth redirect and security utilities

import {
  AUTHENTICATED_ROUTES,
  BUYER_ONLY_ROUTES,
  DEFAULT_ROLE_HOME,
  GUEST_ONLY_ROUTES,
  PUBLIC_ROUTES,
  SELLER_ROUTES,
  USER_ROLES,
} from "../constants/auth.constants";
import type { UserRole } from "../types/auth.types";

/**
 * Builds the full relative path including search params (e.g. `/checkout?coupon=SAVE10`).
 */
export function getCurrentRedirectPath(
  pathname: string,
  searchParams?: URLSearchParams | string | null,
): string {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (!searchParams) {
    return cleanPath;
  }

  const queryStr =
    typeof searchParams === "string"
      ? searchParams.replace(/^\?/, "")
      : searchParams.toString();

  return queryStr ? `${cleanPath}?${queryStr}` : cleanPath;
}

/**
 * Validates and sanitizes a redirect target URL to prevent Open Redirect vulnerabilities.
 * Strips protocol schemes, double-slashes, backslashes, and javascript pseudo-protocols.
 */
export function sanitizeRedirectUrl(
  redirect: string | null | undefined,
  fallback: string = "/",
): string {
  if (!redirect || typeof redirect !== "string") {
    return fallback;
  }

  const trimmed = redirect.trim();

  // Must begin with a single forward slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Prevent protocol-relative URLs (e.g., //evil.com or ///evil.com)
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Prevent backslash evasion (e.g., /\evil.com, /\\evil.com)
  if (trimmed.includes("\\")) {
    return fallback;
  }

  // Prevent embedded URI schemes (e.g., /?redirect=javascript:alert(1), /http://evil.com)
  if (/^\/[a-zA-Z0-9+.-]+:/.test(trimmed) || /javascript:/i.test(trimmed) || /data:/i.test(trimmed)) {
    return fallback;
  }

  // Prevent control characters and null bytes
  if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

/**
 * Verifies whether a given path is permitted for the specified user role.
 */
export function isRouteAllowedForRole(
  route: string,
  role?: UserRole | null,
): boolean {
  const sanitized = sanitizeRedirectUrl(route, "/");
  const pathOnly = sanitized.split("?")[0].split("#")[0];

  const isSellerRoute = SELLER_ROUTES.some(
    (sellerPath) => pathOnly === sellerPath || pathOnly.startsWith(`${sellerPath}/`),
  );

  const isBuyerOnlyRoute = BUYER_ONLY_ROUTES.some(
    (buyerPath) => pathOnly === buyerPath || pathOnly.startsWith(`${buyerPath}/`),
  );

  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some(
    (authPath) => pathOnly === authPath || pathOnly.startsWith(`${authPath}/`),
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (publicPath) =>
      pathOnly === publicPath ||
      (publicPath !== "/" && pathOnly.startsWith(`${publicPath}/`)),
  );

  // Unauthenticated user
  if (!role) {
    return !isSellerRoute && !isBuyerOnlyRoute && !isAuthenticatedRoute;
  }

  // Buyer user
  if (role === USER_ROLES.BUYER) {
    if (isSellerRoute) {
      return false;
    }
    return true;
  }

  // Seller user
  if (role === USER_ROLES.SELLER) {
    if (isBuyerOnlyRoute) {
      return false;
    }
    return true;
  }

  return isPublicRoute;
}

/**
 * Determines a secure post-login destination validating both URL safety and role permissions.
 */
export function getSafePostLoginRedirect({
  redirect,
  role,
}: {
  redirect?: string | null;
  role: UserRole;
}): string {
  const defaultHome = DEFAULT_ROLE_HOME[role] || "/";

  if (!redirect) {
    return defaultHome;
  }

  const safeTarget = sanitizeRedirectUrl(redirect, defaultHome);

  // Disallow redirecting back to login or register
  const pathOnly = safeTarget.split("?")[0];
  if (GUEST_ONLY_ROUTES.includes(pathOnly as (typeof GUEST_ONLY_ROUTES)[number])) {
    return defaultHome;
  }

  // Ensure the target is permitted for the user's role
  if (!isRouteAllowedForRole(safeTarget, role)) {
    return defaultHome;
  }

  return safeTarget;
}

/**
 * Returns default home route for a given user role.
 */
export function getHomeRouteForRole(role?: UserRole | null): string {
  if (!role) return "/";
  return DEFAULT_ROLE_HOME[role] || "/";
}
