import { describe, it, expect } from "vitest";
import {
  getCurrentRedirectPath,
  getHomeRouteForRole,
  getSafePostLoginRedirect,
  isRouteAllowedForRole,
  sanitizeRedirectUrl,
} from "./auth-redirect";
import { USER_ROLES } from "../constants/auth.constants";

describe("auth-redirect utils", () => {
  describe("sanitizeRedirectUrl", () => {
    it("should block protocol-relative, absolute, and javascript URLs", () => {
      expect(sanitizeRedirectUrl("//evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("https://evil.com")).toBe("/");
      expect(sanitizeRedirectUrl("javascript:alert(1)")).toBe("/");
      expect(sanitizeRedirectUrl("/javascript:alert(1)")).toBe("/");
      expect(sanitizeRedirectUrl("/\\evil.com")).toBe("/");
    });

    it("should allow valid relative paths with query parameters", () => {
      expect(sanitizeRedirectUrl("/checkout")).toBe("/checkout");
      expect(sanitizeRedirectUrl("/checkout?coupon=SAVE10")).toBe("/checkout?coupon=SAVE10");
      expect(sanitizeRedirectUrl("/dashboard/inventory")).toBe("/dashboard/inventory");
    });
  });

  describe("getCurrentRedirectPath", () => {
    it("should preserve pathname and query string", () => {
      expect(
        getCurrentRedirectPath("/checkout", new URLSearchParams({ coupon: "SAVE10", qty: "2" })),
      ).toBe("/checkout?coupon=SAVE10&qty=2");
    });
  });

  describe("isRouteAllowedForRole", () => {
    it("should validate buyer vs seller allowed routes", () => {
      expect(isRouteAllowedForRole("/dashboard", USER_ROLES.BUYER)).toBe(false);
      expect(isRouteAllowedForRole("/checkout", USER_ROLES.BUYER)).toBe(true);
      expect(isRouteAllowedForRole("/checkout", USER_ROLES.SELLER)).toBe(false);
      expect(isRouteAllowedForRole("/dashboard", USER_ROLES.SELLER)).toBe(true);
    });
  });

  describe("getSafePostLoginRedirect", () => {
    it("should return safe post-login redirect based on user role", () => {
      expect(
        getSafePostLoginRedirect({ redirect: "/dashboard", role: USER_ROLES.BUYER }),
      ).toBe("/");
      expect(
        getSafePostLoginRedirect({ redirect: "/checkout?coupon=SAVE10", role: USER_ROLES.BUYER }),
      ).toBe("/checkout?coupon=SAVE10");
      expect(
        getSafePostLoginRedirect({ redirect: "/dashboard", role: USER_ROLES.SELLER }),
      ).toBe("/dashboard");
    });
  });

  describe("getHomeRouteForRole", () => {
    it("should return appropriate home route for roles", () => {
      expect(getHomeRouteForRole(USER_ROLES.SELLER)).toBe("/dashboard");
      expect(getHomeRouteForRole(USER_ROLES.BUYER)).toBe("/");
      expect(getHomeRouteForRole(null)).toBe("/");
    });
  });
});
