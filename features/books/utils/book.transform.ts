// Normalization and transformation utilities for books domain
import type { StaticImageData } from "next/image";
import {
  DEFAULT_AUTHOR_FALLBACK,
  FALLBACK_BOOK_COVER,
  type ApiBook,
  type ApiListing,
  type BookAuthor,
  type BookCategory,
  type BookPublisher,
  type CatalogBook,
  type ListingSeller,
} from "../types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";

export function normalizeListingToApiBook(
  item: ApiBook | ApiListing | Record<string, unknown>,
): ApiBook {
  if (!item || typeof item !== "object") {
    return item as ApiBook;
  }

  const record = item as Record<string, unknown>;

  // If item has a nested `book` object (Listing structure)
  if (record.book && typeof record.book === "object") {
    const bookData = record.book as Partial<ApiBook> & Record<string, unknown>;
    const effectiveImages = Array.isArray(record.effectiveImages)
      ? (record.effectiveImages as string[])
      : Array.isArray(record.listingImages)
        ? (record.listingImages as string[])
        : Array.isArray(bookData.images)
          ? (bookData.images as string[])
          : [];

    const coverImage =
      effectiveImages[0] ||
      (typeof bookData.coverImage === "string" ? bookData.coverImage : null);

    const sellingPaise =
      typeof record.sellingPriceInPaise === "number"
        ? record.sellingPriceInPaise
        : undefined;
    const mrpPaise =
      typeof record.mrpInPaise === "number" ? record.mrpInPaise : undefined;

    const calculatedPrice =
      sellingPaise !== undefined ? sellingPaise / 100 : bookData.price;
    const calculatedMrp =
      mrpPaise !== undefined
        ? mrpPaise / 100
        : (bookData.priceIn ?? bookData.originalPrice ?? calculatedPrice);

    const publisherObj: BookPublisher | undefined =
      bookData.publisher && typeof bookData.publisher === "object"
        ? (bookData.publisher as BookPublisher)
        : record.publisher && typeof record.publisher === "object"
          ? (record.publisher as BookPublisher)
          : undefined;

    const authors = Array.isArray(bookData.authors) ? bookData.authors : [];
    const categories = Array.isArray(bookData.categories) ? bookData.categories : [];
    const stock =
      typeof record.stock === "number" ? record.stock : bookData.stock;
    const inStock =
      stock !== undefined ? stock > 0 : (bookData.inStock ?? true);

    const averageRating =
      typeof record.averageRating === "number"
        ? record.averageRating
        : typeof bookData.averageRating === "number"
          ? bookData.averageRating
          : undefined;

    const rating =
      record.rating !== undefined
        ? (record.rating as number | string)
        : bookData.rating !== undefined
          ? (bookData.rating as number | string)
          : averageRating;

    const ratingCount =
      typeof record.ratingCount === "number"
        ? record.ratingCount
        : typeof bookData.ratingCount === "number"
          ? bookData.ratingCount
          : undefined;

    const totalRatings =
      typeof record.totalRatings === "number"
        ? record.totalRatings
        : typeof bookData.totalRatings === "number"
          ? bookData.totalRatings
          : ratingCount;

    const totalReviews =
      typeof record.totalReviews === "number"
        ? record.totalReviews
        : typeof bookData.totalReviews === "number"
          ? bookData.totalReviews
          : typeof record.reviewCount === "number"
            ? record.reviewCount
            : typeof bookData.reviewCount === "number"
              ? bookData.reviewCount
              : undefined;

    const reviewCount =
      typeof record.reviewCount === "number"
        ? record.reviewCount
        : typeof bookData.reviewCount === "number"
          ? bookData.reviewCount
          : totalReviews;

    const ratingBreakdown =
      record.ratingBreakdown && typeof record.ratingBreakdown === "object"
        ? (record.ratingBreakdown as ApiBook["ratingBreakdown"])
        : bookData.ratingBreakdown && typeof bookData.ratingBreakdown === "object"
          ? (bookData.ratingBreakdown as ApiBook["ratingBreakdown"])
          : undefined;

    const ratingPercentages =
      record.ratingPercentages && typeof record.ratingPercentages === "object"
        ? (record.ratingPercentages as ApiBook["ratingPercentages"])
        : bookData.ratingPercentages && typeof bookData.ratingPercentages === "object"
          ? (bookData.ratingPercentages as ApiBook["ratingPercentages"])
          : undefined;

    return {
      _id: (record._id as string) || (bookData._id as string) || "",
      title: (bookData.title as string) || "",
      titleBn: bookData.titleBn as string | undefined,
      slug:
        (bookData._id as string) ||
        (record._id as string) ||
        (bookData.slug as string) ||
        "",
      isbn: bookData.isbn as string | undefined,
      description: bookData.description as string | undefined,
      authors: authors as BookAuthor[],
      publisher: publisherObj,
      categories: categories as BookCategory[],
      language: bookData.language as string | undefined,
      searchTags: Array.isArray(bookData.searchTags)
        ? (bookData.searchTags as string[])
        : [],
      format: bookData.format as string | undefined,
      pages: typeof bookData.pages === "number" ? bookData.pages : undefined,
      coverImage: coverImage,
      images:
        effectiveImages.length > 0
          ? effectiveImages
          : Array.isArray(bookData.images)
            ? (bookData.images as string[])
            : [],
      status:
        (bookData.status as string) ||
        (record.isActive ? "ACTIVE" : "INACTIVE"),
      price: calculatedPrice,
      priceIn: calculatedMrp,
      originalPrice: calculatedMrp,
      originalPriceIn: calculatedMrp,
      rating: rating,
      averageRating: averageRating,
      ratingCount: ratingCount,
      totalRatings: totalRatings,
      totalReviews: totalReviews,
      reviewCount: reviewCount,
      ratingBreakdown: ratingBreakdown,
      ratingPercentages: ratingPercentages,
      stock: stock,
      inStock: inStock,
      publishedYear: bookData.publishedYear as string | number | undefined,
      legacyBookId:
        (bookData.legacyBookId as string) ||
        (bookData.legacyId as string) ||
        undefined,
      legacyId:
        (bookData.legacyId as string) ||
        (bookData.legacyBookId as string) ||
        undefined,
      edition: bookData.edition as string | undefined,
      translation: bookData.translation as string | undefined,
      country: bookData.country as string | undefined,
      weight: bookData.weight as string | number | undefined,
      createdBy:
        (bookData.createdBy as string) ||
        (record.seller
          ? ((record.seller as Record<string, unknown>)._id as string)
          : undefined),
      createdAt:
        (record.createdAt as string) || (bookData.createdAt as string) || undefined,
      updatedAt:
        (record.updatedAt as string) || (bookData.updatedAt as string) || undefined,
      listingId: record._id as string,
      bookId: bookData._id as string,
      seller: record.seller as ListingSeller | undefined,
      mrpInPaise: mrpPaise,
      sellingPriceInPaise: sellingPaise,
      sku: record.sku as string | undefined,
      isActive: record.isActive as boolean | undefined,
      effectiveImages: effectiveImages,
    };
  }

  return item as ApiBook;
}

export function parsePrice(val?: number | string): { text: string; num: number } {
  if (val === undefined || val === null || val === "") return { text: "-", num: 0 };
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (!isNaN(num)) {
    return { text: num === 0 ? "Free" : `₹${num}`, num };
  }
  return { text: typeof val === "string" && val.trim() ? val.trim() : "-", num: 0 };
}

export function transformApiBookToCatalogBook(
  rawBook: ApiBook,
  fallbackCover: StaticImageData | string = FALLBACK_BOOK_COVER,
): CatalogBook {
  const book = normalizeListingToApiBook(rawBook);

  const authorsText =
    book.authors && book.authors.length > 0
      ? book.authors.map((a) => a?.name?.trim()).filter(Boolean).join(", ")
      : "-";

  const publisherText = book.publisher?.name?.trim() || "-";
  const categoryText =
    book.categories && book.categories.length > 0
      ? book.categories.map((c) => c?.name?.trim()).filter(Boolean).join(", ")
      : "-";

  const { text: priceText, num: rawPrice } = parsePrice(book.price);
  const { text: priceInText, num: rawPriceIn } = parsePrice(book.priceIn);
  const finalPrice = priceText !== "-" ? priceText : (priceInText !== "-" ? priceInText : "-");
  const finalRawPrice = rawPrice || rawPriceIn || 0;

  const { text: origPriceText } = parsePrice(book.originalPrice);
  const { text: origPriceInText } = parsePrice(book.originalPriceIn);

  const coverSrc = book.coverImage
    ? resolveCoverUrl(book.coverImage)
    : fallbackCover;

  const uniqueId = book._id || book.listingId || book.slug || "-";
  const sellerText = book.seller?.name?.trim() || undefined;

  const effectiveRating =
    book.averageRating !== undefined && book.averageRating !== null && book.averageRating > 0
      ? Number(book.averageRating).toFixed(1)
      : book.rating !== undefined && book.rating !== null && book.rating !== "" && Number(book.rating) > 0
        ? Number(book.rating).toFixed(1)
        : "-";

  const totalRatings =
    book.totalRatings ?? book.ratingCount ?? book.totalReviews ?? book.reviewCount ?? 0;

  return {
    id: uniqueId,
    slug: uniqueId,
    title: book.title?.trim() || "-",
    author: authorsText,
    publisher: publisherText,
    seller: sellerText,
    category: categoryText,
    price: finalPrice,
    rawPrice: finalRawPrice,
    priceIn: priceInText !== "-" ? priceInText : undefined,
    rawPriceIn: rawPriceIn || undefined,
    originalPrice: origPriceText !== "-" ? origPriceText : undefined,
    originalPriceIn: origPriceInText !== "-" ? origPriceInText : undefined,
    rating: effectiveRating,
    totalRatings: totalRatings,
    ratingCount: totalRatings,
    cover: coverSrc,
    detail: book.description ? book.description.replace(/<[^>]*>?/gm, "").trim() : "-",
    publishedYear: book.publishedYear ? String(book.publishedYear) : "-",
    inStock: book.inStock ?? (book.stock !== undefined ? book.stock > 0 : true),
    stock: book.stock,
    format: book.format || "-",
    pages: book.pages,
    isbn: book.isbn || "-",
    language: book.language || "-",
  };
}

export function resolveAuthorPhoto(photo?: string | null): string {
  if (!photo || typeof photo !== "string" || !photo.trim()) {
    return DEFAULT_AUTHOR_FALLBACK;
  }
  const trimmed = photo.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const backendBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "http://localhost:5000";
  return `${backendBase}/assets/upload/author/${trimmed}`;
}
