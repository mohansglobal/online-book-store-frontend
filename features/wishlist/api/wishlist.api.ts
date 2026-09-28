// Wishlist API client functions matching /api/v1/wishlist backend endpoints
import { apiClient } from "@/lib/api";
import type {
  AddWishlistApiInput,
  SyncWishlistInput,
  WishlistCheckResponse,
  WishlistIdsResponse,
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
 * Fetch list of all wishlisted canonical book IDs for authenticated user.
 * GET /api/v1/wishlist/ids
 */
export async function getWishlistIds(): Promise<WishlistIdsResponse> {
  return apiClient.get<WishlistIdsResponse>("/wishlist/ids");
}

/**
 * Check if a single book or listing is wishlisted.
 * GET /api/v1/wishlist/check/:bookId
 */
export async function checkBookInWishlist(
  bookId: string,
): Promise<WishlistCheckResponse> {
  return apiClient.get<WishlistCheckResponse>(
    `/wishlist/check/${encodeURIComponent(bookId)}`,
  );
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
