// Wishlist Zustand store with localStorage persistence
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WishlistItem, AddWishlistItemInput } from "../types/wishlist.types";

type WishlistState = {
  items: WishlistItem[];
  _hydrated: boolean;
};

type WishlistActions = {
  addItem: (item: AddWishlistItemInput) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: AddWishlistItemInput) => boolean; // returns true if added, false if removed
  clearWishlist: () => void;
  setHydrated: () => void;
};

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hydrated: false,

      addItem: (input) => {
        set((state) => {
          const itemId = input.id || input.listingId || input.bookId || input.slug || input.title;
          const existingIndex = state.items.findIndex(
            (i) =>
              i.id === itemId ||
              (input.id && i.id === input.id) ||
              (input.slug && i.slug === input.slug) ||
              (input.title && i.title.toLowerCase() === input.title.toLowerCase()),
          );

          if (existingIndex !== -1) {
            // Update existing item with fresh data and refreshed timestamp
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...input,
              id: itemId,
              addedAt: input.addedAt || updated[existingIndex].addedAt || new Date().toISOString(),
            };
            return { items: updated };
          }

          const newItem: WishlistItem = {
            id: itemId,
            slug: input.slug || itemId,
            title: input.title,
            author: input.author,
            coverImage: input.coverImage,
            format: input.format || "Paperback",
            price: input.price,
            originalPrice: input.originalPrice,
            inStock: input.inStock ?? true,
            rating: input.rating,
            category: input.category,
            publisher: input.publisher,
            seller: input.seller,
            quantity: input.quantity ?? 1,
            addedAt: input.addedAt || new Date().toISOString(),
          };

          return { items: [newItem, ...state.items] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              i.id !== id &&
              i.slug !== id &&
              (i.title ? i.title.toLowerCase() !== id.toLowerCase() : true),
          ),
        }));
      },

      toggleItem: (input) => {
        const state = get();
        const itemId = input.id || input.listingId || input.bookId || input.slug || input.title;
        const existing = state.items.find(
          (i) =>
            i.id === itemId ||
            (input.id && i.id === input.id) ||
            (input.slug && i.slug === input.slug) ||
            (input.title && i.title.toLowerCase() === input.title.toLowerCase()),
        );

        if (existing) {
          state.removeItem(existing.id);
          return false;
        } else {
          state.addItem(input);
          return true;
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      setHydrated: () => {
        set({ _hydrated: true });
      },
    }),
    {
      name: "guest-wishlist",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

// --- Selectors ---

export const selectWishlistItems = (state: WishlistStore) => state.items;

export const selectWishlistCount = (state: WishlistStore) => state.items.length;

export const selectIsWishlistHydrated = (state: WishlistStore) =>
  state._hydrated || (typeof window !== "undefined" && Boolean(useWishlistStore.persist?.hasHydrated?.()));

export const selectIsInWishlist =
  (idOrSlug: string) => (state: WishlistStore) => {
    if (!idOrSlug) return false;
    const lower = idOrSlug.toLowerCase();
    return state.items.some(
      (i) =>
        i.id === idOrSlug ||
        i.slug === idOrSlug ||
        (i.title && i.title.toLowerCase() === lower),
    );
  };

