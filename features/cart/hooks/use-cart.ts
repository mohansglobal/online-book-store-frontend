// Unified Cart hook for seamlessly handling authenticated (API) and guest (Zustand) carts
"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import {
  useGuestCartStore,
  selectCartItems as selectGuestItems,
  selectIsHydrated,
} from "../stores/use-guest-cart-store";
import { useCartQuery } from "../queries/use-cart-query";
import {
  useAddToCartMutation,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../mutations/use-cart-mutations";
import {
  calculateCartSummary,
  transformGuestItemsToViews,
  transformServerItemsToViews,
} from "../utils/cart-transform";
import type {
  AddToCartInput,
  CartItemView,
  CartSummaryView,
} from "../types/cart.types";

export type UseCartReturn = {
  items: CartItemView[];
  summary: CartSummaryView;
  totalCount: number;
  isLoggedIn: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isHydrated: boolean;
  addItem: (input: {
    listingId?: string;
    bookListingId?: string;
    bookId?: string;
    slug?: string;
    title: string;
    coverImage?: string;
    author?: string;
    seller?: string;
    format?: string;
    price: number;
    originalPrice?: number;
    quantity?: number;
  }) => Promise<void>;
  updateQuantity: (bookListingId: string, quantity: number) => Promise<void>;
  removeItem: (bookListingId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

export function useCart(): UseCartReturn {
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  // Server cart query (enabled when logged in)
  const {
    data: serverCartResponse,
    isLoading: isServerCartLoading,
    isFetching: isServerCartFetching,
  } = useCartQuery(isLoggedIn);

  // Guest cart store
  const guestItems = useGuestCartStore(selectGuestItems);
  const isGuestHydrated = useGuestCartStore(selectIsHydrated);
  const guestAddItem = useGuestCartStore((s) => s.addItem);
  const guestRemoveItem = useGuestCartStore((s) => s.removeItem);
  const guestUpdateQuantity = useGuestCartStore((s) => s.updateQuantity);
  const guestClearCart = useGuestCartStore((s) => s.clearCart);

  // Server mutations with optimistic updates
  const addMutation = useAddToCartMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  // Normalized items view
  const items: CartItemView[] = useMemo(() => {
    if (isLoggedIn && serverCartResponse?.data?.items) {
      return transformServerItemsToViews(serverCartResponse.data.items);
    }
    return transformGuestItemsToViews(guestItems);
  }, [isLoggedIn, serverCartResponse, guestItems]);

  // Normalized summary view
  const summary: CartSummaryView = useMemo(() => {
    return calculateCartSummary(items, serverCartResponse?.data, isLoggedIn);
  }, [items, serverCartResponse, isLoggedIn]);

  const totalCount = summary.totalCount;

  // Actions
  const handleAddItem = useCallback(
    async (input: {
      listingId?: string;
      bookListingId?: string;
      bookId?: string;
      slug?: string;
      title: string;
      coverImage?: string;
      author?: string;
      seller?: string;
      format?: string;
      price: number;
      originalPrice?: number;
      quantity?: number;
    }) => {
      const qty = input.quantity ?? 1;
      const listingId =
        input.bookListingId || input.listingId || input.bookId || "";

      if (isLoggedIn) {
        try {
          const payload: AddToCartInput = {
            bookListingId: listingId,
            quantity: qty,
          };

          await addMutation.mutateAsync(payload);
          toast.success(`"${input.title}" added to cart!`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message ||
            "Failed to add item to cart";
          toast.error(message);
        }
      } else {
        guestAddItem({
          listingId: listingId || input.title,
          bookId: input.bookId || listingId || input.title,
          slug: input.slug || listingId,
          title: input.title,
          coverImage: input.coverImage || FALLBACK_BOOK_COVER,
          author: input.author || "-",
          seller: input.seller,
          format: input.format || "Paperback",
          price: input.price,
          originalPrice: input.originalPrice || input.price,
          quantity: qty,
        });
        toast.success(`"${input.title}" added to cart!`);
      }
    },
    [isLoggedIn, addMutation, guestAddItem],
  );

  const handleUpdateQuantity = useCallback(
    async (bookListingId: string, quantity: number) => {
      if (quantity < 1) return;

      if (isLoggedIn) {
        try {
          await updateMutation.mutateAsync({
            bookListingId,
            quantity,
          });
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message ||
            "Failed to update quantity";
          toast.error(message);
        }
      } else {
        guestUpdateQuantity(bookListingId, quantity);
      }
    },
    [isLoggedIn, updateMutation, guestUpdateQuantity],
  );

  const handleRemoveItem = useCallback(
    async (bookListingId: string) => {
      if (isLoggedIn) {
        try {
          await removeMutation.mutateAsync(bookListingId);
          toast.success("Item removed from cart");
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to remove item";
          toast.error(message);
        }
      } else {
        const item = guestItems.find((i) => i.listingId === bookListingId);
        guestRemoveItem(bookListingId);
        if (item) {
          toast.success(`Removed "${item.title}" from cart`);
        }
      }
    },
    [isLoggedIn, removeMutation, guestItems, guestRemoveItem],
  );

  const handleClearCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await clearMutation.mutateAsync();
        toast.success("Cart cleared");
      } catch (err: unknown) {
        const message =
          (err as { message?: string })?.message || "Failed to clear cart";
        toast.error(message);
      }
    } else {
      guestClearCart();
      toast.success("Cart cleared");
    }
  }, [isLoggedIn, clearMutation, guestClearCart]);

  const isAuthSettled = !isAuthLoading;
  const isCartLoading =
    isAuthLoading ||
    (isLoggedIn && isServerCartLoading) ||
    (!isLoggedIn && !isGuestHydrated);

  return {
    items,
    summary,
    totalCount,
    isLoggedIn,
    isLoading: isCartLoading,
    isFetching: Boolean(isLoggedIn && isServerCartFetching),
    isHydrated: isAuthSettled && (isLoggedIn ? !isServerCartLoading : isGuestHydrated),
    addItem: handleAddItem,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
  };
}

