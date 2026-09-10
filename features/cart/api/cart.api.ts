// Cart API client functions matching /api/v1/cart backend endpoints

import { apiClient } from "@/lib/api";
import type {
  AddToCartInput,
  CartResponse,
  MergeCartInput,
  UpdateCartItemInput,
} from "../types/cart.types";

/**
 * Fetch authenticated user's cart with real-time calculated prices and stock.
 */
export async function getCart(): Promise<CartResponse> {
  return apiClient.get<CartResponse>("/cart");
}

/**
 * Add an item to cart or increment quantity by listingId or bookId.
 */
export async function addToCart(input: AddToCartInput): Promise<CartResponse> {
  return apiClient.post<CartResponse>("/cart/items", input);
}

/**
 * Update the quantity of a specific cart item.
 * Setting quantity to 0 removes the item.
 */
export async function updateCartItem({
  itemId,
  quantity,
}: UpdateCartItemInput): Promise<CartResponse> {
  return apiClient.patch<CartResponse>(`/cart/items/${itemId}`, { quantity });
}

/**
 * Remove an individual item from the cart.
 */
export async function removeCartItem(itemId: string): Promise<CartResponse> {
  return apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
}

/**
 * Clear all items from user's cart.
 */
export async function clearCart(): Promise<CartResponse> {
  return apiClient.delete<CartResponse>("/cart");
}

/**
 * Merge guest cart items into user's cart on login.
 */
export async function mergeCart(input: MergeCartInput): Promise<CartResponse> {
  return apiClient.post<CartResponse>("/cart/merge", input);
}
