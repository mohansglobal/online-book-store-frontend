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
import type {
  AddToCartInput,
  CartItemView,
  CartSummaryView,
  GuestCartItem,
} from "../types/cart.types";

export type UseCartReturn = {
  items: CartItemView[];
  summary: CartSummaryView;
  totalCount: number;
  isLoggedIn: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  addItem: (input: {
    listingId?: string;
    bookId?: string;
    slug?: string;
    title: string;
    coverImage?: string;
    author?: string;
    format?: string;
    price: number;
    originalPrice?: number;
    quantity?: number;
  }) => Promise<void>;
  updateQuantity: (identifier: string, quantity: number) => Promise<void>;
  removeItem: (identifier: string) => Promise<void>;
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

  // Server mutations
  const addMutation = useAddToCartMutation();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  // Normalized items view
  const items: CartItemView[] = useMemo(() => {
    if (isLoggedIn && serverCartResponse?.data?.items) {
      return serverCartResponse.data.items.map((item) => {
        const book = item.listing?.book;
        const authorsText =
          book?.authors && book.authors.length > 0
            ? book.authors.map((a) => a.name).join(", ")
            : "Unknown Author";

        const priceInRupees = (item.unitPriceInPaise || 0) / 100;
        const mrpInRupees = (item.unitMrpInPaise || 0) / 100;
        const subtotalInRupees = (item.itemSubtotalInPaise || 0) / 100;
        const savingsInRupees = (item.itemSavingsInPaise || 0) / 100;

        return {
          id: item.id,
          listingId: item.listing?._id || item.id,
          bookId: book?._id || "",
          slug: book?.slug || "",
          title: book?.title || "Untitled Book",
          author: authorsText,
          coverImage: book?.coverImage || FALLBACK_BOOK_COVER,
          format: book?.format || "Paperback",
          price: priceInRupees,
          originalPrice: mrpInRupees || priceInRupees,
          quantity: item.quantity,
          subtotal: subtotalInRupees,
          savings: savingsInRupees,
          isAvailable: item.isAvailable,
          isOutOfStock: item.isOutOfStock,
          exceedsStock: item.exceedsStock,
          availableStock: item.availableStock,
        };
      });
    }

    // Guest cart view
    return guestItems.map((g: GuestCartItem) => ({
      id: g.listingId,
      listingId: g.listingId,
      bookId: g.bookId,
      slug: g.slug,
      title: g.title,
      author: g.author,
      coverImage: g.coverImage,
      format: g.format,
      price: g.price,
      originalPrice: g.originalPrice || g.price,
      quantity: g.quantity,
      subtotal: g.price * g.quantity,
      savings: Math.max(0, (g.originalPrice || g.price) - g.price) * g.quantity,
      isAvailable: true,
      isOutOfStock: false,
      exceedsStock: false,
    }));
  }, [isLoggedIn, serverCartResponse, guestItems]);

  // Normalized summary view
  const summary: CartSummaryView = useMemo(() => {
    if (isLoggedIn && serverCartResponse?.data?.summary) {
      const s = serverCartResponse.data.summary;
      const subtotal = (s.subtotalInPaise || 0) / 100;
      const totalMrp = (s.totalMrpInPaise || 0) / 100;
      const totalDiscount = (s.totalDiscountInPaise || 0) / 100;
      const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

      return {
        totalItems: s.totalItems,
        totalCount,
        subtotal,
        totalMrp,
        mrpSavings: Math.max(0, totalMrp - subtotal),
        totalDiscount,
        hasUnavailableItems: s.hasUnavailableItems,
        hasStockIssues: s.hasStockIssues,
      };
    }

    // Guest summary
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const totalMrp = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      totalItems: items.length,
      totalCount,
      subtotal,
      totalMrp,
      mrpSavings: Math.max(0, totalMrp - subtotal),
      totalDiscount: Math.max(0, totalMrp - subtotal),
      hasUnavailableItems: false,
      hasStockIssues: false,
    };
  }, [isLoggedIn, serverCartResponse, items]);

  const totalCount = summary.totalCount;

  // Actions
  const handleAddItem = useCallback(
    async (input: {
      listingId?: string;
      bookId?: string;
      slug?: string;
      title: string;
      coverImage?: string;
      author?: string;
      format?: string;
      price: number;
      originalPrice?: number;
      quantity?: number;
    }) => {
      const qty = input.quantity ?? 1;

      if (isLoggedIn) {
        try {
          const payload: AddToCartInput = {
            quantity: qty,
          };
          if (input.listingId && input.listingId !== input.bookId) {
            payload.listingId = input.listingId;
          } else if (input.bookId) {
            payload.bookId = input.bookId;
          } else if (input.listingId) {
            payload.listingId = input.listingId;
          }

          await addMutation.mutateAsync(payload);
          toast.success(`"${input.title}" added to cart!`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to add item to cart";
          toast.error(message);
        }
      } else {
        guestAddItem({
          listingId: input.listingId || input.bookId || input.title,
          bookId: input.bookId || input.listingId || input.title,
          slug: input.slug || "",
          title: input.title,
          coverImage: input.coverImage || FALLBACK_BOOK_COVER,
          author: input.author || "-",
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
    async (identifier: string, quantity: number) => {
      if (quantity < 1) return;

      if (isLoggedIn) {
        try {
          await updateMutation.mutateAsync({ itemId: identifier, quantity });
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to update quantity";
          toast.error(message);
        }
      } else {
        guestUpdateQuantity(identifier, quantity);
      }
    },
    [isLoggedIn, updateMutation, guestUpdateQuantity],
  );

  const handleRemoveItem = useCallback(
    async (identifier: string) => {
      if (isLoggedIn) {
        try {
          await removeMutation.mutateAsync(identifier);
          toast.success("Item removed from cart");
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to remove item";
          toast.error(message);
        }
      } else {
        const item = guestItems.find((i) => i.listingId === identifier);
        guestRemoveItem(identifier);
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

  return {
    items,
    summary,
    totalCount,
    isLoggedIn,
    isLoading: isAuthLoading || (isLoggedIn && (isServerCartLoading || isServerCartFetching)),
    isHydrated: isLoggedIn ? true : isGuestHydrated,
    addItem: handleAddItem,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
  };
}
