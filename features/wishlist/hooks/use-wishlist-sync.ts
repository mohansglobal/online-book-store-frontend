"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth";
import {
  selectWishlistItems,
  selectIsWishlistHydrated,
  useWishlistStore,
} from "../stores/use-wishlist-store";
import { useSyncWishlistMutation } from "../mutations/use-wishlist-mutations";
import { wishlistKeys } from "../queries/wishlist.keys";
import type { SyncWishlistItemInput } from "../types/wishlist.types";

export function useWishlistSync() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const isHydrated = useWishlistStore(selectIsWishlistHydrated);
  const guestItems = useWishlistStore(selectWishlistItems);
  const clearGuestWishlist = useWishlistStore((state) => state.clearWishlist);

  const { mutateAsync: syncWishlistItems } = useSyncWishlistMutation();
  const isSyncing = useRef(false);

  useEffect(() => {
    // Only trigger if user is logged in, guest store has hydrated, and there are guest items
    if (!user || !isHydrated || guestItems.length === 0 || isSyncing.current) {
      return;
    }

    const payload: SyncWishlistItemInput[] = guestItems
      .map((item) => ({
        bookId: item.id || item.bookId,
      }))
      .filter((item) => Boolean(item.bookId));

    if (payload.length === 0) {
      clearGuestWishlist();
      return;
    }

    async function handleSync() {
      isSyncing.current = true;

      try {
        const response = await syncWishlistItems(payload);

        if (response?.success) {
          // Clear the Zustand guest wishlist store and local storage
          clearGuestWishlist();
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("guest-wishlist");
          }

          // Refetch user's authoritative wishlist from retrieve API
          await queryClient.refetchQueries({
            queryKey: wishlistKeys.current(),
          });

          toast.success("Wishlist synced successfully.");
        }
      } catch (error) {
        console.error("Failed to sync guest wishlist:", error);
      } finally {
        isSyncing.current = false;
      }
    }

    void handleSync();
  }, [
    user,
    isHydrated,
    guestItems,
    syncWishlistItems,
    clearGuestWishlist,
    queryClient,
  ]);
}
