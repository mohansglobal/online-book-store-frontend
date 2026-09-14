// guest cart zustand store with localStorage persistence
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GuestCartItem } from "../types/cart.types";

type AddItemInput = Partial<GuestCartItem> & {
  title: string;
  price: number;
  quantity?: number;
  id?: string;
  listingId?: string;
  bookListingId?: string;
  bookId?: string;
};

type GuestCartState = {
  items: GuestCartItem[];
  _hydrated: boolean;
};

type GuestCartActions = {
  addItem: (item: AddItemInput) => void;
  removeItem: (idOrListingId: string) => void;
  updateQuantity: (idOrListingId: string, quantity: number) => void;
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
        const itemId = input.id || input.listingId || input.bookListingId || input.bookId || "";
        const quantity = input.quantity ?? 1;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === itemId || i.listingId === itemId,
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
            id: itemId,
            listingId: itemId,
            bookListingId: itemId,
            bookId: itemId,
            slug: input.slug || itemId,
            title: input.title,
            coverImage: input.coverImage || "",
            author: input.author || "-",
            seller: input.seller,
            format: input.format || "Paperback",
            price: input.price,
            originalPrice: input.originalPrice || input.price,
            quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (idOrListingId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => i.id !== idOrListingId && i.listingId !== idOrListingId,
          ),
        }));
      },

      updateQuantity: (idOrListingId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((i) =>
            i.id === idOrListingId || i.listingId === idOrListingId
              ? { ...i, quantity }
              : i,
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
