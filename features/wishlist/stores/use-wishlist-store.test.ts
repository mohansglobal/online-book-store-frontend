import { describe, it, expect, beforeEach } from "vitest";
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

describe("useWishlistStore", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [], _hydrated: true });
  });

  it("should add a single item and check membership", () => {
    useWishlistStore.getState().addItem(SAMPLE_BOOK_1);
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(1);
    expect(selectIsInWishlist("book-001")(useWishlistStore.getState())).toBe(true);
    expect(selectIsInWishlist("mati-akasher-majhkhane")(useWishlistStore.getState())).toBe(true);
  });

  it("should toggle item properly (add then remove)", () => {
    const added = useWishlistStore.getState().toggleItem(SAMPLE_BOOK_1);
    expect(added).toBe(true);
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(1);

    const removed = useWishlistStore.getState().toggleItem(SAMPLE_BOOK_1);
    expect(removed).toBe(false);
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(0);
  });

  it("should remove item by id or slug", () => {
    useWishlistStore.getState().addItem(SAMPLE_BOOK_1);
    useWishlistStore.getState().addItem(SAMPLE_BOOK_2);
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(2);

    useWishlistStore.getState().removeItem("book-001");
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(1);
    expect(selectIsInWishlist("book-002")(useWishlistStore.getState())).toBe(true);
  });

  it("should clear wishlist", () => {
    useWishlistStore.getState().addItem(SAMPLE_BOOK_1);
    useWishlistStore.getState().clearWishlist();
    expect(selectWishlistCount(useWishlistStore.getState())).toBe(0);
  });
});
