import { describe, it, expect, beforeEach } from "vitest";
import { useGuestCartStore } from "./use-guest-cart-store";
import type { GuestCartItem } from "../types/cart.types";

const SAMPLE_ITEM_A: Omit<GuestCartItem, "quantity"> = {
  id: "listing-001",
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
  id: "listing-002",
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

const SAMPLE_ITEM_C_SAME_BOOK: Omit<GuestCartItem, "quantity"> = {
  id: "listing-003",
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

describe("useGuestCartStore", () => {
  beforeEach(() => {
    useGuestCartStore.setState({ items: [], _hydrated: true });
  });

  it("should add a single item with default quantity 1", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    const items = useGuestCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].listingId).toBe("listing-001");
  });

  it("should increment quantity when adding duplicate listingId", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    const items = useGuestCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should treat same bookId with different listingId as separate items", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_C_SAME_BOOK);
    expect(useGuestCartStore.getState().items).toHaveLength(2);
  });

  it("should remove item by listingId", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_B);
    useGuestCartStore.getState().removeItem("listing-001");
    const items = useGuestCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].listingId).toBe("listing-002");
  });

  it("should update quantity properly", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    useGuestCartStore.getState().updateQuantity("listing-001", 5);
    expect(useGuestCartStore.getState().items[0].quantity).toBe(5);

    // Rejected if 0
    useGuestCartStore.getState().updateQuantity("listing-001", 0);
    expect(useGuestCartStore.getState().items[0].quantity).toBe(5);
  });

  it("should clear all items in cart", () => {
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_A);
    useGuestCartStore.getState().addItem(SAMPLE_ITEM_B);
    useGuestCartStore.getState().clearCart();
    expect(useGuestCartStore.getState().items).toHaveLength(0);
  });
});
