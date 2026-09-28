import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import { createBookListing, lookupBookByIsbn } from "./books.api";
import type { CreateBookListingInput } from "../types/book.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Create Book Listing & ISBN API", () => {
  const validInput: CreateBookListingInput = {
    title: "Clean Code",
    isbn: "978-0-14-345357-4",
    publisher: "pub_123",
    authors: ["auth_123"],
    categories: ["cat_123"],
    language: "English",
    format: "PAPERBACK",
    edition: "1st Edition",
    mrpInPaise: 50000,
    sellingPriceInPaise: 40000,
    stock: 10,
    coverImage: "https://example.com/cover.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createBookListing", () => {
    it("should send POST /book-listings with input payload", async () => {
      const mockResponse = {
        success: true,
        message: "Book and listing created successfully",
        data: {
          _id: "listing_new_1",
          book: {
            _id: "book_new_1",
            title: "Clean Code",
            isbn: "978-0-14-345357-4",
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await createBookListing(validInput);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/book-listings",
        validInput,
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should allow second seller to create listing for identical publication", async () => {
      const secondSellerInput: CreateBookListingInput = {
        ...validInput,
        coverImage: "https://example.com/seller2-copy.jpg",
        stock: 5,
        sellingPriceInPaise: 38000,
      };

      const mockResponse = {
        success: true,
        message: "Listing created for existing book publication",
        data: {
          _id: "listing_seller_2",
          book: {
            _id: "book_new_1",
            isbn: "978-0-14-345357-4",
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await createBookListing(secondSellerInput);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/book-listings",
        secondSellerInput,
        { signal: undefined },
      );
      expect(result.data._id).toBe("listing_seller_2");
    });

    it("should propagate HTTP 400 when ISBN belongs to different publisher (Rule 1)", async () => {
      const errorMsg =
        'Per International ISBN standards, ISBN "978-0-14-345357-4" is already registered to another publisher. A different publisher must assign their own ISBN.';

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error(errorMsg));

      await expect(createBookListing(validInput)).rejects.toThrow(errorMsg);
    });

    it("should propagate HTTP 400 when format differs for same ISBN (Rule 2)", async () => {
      const errorMsg =
        'Per International ISBN standards, ISBN "978-0-14-345357-4" is already registered as Paperback. Different product formats (Paperback, Hardcover, eBook) must have separate ISBNs.';

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error(errorMsg));

      await expect(createBookListing(validInput)).rejects.toThrow(errorMsg);
    });

    it("should propagate HTTP 400 when language differs for same ISBN (Rule 3)", async () => {
      const errorMsg =
        'Per International ISBN standards, ISBN "978-0-14-345357-4" is already registered in English. Each language edition must have its own ISBN.';

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error(errorMsg));

      await expect(createBookListing(validInput)).rejects.toThrow(errorMsg);
    });

    it("should propagate HTTP 400 when edition differs for same ISBN (Rule 4)", async () => {
      const errorMsg =
        'Per International ISBN standards, ISBN "978-0-14-345357-4" is already registered as "1st Edition". A new edition requires its own ISBN.';

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error(errorMsg));

      await expect(createBookListing(validInput)).rejects.toThrow(errorMsg);
    });
  });

  describe("lookupBookByIsbn", () => {
    it("should send GET /books/isbn/:isbn with encoded ISBN", async () => {
      const mockResponse = {
        success: true,
        exists: true,
        alreadyListedBySeller: false,
        existingListingId: null,
        message: "Book found",
        data: {
          _id: "book_1",
          title: "Clean Code",
          isbn: "978-0-14-345357-4",
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await lookupBookByIsbn("978-0-14-345357-4");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/books/isbn/978-0-14-345357-4",
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
