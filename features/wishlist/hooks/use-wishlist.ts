// React hook for wishlist operations and cart integration
"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth";
import { useCart } from "@/features/cart";
import {
  selectIsWishlistHydrated,
  selectWishlistItems,
  useWishlistStore,
} from "../stores/use-wishlist-store";
import { useWishlistQuery } from "../queries/use-wishlist-query";
import {
  useAddToWishlistMutation,
  useClearWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../mutations/use-wishlist-mutations";
import { transformServerWishlistToViews } from "../utils/wishlist-transform";
import type { AddWishlistItemInput, WishlistItem } from "../types/wishlist.types";

export type UseWishlistReturn = {
  items: WishlistItem[];
  count: number;
  isHydrated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  addItem: (item: AddWishlistItemInput) => Promise<void>;
  removeItem: (itemOrId: WishlistItem | string) => Promise<void>;
  toggleWishlist: (item: AddWishlistItemInput) => Promise<boolean>;
  moveToCart: (item: WishlistItem, removeFromList?: boolean) => void;
  moveAllToCart: () => void;
  clearWishlist: () => Promise<void>;
  isInWishlist: (idOrSlug: string) => boolean;
};

export function useWishlist(): UseWishlistReturn {
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  // Server wishlist query
  const {
    data: serverWishlistResponse,
    isLoading: isServerWishlistLoading,
    isFetching: isServerWishlistFetching,
  } = useWishlistQuery(isLoggedIn);

  // Guest wishlist store
  const guestItems = useWishlistStore(selectWishlistItems);
  const isGuestHydrated = useWishlistStore(selectIsWishlistHydrated);
  const guestAddItem = useWishlistStore((s) => s.addItem);
  const guestRemoveItem = useWishlistStore((s) => s.removeItem);
  const guestToggleItem = useWishlistStore((s) => s.toggleItem);
  const guestClearWishlist = useWishlistStore((s) => s.clearWishlist);

  // Server mutations
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();
  const clearMutation = useClearWishlistMutation();

  const { addItem: addToCartStore } = useCart();

  // Unified items view
  const items: WishlistItem[] = useMemo(() => {
    if (isLoggedIn && serverWishlistResponse?.data?.items) {
      return transformServerWishlistToViews(serverWishlistResponse.data.items);
    }
    return guestItems;
  }, [isLoggedIn, serverWishlistResponse, guestItems]);

  const count = items.length;

  const isInWishlist = useCallback(
    (idOrSlug: string) => {
      if (!idOrSlug) return false;
      const lower = idOrSlug.toLowerCase();
      return items.some(
        (i) =>
          i.id === idOrSlug ||
          i.slug === idOrSlug ||
          (i.title && i.title.toLowerCase() === lower),
      );
    },
    [items],
  );

  const handleToggle = useCallback(
    async (input: AddWishlistItemInput): Promise<boolean> => {
      const id = input.id || input.listingId || input.bookId || "";
      const currentlyInWishlist = isInWishlist(id || input.slug || input.title);

      if (isLoggedIn) {
        if (currentlyInWishlist) {
          try {
            await removeMutation.mutateAsync(id);
            toast.info(`"${input.title}" removed from wishlist.`);
            return false;
          } catch (err: unknown) {
            const message =
              (err as { message?: string })?.message || "Failed to remove from wishlist";
            toast.error(message);
            return true;
          }
        } else {
          try {
            await addMutation.mutateAsync({ id });
            toast.success(`"${input.title}" added to wishlist!`);
            return true;
          } catch (err: unknown) {
            const message =
              (err as { message?: string })?.message || "Failed to add to wishlist";
            toast.error(message);
            return false;
          }
        }
      } else {
        const added = guestToggleItem({ ...input, id });
        if (added) {
          toast.success(`"${input.title}" added to wishlist!`);
        } else {
          toast.info(`"${input.title}" removed from wishlist.`);
        }
        return added;
      }
    },
    [isLoggedIn, isInWishlist, addMutation, removeMutation, guestToggleItem],
  );

  const handleAddItem = useCallback(
    async (input: AddWishlistItemInput) => {
      const id = input.id || input.listingId || input.bookId || "";
      if (isLoggedIn) {
        try {
          await addMutation.mutateAsync({ id });
          toast.success(`"${input.title}" added to wishlist!`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to add to wishlist";
          toast.error(message);
        }
      } else {
        guestAddItem({ ...input, id });
        toast.success(`"${input.title}" added to wishlist!`);
      }
    },
    [isLoggedIn, addMutation, guestAddItem],
  );

  const handleRemove = useCallback(
    async (itemOrId: WishlistItem | string) => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId.id || itemOrId.bookId || "";
      const title = typeof itemOrId === "string" ? "Item" : itemOrId.title;

      if (isLoggedIn) {
        try {
          await removeMutation.mutateAsync(id);
          toast.success(`Removed "${title}" from wishlist`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to remove item";
          toast.error(message);
        }
      } else {
        guestRemoveItem(id);
        toast.success(`Removed "${title}" from wishlist`);
      }
    },
    [isLoggedIn, removeMutation, guestRemoveItem],
  );

  const handleClearWishlist = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await clearMutation.mutateAsync();
        toast.success("Wishlist cleared");
      } catch (err: unknown) {
        const message =
          (err as { message?: string })?.message || "Failed to clear wishlist";
        toast.error(message);
      }
    } else {
      guestClearWishlist();
      toast.success("Wishlist cleared");
    }
  }, [isLoggedIn, clearMutation, guestClearWishlist]);

  const handleMoveToCart = useCallback(
    (item: WishlistItem, removeFromList = true) => {
      const listingId = item.listingId || item.id || item.bookId;
      addToCartStore({
        listingId,
        bookListingId: listingId,
        bookId: item.bookId || item.id,
        slug: item.slug || item.id,
        title: item.title,
        coverImage: item.coverImage,
        author: item.author,
        seller: item.seller,
        format: item.format || "Paperback",
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: item.quantity ?? 1,
      });

      if (removeFromList) {
        void handleRemove(item);
      }

      toast.success(`"${item.title}" moved to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => {
            window.location.href = "/cart";
          },
        },
      });
    },
    [addToCartStore, handleRemove],
  );

  const handleMoveAllToCart = useCallback(() => {
    const inStockItems = items.filter((item) => item.inStock !== false);
    if (inStockItems.length === 0) {
      toast.error("No in-stock items available to move to cart.");
      return;
    }

    inStockItems.forEach((item) => {
      const listingId = item.listingId || item.id || item.bookId;
      addToCartStore({
        listingId,
        bookListingId: listingId,
        bookId: item.bookId || item.id,
        slug: item.slug || item.id,
        title: item.title,
        coverImage: item.coverImage,
        author: item.author,
        seller: item.seller,
        format: item.format || "Paperback",
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: item.quantity ?? 1,
      });
    });

    toast.success(`Moved ${inStockItems.length} books to your cart!`, {
      action: {
        label: "View Cart",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  }, [items, addToCartStore]);

  const isAuthSettled = !isAuthLoading;
  const isWishlistLoading =
    isAuthLoading ||
    (isLoggedIn && isServerWishlistLoading) ||
    (!isLoggedIn && !isGuestHydrated);

  return {
    items,
    count,
    isHydrated: isAuthSettled && (isLoggedIn ? !isServerWishlistLoading : isGuestHydrated),
    isLoggedIn,
    isLoading: isWishlistLoading,
    addItem: handleAddItem,
    removeItem: handleRemove,
    toggleWishlist: handleToggle,
    moveToCart: handleMoveToCart,
    moveAllToCart: handleMoveAllToCart,
    clearWishlist: handleClearWishlist,
    isInWishlist,
  };
}

