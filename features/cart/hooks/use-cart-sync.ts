"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth";
import {
  selectCartItems,
  selectIsHydrated,
  useGuestCartStore,
} from "../stores/use-guest-cart-store";
import { useSyncCartMutation } from "../mutations/use-cart-mutations";
import { cartKeys } from "../queries/cart.keys";
import type { SyncCartItemInput } from "../types/cart.types";

export function useCartSync() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const isHydrated = useGuestCartStore(selectIsHydrated);
  const guestItems = useGuestCartStore(selectCartItems);
  const clearGuestCart = useGuestCartStore((state) => state.clearCart);

  const { mutateAsync: syncCartItems } = useSyncCartMutation();
  const isSyncing = useRef(false);

  useEffect(() => {
    // Only trigger if user is logged in, guest store has hydrated, and there are guest items
    if (!user || !isHydrated || guestItems.length === 0 || isSyncing.current) {
      return;
    }

    const payload: SyncCartItemInput[] = guestItems
      .map((item) => ({
        bookListingId: item.listingId || item.bookId,
        quantity: item.quantity > 0 ? item.quantity : 1,
      }))
      .filter((item) => Boolean(item.bookListingId));

    if (payload.length === 0) {
      clearGuestCart();
      return;
    }

    async function handleSync() {
      isSyncing.current = true;

      try {
        const response = await syncCartItems(payload);

        if (response?.success) {
          // Clear the Zustand guest cart store and local storage
          clearGuestCart();
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("guest-cart");
          }

          // Refetch user's authoritative cart from retrieve API
          await queryClient.refetchQueries({
            queryKey: cartKeys.current(),
          });

          toast.success("Cart synced successfully.");
        }
      } catch (error) {
        console.error("Failed to sync guest cart:", error);
      } finally {
        isSyncing.current = false;
      }
    }

    void handleSync();
  }, [user, isHydrated, guestItems, syncCartItems, clearGuestCart, queryClient]);
}