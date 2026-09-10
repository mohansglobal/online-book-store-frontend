// React hook for wishlist operations and cart integration
"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import {
  useWishlistStore,
  selectWishlistItems,
  selectWishlistCount,
  selectIsWishlistHydrated,
} from "../stores/use-wishlist-store";
import { useCart } from "@/features/cart";
import type { WishlistItem, AddWishlistItemInput } from "../types/wishlist.types";

export function useWishlist() {
  const items = useWishlistStore(selectWishlistItems);
  const count = useWishlistStore(selectWishlistCount);
  const isHydrated = useWishlistStore(selectIsWishlistHydrated);

  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const { addItem: addToCartStore } = useCart();

  const handleToggle = useCallback(
    (input: AddWishlistItemInput) => {
      const added = toggleItem(input);
      if (added) {
        toast.success(`"${input.title}" added to wishlist!`);
      } else {
        toast.info(`"${input.title}" removed from wishlist.`);
      }
      return added;
    },
    [toggleItem],
  );

  const handleRemove = useCallback(
    (item: WishlistItem) => {
      removeItem(item.id);
      toast.success(`Removed "${item.title}" from wishlist`, {
        action: {
          label: "Undo",
          onClick: () => {
            addItem(item);
            toast.info(`Restored "${item.title}" to wishlist`);
          },
        },
      });
    },
    [removeItem, addItem],
  );

  const handleMoveToCart = useCallback(
    (item: WishlistItem, removeFromList = true) => {
      addToCartStore({
        listingId: item.listingId || `list-${item.id}`,
        bookId: item.bookId,
        slug: item.slug,
        title: item.title,
        coverImage: item.coverImage,
        author: item.author,
        format: item.format || "Paperback",
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: 1,
      });

      if (removeFromList) {
        removeItem(item.id);
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
    [addToCartStore, removeItem],
  );

  const handleMoveAllToCart = useCallback(() => {
    const inStockItems = items.filter((item) => item.inStock !== false);
    if (inStockItems.length === 0) {
      toast.error("No in-stock items available to move to cart.");
      return;
    }

    inStockItems.forEach((item) => {
      addToCartStore({
        listingId: item.listingId || `list-${item.id}`,
        bookId: item.bookId,
        slug: item.slug,
        title: item.title,
        coverImage: item.coverImage,
        author: item.author,
        format: item.format || "Paperback",
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: 1,
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

  const isInWishlist = useCallback(
    (idOrSlug: string) => {
      return items.some(
        (i) =>
          i.id === idOrSlug ||
          i.bookId === idOrSlug ||
          i.slug === idOrSlug ||
          i.listingId === idOrSlug,
      );
    },
    [items],
  );

  return {
    items,
    count,
    isHydrated,
    addItem,
    removeItem: handleRemove,
    toggleWishlist: handleToggle,
    moveToCart: handleMoveToCart,
    moveAllToCart: handleMoveAllToCart,
    clearWishlist,
    isInWishlist,
  };
}
