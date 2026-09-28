// Standardized TanStack Query keys for Wishlist server state

export const wishlistKeys = {
  all: ["wishlist"] as const,
  current: () => [...wishlistKeys.all, "current"] as const,
  ids: () => [...wishlistKeys.all, "ids"] as const,
  check: (bookId: string) => [...wishlistKeys.all, "check", bookId] as const,
};
