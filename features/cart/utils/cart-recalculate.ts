// Utility functions for optimistically recalculating cart state
import type { AddToCartInput, CartData } from "../types/cart.types";

export function recalculateCartDataWithUpdatedQuantity(
  cartData: CartData,
  bookListingId: string,
  newQuantity: number,
): CartData {
  const updatedItems = (cartData.items || []).map((item) => {
    if (item.bookListingId !== bookListingId) return item;

    const priceInPaise =
      typeof item.priceInPaise === "number"
        ? item.priceInPaise
        : (item.priceInRupees || 0) * 100;
    const priceInRupees =
      typeof item.priceInRupees === "number"
        ? item.priceInRupees
        : priceInPaise / 100;

    const subtotalInPaise = priceInPaise * newQuantity;
    const subtotalInRupees = priceInRupees * newQuantity;

    return {
      ...item,
      quantity: newQuantity,
      subtotalInPaise,
      subtotalInRupees,
    };
  });

  const totalItemsCount = updatedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalAmountInPaise = updatedItems.reduce(
    (sum, item) => sum + item.subtotalInPaise,
    0,
  );
  const totalAmountInRupees = updatedItems.reduce(
    (sum, item) => sum + item.subtotalInRupees,
    0,
  );

  return {
    ...cartData,
    items: updatedItems,
    totalItemsCount,
    totalAmountInPaise,
    totalAmountInRupees,
  };
}

export function recalculateCartDataWithRemovedItem(
  cartData: CartData,
  bookListingId: string,
): CartData {
  const updatedItems = (cartData.items || []).filter(
    (item) => item.bookListingId !== bookListingId,
  );

  const totalItemsCount = updatedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalAmountInPaise = updatedItems.reduce(
    (sum, item) => sum + item.subtotalInPaise,
    0,
  );
  const totalAmountInRupees = updatedItems.reduce(
    (sum, item) => sum + item.subtotalInRupees,
    0,
  );

  return {
    ...cartData,
    items: updatedItems,
    totalItemsCount,
    totalAmountInPaise,
    totalAmountInRupees,
  };
}

export function recalculateCartDataWithAddedItem(
  cartData: CartData,
  input: AddToCartInput,
): CartData {
  const listingId =
    input.bookListingId || input.bookListing || input.listingId;
  const quantity = input.quantity ?? 1;

  if (!listingId) return cartData;

  const existingItem = (cartData.items || []).find(
    (i) => i.bookListingId === listingId,
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    return recalculateCartDataWithUpdatedQuantity(
      cartData,
      listingId,
      newQty,
    );
  }

  return cartData;
}

export function createEmptyCartData(cartData: CartData): CartData {
  return {
    ...cartData,
    items: [],
    totalItemsCount: 0,
    totalAmountInPaise: 0,
    totalAmountInRupees: 0,
  };
}
