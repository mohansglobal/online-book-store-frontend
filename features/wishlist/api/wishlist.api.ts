// Wishlist API client functions matching /api/v1/wishlist backend endpoints
import { apiClient } from "@/lib/api";
import type {
  AddWishlistApiInput,
  SyncWishlistInput,
  WishlistResponse,
} from "../types/wishlist.types";

/**
 * Fetch authenticated user's wishlist.
 * GET /api/v1/wishlist
 */
export async function getWishlist(): Promise<WishlistResponse> {
  return apiClient.get<WishlistResponse>("/wishlist");
}

/**
 * Add a book to user's wishlist.
 * POST /api/v1/wishlist
 */
export async function addToWishlist(
  input: AddWishlistApiInput,
): Promise<WishlistResponse> {
  const bookId = input.bookId || input.id || input.listingId;
  return apiClient.post<WishlistResponse>("/wishlist", { bookId });
}

/**
 * Batch synchronize guest wishlist into user's authenticated wishlist.
 * POST /api/v1/wishlist/sync
 */
export async function syncWishlist(
  input: SyncWishlistInput,
): Promise<WishlistResponse> {
  return apiClient.post<WishlistResponse>("/wishlist/sync", input);
}

/**
 * Remove an item from the wishlist by bookId.
 * DELETE /api/v1/wishlist/:id
 */
export async function removeFromWishlist(
  bookId: string,
): Promise<WishlistResponse> {
  return apiClient.delete<WishlistResponse>(
    `/wishlist/${encodeURIComponent(bookId)}`,
  );
}

/**
 * Clear all items from user's wishlist.
 * DELETE /api/v1/wishlist
 */
export async function clearWishlist(): Promise<WishlistResponse> {
  return apiClient.delete<WishlistResponse>("/wishlist");
}
