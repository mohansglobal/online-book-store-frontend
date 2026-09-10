// Unit tests for guest wishlist zustand store logic
if (typeof window === "undefined") {
  const store: Record<string, string> = {};
  (global as any).window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
    },
  };
}

import {
  useWishlistStore,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from "./use-wishlist-store";
import type { AddWishlistItemInput } from "../types/wishlist.types";

const SAMPLE_BOOK_1: AddWishlistItemInput = {
  id: "book-001",
  bookId: "book-001",
  slug: "mati-akasher-majhkhane",
  title: "Mati Akasher Majhkhane",
  author: "Humayun Ahmed",
  coverImage: "https://example.com/cover1.jpg",
  price: 280,
  originalPrice: 350,
  format: "Hardcover",
};

const SAMPLE_BOOK_2: AddWishlistItemInput = {
  id: "book-002",
  bookId: "book-002",
  slug: "khoabnama",
  title: "Khoabnama",
  author: "Akhtaruzzaman Elias",
  coverImage: "https://example.com/cover2.jpg",
  price: 338,
  originalPrice: 450,
  format: "Paperback",
};

function resetWishlistStore() {
  useWishlistStore.setState({ items: [], _hydrated: true });
}

export function runGuestWishlistStoreTests(): {
  passed: boolean;
  failures: string[];
} {
  const failures: string[] = [];

  function assertEqual(name: string, actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      failures.push(
        `FAIL [${name}]: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
      );
    }
  }

  // 1. Add single item
  resetWishlistStore();
  useWishlistStore.getState().addItem(SAMPLE_BOOK_1);
  assertEqual("Add single item - count", selectWishlistCount(useWishlistStore.getState()), 1);
  assertEqual(
    "Add single item - inWishlist by id",
    selectIsInWishlist("book-001")(useWishlistStore.getState()),
    true,
  );
  assertEqual(
    "Add single item - inWishlist by slug",
    selectIsInWishlist("mati-akasher-majhkhane")(useWishlistStore.getState()),
    true,
  );

  // 2. Toggle item (add then remove)
  resetWishlistStore();
  const added = useWishlistStore.getState().toggleItem(SAMPLE_BOOK_1);
  assertEqual("Toggle item - added returns true", added, true);
  assertEqual("Toggle item - count is 1", selectWishlistCount(useWishlistStore.getState()), 1);

  const removed = useWishlistStore.getState().toggleItem(SAMPLE_BOOK_1);
  assertEqual("Toggle item - removed returns false", removed, false);
  assertEqual("Toggle item - count is 0", selectWishlistCount(useWishlistStore.getState()), 0);

  // 3. Add multiple distinct items
  resetWishlistStore();
  useWishlistStore.getState().addItem(SAMPLE_BOOK_1);
  useWishlistStore.getState().addItem(SAMPLE_BOOK_2);
  assertEqual("Add multiple items - count", selectWishlistCount(useWishlistStore.getState()), 2);

  // 4. Remove item by slug / id
  useWishlistStore.getState().removeItem("book-001");
  assertEqual("Remove item - count", selectWishlistCount(useWishlistStore.getState()), 1);
  assertEqual(
    "Remove item - remaining is book-002",
    selectIsInWishlist("book-002")(useWishlistStore.getState()),
    true,
  );

  // 5. Clear wishlist
  useWishlistStore.getState().clearWishlist();
  assertEqual("Clear wishlist - count", selectWishlistCount(useWishlistStore.getState()), 0);

  return {
    passed: failures.length === 0,
    failures,
  };
}
