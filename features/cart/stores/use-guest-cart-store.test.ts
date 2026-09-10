// unit tests for guest cart store logic
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

import { useGuestCartStore } from "./use-guest-cart-store";
import type { GuestCartItem } from "../types/cart.types";

const SAMPLE_ITEM_A: Omit<GuestCartItem, "quantity"> = {
  listingId: "listing-001",
  bookId: "book-abc",
  slug: "mati-akasher-majhkhane",
  title: "Mati Akasher Majhkhane",
  coverImage: "https://example.com/cover-a.jpg",
  author: "Humayun Ahmed",
  format: "Hardcover",
  price: 280,
  originalPrice: 350,
};

const SAMPLE_ITEM_B: Omit<GuestCartItem, "quantity"> = {
  listingId: "listing-002",
  bookId: "book-def",
  slug: "khoabnama",
  title: "Khoabnama",
  coverImage: "https://example.com/cover-b.jpg",
  author: "Akhtaruzzaman Elias",
  format: "Paperback",
  price: 338,
  originalPrice: 450,
};

// same book, different seller (different listingId)
const SAMPLE_ITEM_C_SAME_BOOK: Omit<GuestCartItem, "quantity"> = {
  listingId: "listing-003",
  bookId: "book-abc",
  slug: "mati-akasher-majhkhane",
  title: "Mati Akasher Majhkhane",
  coverImage: "https://example.com/cover-a.jpg",
  author: "Humayun Ahmed",
  format: "Paperback",
  price: 260,
  originalPrice: 350,
};

function resetStore() {
  useGuestCartStore.setState({ items: [], _hydrated: true });
}

export function runGuestCartStoreTests(): {
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

  // --- addItem tests ---

  // 1. Add a single item
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  assertEqual("Add single item - count", useGuestCartStore.getState().items.length, 1);
  assertEqual("Add single item - default qty", useGuestCartStore.getState().items[0].quantity, 1);
  assertEqual(
    "Add single item - listingId",
    useGuestCartStore.getState().items[0].listingId,
    "listing-001",
  );

  // 2. Add item with explicit quantity
  resetStore();
  useGuestCartStore.getState().addItem({ ...SAMPLE_ITEM_A, quantity: 3 });
  assertEqual("Add with explicit qty", useGuestCartStore.getState().items[0].quantity, 3);

  // 3. Deduplication by listingId — same listing increments quantity
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  assertEqual("Dedup same listingId - count", useGuestCartStore.getState().items.length, 1);
  assertEqual("Dedup same listingId - qty", useGuestCartStore.getState().items[0].quantity, 2);

  // 4. Same bookId but different listingId — treated as separate items
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_C_SAME_BOOK);
  assertEqual(
    "Different listingId same bookId - count",
    useGuestCartStore.getState().items.length,
    2,
  );

  // 5. Add multiple distinct items
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_B);
  assertEqual("Add two distinct items - count", useGuestCartStore.getState().items.length, 2);

  // --- removeItem tests ---

  // 6. Remove item by listingId
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_B);
  useGuestCartStore.getState().removeItem("listing-001");
  assertEqual("Remove item - count", useGuestCartStore.getState().items.length, 1);
  assertEqual(
    "Remove item - remaining",
    useGuestCartStore.getState().items[0].listingId,
    "listing-002",
  );

  // 7. Remove non-existent listingId does nothing
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().removeItem("nonexistent-id");
  assertEqual("Remove nonexistent - count", useGuestCartStore.getState().items.length, 1);

  // --- updateQuantity tests ---

  // 8. Update quantity
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().updateQuantity("listing-001", 5);
  assertEqual("Update qty", useGuestCartStore.getState().items[0].quantity, 5);

  // 9. Update quantity to 0 is rejected
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().updateQuantity("listing-001", 0);
  assertEqual("Update qty to 0 rejected", useGuestCartStore.getState().items[0].quantity, 1);

  // 10. Update quantity for non-existent item does nothing
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().updateQuantity("nonexistent-id", 10);
  assertEqual(
    "Update nonexistent - unchanged",
    useGuestCartStore.getState().items[0].quantity,
    1,
  );

  // --- clearCart tests ---

  // 11. Clear cart
  resetStore();
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
  useGuestCartStore.getState().addItem(SAMPLE_ITEM_B);
  useGuestCartStore.getState().clearCart();
  assertEqual("Clear cart - empty", useGuestCartStore.getState().items.length, 0);

  return {
    passed: failures.length === 0,
    failures,
  };
}
