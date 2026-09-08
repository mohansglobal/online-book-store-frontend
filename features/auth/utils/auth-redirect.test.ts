// unit test validation for auth redirect security functions

import {
  getCurrentRedirectPath,
  getHomeRouteForRole,
  getSafePostLoginRedirect,
  isRouteAllowedForRole,
  sanitizeRedirectUrl,
} from "./auth-redirect";
import { USER_ROLES } from "../constants/auth.constants";

export function runAuthRedirectTests() {
  const failures: string[] = [];

  function assertEqual(name: string, actual: unknown, expected: unknown) {
    if (actual !== expected) {
      failures.push(
        `FAIL [${name}]: expected "${String(expected)}", received "${String(actual)}"`,
      );
    }
  }

  // 1. Open Redirect & Malicious URL Sanitization
  assertEqual("Blocks protocol-relative //evil.com", sanitizeRedirectUrl("//evil.com"), "/");
  assertEqual("Blocks absolute https://evil.com", sanitizeRedirectUrl("https://evil.com"), "/");
  assertEqual("Blocks javascript:alert(1)", sanitizeRedirectUrl("javascript:alert(1)"), "/");
  assertEqual("Blocks /javascript:alert(1)", sanitizeRedirectUrl("/javascript:alert(1)"), "/");
  assertEqual("Blocks backslash evasion /\\evil.com", sanitizeRedirectUrl("/\\evil.com"), "/");
  assertEqual("Blocks backslash evasion /\\\\evil.com", sanitizeRedirectUrl("/\\\\evil.com"), "/");
  assertEqual("Allows valid relative path /checkout", sanitizeRedirectUrl("/checkout"), "/checkout");
  assertEqual(
    "Allows valid relative path with query /checkout?coupon=SAVE10",
    sanitizeRedirectUrl("/checkout?coupon=SAVE10"),
    "/checkout?coupon=SAVE10",
  );
  assertEqual("Allows nested seller route /dashboard/inventory", sanitizeRedirectUrl("/dashboard/inventory"), "/dashboard/inventory");

  // 2. Query String Preservation in getCurrentRedirectPath
  assertEqual(
    "Preserves pathname and query string",
    getCurrentRedirectPath("/checkout", new URLSearchParams({ coupon: "SAVE10", qty: "2" })),
    "/checkout?coupon=SAVE10&qty=2",
  );
  assertEqual(
    "Preserves raw string query",
    getCurrentRedirectPath("/checkout", "coupon=SAVE10"),
    "/checkout?coupon=SAVE10",
  );
  assertEqual(
    "Handles no query param",
    getCurrentRedirectPath("/checkout"),
    "/checkout",
  );

  // 3. Role Route Permissions
  assertEqual("BUYER cannot access /dashboard", isRouteAllowedForRole("/dashboard", USER_ROLES.BUYER), false);
  assertEqual("BUYER cannot access /inventory", isRouteAllowedForRole("/inventory", USER_ROLES.BUYER), false);
  assertEqual("BUYER can access /checkout", isRouteAllowedForRole("/checkout", USER_ROLES.BUYER), true);
  assertEqual("BUYER can access /", isRouteAllowedForRole("/", USER_ROLES.BUYER), true);
  assertEqual("BUYER can access /cart", isRouteAllowedForRole("/cart", USER_ROLES.BUYER), true);

  assertEqual("SELLER cannot access /checkout", isRouteAllowedForRole("/checkout", USER_ROLES.SELLER), false);
  assertEqual("SELLER can access /dashboard", isRouteAllowedForRole("/dashboard", USER_ROLES.SELLER), true);
  assertEqual("SELLER can access /inventory", isRouteAllowedForRole("/inventory", USER_ROLES.SELLER), true);
  assertEqual("SELLER can access /add-book", isRouteAllowedForRole("/add-book", USER_ROLES.SELLER), true);

  // 4. Safe Post-Login Redirect Resolution
  assertEqual(
    "BUYER with /dashboard redirect falls back to /",
    getSafePostLoginRedirect({ redirect: "/dashboard", role: USER_ROLES.BUYER }),
    "/",
  );
  assertEqual(
    "BUYER with //evil.com redirect falls back to /",
    getSafePostLoginRedirect({ redirect: "//evil.com", role: USER_ROLES.BUYER }),
    "/",
  );
  assertEqual(
    "BUYER with /checkout?coupon=SAVE10 redirect stays /checkout?coupon=SAVE10",
    getSafePostLoginRedirect({ redirect: "/checkout?coupon=SAVE10", role: USER_ROLES.BUYER }),
    "/checkout?coupon=SAVE10",
  );
  assertEqual(
    "SELLER with /dashboard redirect stays /dashboard",
    getSafePostLoginRedirect({ redirect: "/dashboard", role: USER_ROLES.SELLER }),
    "/dashboard",
  );
  assertEqual(
    "SELLER with /checkout redirect falls back to /dashboard",
    getSafePostLoginRedirect({ redirect: "/checkout", role: USER_ROLES.SELLER }),
    "/dashboard",
  );
  assertEqual(
    "SELLER with /login redirect falls back to /dashboard",
    getSafePostLoginRedirect({ redirect: "/login", role: USER_ROLES.SELLER }),
    "/dashboard",
  );
  assertEqual(
    "BUYER with /login redirect falls back to /",
    getSafePostLoginRedirect({ redirect: "/login", role: USER_ROLES.BUYER }),
    "/",
  );

  // 5. Default Role Home
  assertEqual("SELLER default home is /dashboard", getHomeRouteForRole(USER_ROLES.SELLER), "/dashboard");
  assertEqual("BUYER default home is /", getHomeRouteForRole(USER_ROLES.BUYER), "/");
  assertEqual("Null role default home is /", getHomeRouteForRole(null), "/");

  if (failures.length > 0) {
    console.error("Auth redirect tests failed:\n" + failures.join("\n"));
    throw new Error(`${failures.length} test assertions failed.`);
  }

  return true;
}
