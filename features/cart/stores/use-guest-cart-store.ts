// guest cart zustand store with localStorage persistence
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GuestCartItem } from "../types/cart.types";

type AddItemInput = Omit<GuestCartItem, "quantity"> & { quantity?: number };

type GuestCartState = {
  items: GuestCartItem[];
  _hydrated: boolean;
};

type GuestCartActions = {
  addItem: (item: AddItemInput) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  setHydrated: () => void;
};

type GuestCartStore = GuestCartState & GuestCartActions;

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      items: [],
      _hydrated: false,

      addItem: (input) => {
        const quantity = input.quantity ?? 1;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.listingId === input.listingId,
          );

          if (existingIndex !== -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }

          const newItem: GuestCartItem = {
            listingId: input.listingId,
            bookId: input.bookId,
            slug: input.slug,
            title: input.title,
            coverImage: input.coverImage,
            author: input.author,
            format: input.format,
            price: input.price,
            originalPrice: input.originalPrice,
            quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (listingId) => {
        set((state) => ({
          items: state.items.filter((i) => i.listingId !== listingId),
        }));
      },

      updateQuantity: (listingId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((i) =>
            i.listingId === listingId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setHydrated: () => {
        set({ _hydrated: true });
      },
    }),
    {
      name: "guest-cart",
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

// --- selectors ---

export const selectCartItems = (state: GuestCartStore) => state.items;

export const selectCartTotalCount = (state: GuestCartStore) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartItemByListingId =
  (listingId: string) => (state: GuestCartStore) =>
    state.items.find((i) => i.listingId === listingId) ?? null;

export const selectIsHydrated = (state: GuestCartStore) => state._hydrated;
