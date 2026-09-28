// React hook for wishlist operations and cart integration
"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth";
import { useCart } from "@/features/cart";
import {
  selectIsWishlistHydrated,
  selectWishlistItems,
  useWishlistStore,
} from "../stores/use-wishlist-store";
import { useWishlistQuery } from "../queries/use-wishlist-query";
import { useWishlistIdsQuery } from "../queries/use-wishlist-ids-query";
import {
  useAddToWishlistMutation,
  useClearWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../mutations/use-wishlist-mutations";
import { transformServerWishlistToViews } from "../utils/wishlist-transform";
import type { AddWishlistItemInput, WishlistItem } from "../types/wishlist.types";

export type UseWishlistReturn = {
  items: WishlistItem[];
  wishlistIds?: Set<string>;
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
  isInWishlist: (idOrSlug?: string | null, secondaryId?: string | null) => boolean;
};

export function useWishlist(): UseWishlistReturn {
  const router = useRouter();
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  // Scalable lightweight IDs query (<1KB) for instant O(1) membership checks
  const { data: serverWishlistIds } = useWishlistIdsQuery(isLoggedIn);
  
  // Server wishlist query
  const {
    data: serverWishlistResponse,
    isLoading: isServerWishlistLoading,
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
    (idOrSlug?: string | null, secondaryId?: string | null) => {
      if (!idOrSlug && !secondaryId) return false;

      const candidates: string[] = [];
      if (idOrSlug && typeof idOrSlug === "string" && idOrSlug.trim()) {
        candidates.push(idOrSlug.trim());
      }
      if (
        secondaryId &&
        typeof secondaryId === "string" &&
        secondaryId.trim() &&
        secondaryId.trim() !== idOrSlug
      ) {
        candidates.push(secondaryId.trim());
      }

      if (candidates.length === 0) return false;

      // 1. Fast O(1) serverWishlistIds lookup
      if (serverWishlistIds && serverWishlistIds.size > 0) {
        for (const candidate of candidates) {
          if (serverWishlistIds.has(candidate)) {
            return true;
          }
        }
      }

      // 2. Fallback scan on unified items
      return candidates.some((candidate) => {
        const lower = candidate.toLowerCase();
        return items.some(
          (i) =>
            i.id === candidate ||
            (i.bookId && i.bookId === candidate) ||
            (i.listingId && i.listingId === candidate) ||
            (i.slug && i.slug === candidate) ||
            (i.title && i.title.toLowerCase() === lower),
        );
      });
    },
    [serverWishlistIds, items],
  );

  const handleToggle = useCallback(
    async (input: AddWishlistItemInput): Promise<boolean> => {
      const canonicalBookId = input.bookId || "";
      const listingOrItemId = input.listingId || input.id || "";
      const primaryId = canonicalBookId || listingOrItemId;
      const currentlyInWishlist = isInWishlist(canonicalBookId, listingOrItemId || input.slug);

      if (isLoggedIn) {
        if (currentlyInWishlist) {
          try {
            await removeMutation.mutateAsync({
              bookId: canonicalBookId || primaryId,
              listingId: input.listingId,
            });
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
            await addMutation.mutateAsync({
              bookId: canonicalBookId || primaryId,
              listingId: input.listingId,
              id: primaryId,
            });
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
        const added = guestToggleItem({ ...input, id: primaryId });
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
      const canonicalBookId = input.bookId || "";
      const listingOrItemId = input.listingId || input.id || "";
      const primaryId = canonicalBookId || listingOrItemId;

      if (isLoggedIn) {
        try {
          await addMutation.mutateAsync({
            bookId: canonicalBookId || primaryId,
            listingId: input.listingId,
            id: primaryId,
          });
          toast.success(`"${input.title}" added to wishlist!`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to add to wishlist";
          toast.error(message);
        }
      } else {
        guestAddItem({ ...input, id: primaryId });
        toast.success(`"${input.title}" added to wishlist!`);
      }
    },
    [isLoggedIn, addMutation, guestAddItem],
  );

  const handleRemove = useCallback(
    async (itemOrId: WishlistItem | string) => {
      const isString = typeof itemOrId === "string";
      const bookId = isString ? itemOrId : itemOrId.bookId || itemOrId.id;
      const listingId = !isString ? itemOrId.listingId : undefined;
      const title = !isString ? itemOrId.title : "Item";

      if (isLoggedIn) {
        try {
          await removeMutation.mutateAsync({
            bookId,
            listingId,
          });
          toast.success(`Removed "${title}" from wishlist`);
        } catch (err: unknown) {
          const message =
            (err as { message?: string })?.message || "Failed to remove item";
          toast.error(message);
        }
      } else {
        guestRemoveItem(bookId);
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
            router.push("/cart");
          },
        },
      });
    },
    [addToCartStore, handleRemove, router],
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
          router.push("/cart");
        },
      },
    });
  }, [items, addToCartStore, router]);

  const isAuthSettled = !isAuthLoading;
  const isWishlistLoading =
    isAuthLoading ||
    (isLoggedIn && isServerWishlistLoading) ||
    (!isLoggedIn && !isGuestHydrated);

  return {
    items,
    wishlistIds: serverWishlistIds,
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

