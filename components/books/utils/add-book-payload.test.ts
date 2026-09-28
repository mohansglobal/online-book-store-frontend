import { describe, it, expect } from "vitest";
import {
  buildBookListingPayload,
  type AddBookFormState,
} from "./add-book-payload";
import { FALLBACK_BOOK_COVER } from "@/features/books";

describe("buildBookListingPayload", () => {
  const baseFormState: AddBookFormState = {
    isbn: "978-0-14-345357-4",
    titleEn: "Clean Code",
    titleBn: "ক্লিন কোড",
    publisherId: "pub_123",
    language: "en",
    categoryId: "cat_456",
    authorId: "auth_789",
    searchTag: "programming, software, craft",
    pages: "464",
    edition: "1st Edition",
    mrp: "599",
    sellingPrice: "499",
    stock: "15",
    sku: "SKU-CC-01",
    countryId: "cnt_in",
    description: "A handbook of agile software craftsmanship",
    coverPreview: "https://cloudinary.com/seller-own-cover.jpg",
    extraPreviews: ["https://cloudinary.com/sample-page-1.jpg"],
  };

  it("should build complete listing payload from valid form state", () => {
    const payload = buildBookListingPayload(baseFormState);

    expect(payload.title).toBe("Clean Code");
    expect(payload.titleBn).toBe("ক্লিন কোড");
    expect(payload.isbn).toBe("978-0-14-345357-4");
    expect(payload.publisher).toBe("pub_123");
    expect(payload.authors).toEqual(["auth_789"]);
    expect(payload.categories).toEqual(["cat_456"]);
    expect(payload.language).toBe("English");
    expect(payload.format).toBe("PAPERBACK");
    expect(payload.edition).toBe("1st Edition");
    expect(payload.pages).toBe(464);
    expect(payload.searchTags).toEqual(["programming", "software", "craft"]);
    expect(payload.country).toBe("cnt_in");
    expect(payload.description).toBe("A handbook of agile software craftsmanship");
    expect(payload.sku).toBe("SKU-CC-01");
  });

  it("should accurately convert rupee prices to paise for backend storage", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      mrp: "750.50",
      sellingPrice: "600.25",
    });

    expect(payload.mrpInPaise).toBe(75050);
    expect(payload.sellingPriceInPaise).toBe(60025);
  });

  it("should default sellingPrice to MRP when sellingPrice is empty", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      mrp: "350",
      sellingPrice: "",
    });

    expect(payload.mrpInPaise).toBe(35000);
    expect(payload.sellingPriceInPaise).toBe(35000);
  });

  it("should map Bengali language code 'bn' to 'Bengali'", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      language: "bn",
    });

    expect(payload.language).toBe("Bengali");
  });

  it("should map English or other language codes to 'English'", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      language: "en",
    });

    expect(payload.language).toBe("English");
  });

  it("should preserve seller's independent cover image without inheriting existing covers", () => {
    const customCover = "https://res.cloudinary.com/custom/seller-image.png";

    const payload = buildBookListingPayload({
      ...baseFormState,
      coverPreview: customCover,
    });

    expect(payload.coverImage).toBe(customCover);
  });

  it("should use FALLBACK_BOOK_COVER when seller does not upload cover preview", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      coverPreview: null,
    });

    expect(payload.coverImage).toBe(FALLBACK_BOOK_COVER);
  });

  it("should clean empty strings to undefined for optional fields", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      isbn: "   ",
      edition: "  ",
      sku: " ",
      countryId: "",
      description: "   ",
      searchTag: "   ",
      pages: "",
      extraPreviews: [],
    });

    expect(payload.isbn).toBeUndefined();
    expect(payload.edition).toBeUndefined();
    expect(payload.sku).toBeUndefined();
    expect(payload.country).toBeUndefined();
    expect(payload.description).toBeUndefined();
    expect(payload.searchTags).toBeUndefined();
    expect(payload.pages).toBeUndefined();
    expect(payload.images).toBeUndefined();
  });

  it("should parse stock number and fallback to 0 if invalid", () => {
    const payload = buildBookListingPayload({
      ...baseFormState,
      stock: "invalid",
    });

    expect(payload.stock).toBe(0);
  });

  it("should support identical publication for second seller with fresh independent cover", () => {
    // When a second seller lists the identical publication
    // publisher, format, language, edition match, but seller uploads their own copy photo
    const secondSellerCover = "https://res.cloudinary.com/seller2/book-copy.jpg";

    const secondSellerPayload = buildBookListingPayload({
      ...baseFormState,
      isbn: "978-0-14-345357-4",
      publisherId: "pub_123",
      language: "en",
      edition: "1st Edition",
      mrp: "599",
      sellingPrice: "450",
      stock: "5",
      coverPreview: secondSellerCover,
      sku: "SELLER-2-SKU",
    });

    expect(secondSellerPayload.isbn).toBe("978-0-14-345357-4");
    expect(secondSellerPayload.publisher).toBe("pub_123");
    expect(secondSellerPayload.language).toBe("English");
    expect(secondSellerPayload.format).toBe("PAPERBACK");
    expect(secondSellerPayload.edition).toBe("1st Edition");
    expect(secondSellerPayload.coverImage).toBe(secondSellerCover);
    expect(secondSellerPayload.sellingPriceInPaise).toBe(45000);
    expect(secondSellerPayload.stock).toBe(5);
  });
});
