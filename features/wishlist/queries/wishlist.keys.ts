// Standardized TanStack Query keys for Wishlist server state

export const wishlistKeys = {
  all: ["wishlist"] as const,
  current: () => [...wishlistKeys.all, "current"] as const,
};
