// Cart API client functions matching /api/v1/cart backend endpoints
import { apiClient } from "@/lib/api";
import type {
  AddToCartInput,
  CartResponse,
  SyncCartInput,
  UpdateCartItemInput,
} from "../types/cart.types";

/**
 * Fetch authenticated user's cart with real-time calculated prices and stock.
 * GET /api/v1/cart
 */
export async function getCart(): Promise<CartResponse> {
  return apiClient.get<CartResponse>("/cart");
}

/**
 * Add an item to cart or increment quantity by bookListingId.
 * POST /api/v1/cart
 */
export async function addToCart(input: AddToCartInput): Promise<CartResponse> {
  const listingId =
    input.bookListingId || input.bookListing || input.listingId || input.bookId;
  const payload = {
    bookListingId: listingId,
    quantity: input.quantity ?? 1,
  };
  return apiClient.post<CartResponse>("/cart", payload);
}

/**
 * Batch synchronize guest cart or multiple items into user's cart.
 * POST /api/v1/cart/sync
 */
export async function syncCart(input: SyncCartInput): Promise<CartResponse> {
  return apiClient.post<CartResponse>("/cart/sync", input);
}

/**
 * Update the quantity of a specific cart item by bookListingId.
 * PATCH /api/v1/cart/:bookListingId
 */
export async function updateCartItem({
  bookListingId,
  quantity,
}: UpdateCartItemInput): Promise<CartResponse> {
  return apiClient.patch<CartResponse>(
    `/cart/${encodeURIComponent(bookListingId)}`,
    {
      quantity,
    },
  );
}

/**
 * Remove an individual item from the cart by bookListingId.
 * DELETE /api/v1/cart/:bookListingId
 */
export async function removeCartItem(
  bookListingId: string,
): Promise<CartResponse> {
  return apiClient.delete<CartResponse>(
    `/cart/${encodeURIComponent(bookListingId)}`,
  );
}

/**
 * Clear all items from user's cart.
 * DELETE /api/v1/cart
 */
export async function clearCart(): Promise<CartResponse> {
  return apiClient.delete<CartResponse>("/cart");
}
