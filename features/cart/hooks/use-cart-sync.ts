"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useCurrentUser } from "@/features/auth";

import {
  selectCartItems,
  selectIsHydrated,
  useGuestCartStore,
} from "../stores/use-guest-cart-store";

import { useMergeCartMutation } from "../mutations/use-cart-mutations";

import type {
  GuestCartItem,
  MergeCartItemInput,
} from "../types/cart.types";

function prepareCartItems(items: GuestCartItem[]): MergeCartItemInput[] {
  return items
    .map((item) => {
      if (item.listingId) {
        return {
          listingId: item.listingId,
          quantity: item.quantity,
        };
      }

      return {
        bookId: item.bookId,
        quantity: item.quantity,
      };
    })
    .filter((item) => {
      const hasId = Boolean(item.listingId || item.bookId);
      const hasValidQuantity = item.quantity > 0;

      return hasId && hasValidQuantity;
    });
}

export function useCartSync() {
  const { data: user } = useCurrentUser();

  const isHydrated = useGuestCartStore(selectIsHydrated);
  const guestItems = useGuestCartStore(selectCartItems);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  const { mutateAsync: mergeCart } = useMergeCartMutation();

  const isSyncing = useRef(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!isHydrated) {
      return;
    }

    if (guestItems.length === 0) {
      return;
    }

    if (isSyncing.current) {
      return;
    }

    async function syncCart() {
      const items = prepareCartItems(guestItems);

      if (items.length === 0) {
        return;
      }

      isSyncing.current = true;

      try {
        await mergeCart({ items });

        clearGuestCart();

        toast.success("Cart synced successfully.");
      } catch (error) {
        console.error("Failed to sync guest cart:", error);

        toast.error("Failed to sync your cart.");
      } finally {
        isSyncing.current = false;
      }
    }

    syncCart();
  }, [
    user,
    isHydrated,
    guestItems,
    mergeCart,
    clearGuestCart,
  ]);
}