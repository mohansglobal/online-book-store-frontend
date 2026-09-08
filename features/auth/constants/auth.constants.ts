// auth domain & route constants

import type { UserRole } from "../types/auth.types";

export const USER_ROLES = {
  BUYER: "BUYER",
  SELLER: "SELLER",
} as const satisfies Record<string, UserRole>;

export const SELLER_ROUTES = [
  "/dashboard",
  "/inventory",
  "/add-book",
  "/manage-discounts",
] as const;

export const BUYER_ONLY_ROUTES = [
  "/checkout",
  "/orders",
  "/wishlist",
] as const;

export const AUTHENTICATED_ROUTES = [
  "/profile",
  "/account",
] as const;

export const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/cart",
  "/books",
  "/authors",
  "/publishers",
  "/categories",
  "/category",
] as const;

export const AUTH_COOKIE_NAMES = [
  "accessToken",
  "refreshToken",
  "token",
] as const;

export const DEFAULT_ROLE_HOME: Record<UserRole, string> = {
  [USER_ROLES.BUYER]: "/",
  [USER_ROLES.SELLER]: "/dashboard",
};
