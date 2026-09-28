import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import { getWishlistIds, checkBookInWishlist } from "@/features/wishlist/api/wishlist.api";
import { wishlistKeys } from "@/features/wishlist/queries/wishlist.keys";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Wishlist IDs API & Keys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches wishlist IDs via GET /wishlist/ids", async () => {
    const mockIdsResponse = {
      success: true,
      data: ["book-001", "book-002", "book-003"],
    };
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockIdsResponse);

    const result = await getWishlistIds();

    expect(apiClient.get).toHaveBeenCalledWith("/wishlist/ids");
    expect(result.data).toEqual(["book-001", "book-002", "book-003"]);
  });

  it("checks single book in wishlist via GET /wishlist/check/:bookId", async () => {
    const mockCheckResponse = {
      success: true,
      data: {
        bookId: "book-001",
        isWishlisted: true,
      },
    };
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockCheckResponse);

    const result = await checkBookInWishlist("book-001");

    expect(apiClient.get).toHaveBeenCalledWith("/wishlist/check/book-001");
    expect(result.data.isWishlisted).toBe(true);
  });

  it("produces standardized query keys for ids and check", () => {
    expect(wishlistKeys.ids()).toEqual(["wishlist", "ids"]);
    expect(wishlistKeys.check("book-123")).toEqual(["wishlist", "check", "book-123"]);
  });

  it("preserves isWishlisted in normalizeListingToApiBook", async () => {
    const { normalizeListingToApiBook } = await import("@/features/books/utils/book.transform");
    const rawListing = {
      _id: "listing-999",
      isWishlisted: true,
      book: {
        _id: "book-111",
        title: "Clean Architecture",
        slug: "clean-architecture",
      },
      seller: {
        _id: "seller-1",
        name: "Test Seller",
      },
    };

    const normalized = normalizeListingToApiBook(rawListing);
    expect(normalized.isWishlisted).toBe(true);
    expect(normalized.bookId).toBe("book-111");
    expect(normalized.listingId).toBe("listing-999");
  });

  it("maps canonical bookId and preserves isWishlisted in transformApiBookToCatalogBook", async () => {
    const { transformApiBookToCatalogBook } = await import("@/features/books/utils/book.transform");
    const rawListing = {
      _id: "listing-999",
      isWishlisted: true,
      book: {
        _id: "book-111",
        title: "Clean Architecture",
        slug: "clean-architecture",
      },
    };

    const catalog = transformApiBookToCatalogBook(rawListing as never);
    expect(catalog.isWishlisted).toBe(true);
    expect(catalog.bookId).toBe("book-111");
    expect(catalog.listingId).toBe("listing-999");
    expect(catalog.slug).toBe("listing-999");
  });

  it("maps bookId and listingId in transformServerWishlistToViews", async () => {
    const { transformServerWishlistToViews } = await import("@/features/wishlist/utils/wishlist-transform");
    const serverItems = [
      {
        id: "book-111",
        bookId: "book-111",
        listingId: "listing-999",
        title: "Clean Architecture",
        slug: "clean-architecture",
        coverImage: "/cover.jpg",
      },
    ];

    const views = transformServerWishlistToViews(serverItems as never);
    expect(views[0].bookId).toBe("book-111");
    expect(views[0].listingId).toBe("listing-999");
  });
});
