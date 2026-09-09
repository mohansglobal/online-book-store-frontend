// Book domain types and contracts matching backend /api/v1/books
import type { StaticImageData } from "next/image";

export const FALLBACK_BOOK_COVER =
  "https://i.pinimg.com/736x/57/69/7a/57697aeaa7fa70578f344fb6ee4aa1d9.jpg";

export type BookAuthor = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
};

export type BookPublisher = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
};

export type BookCategory = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
};

export type ApiBook = {
  _id: string;
  title: string;
  titleBn?: string;
  slug: string;
  isbn?: string;
  description?: string;
  authors?: BookAuthor[];
  publisher?: BookPublisher;
  categories?: BookCategory[];
  language?: string;
  searchTags?: string[];
  format?: string;
  pages?: number;
  coverImage?: string | null;
  images?: string[];
  status?: string;
  price?: number | string;
  priceIn?: number | string;
  originalPrice?: number | string;
  originalPriceIn?: number | string;
  rating?: number | string;
  stock?: number;
  inStock?: boolean;
  publishedYear?: string | number;
  legacyBookId?: string;
  legacyId?: string;
  edition?: string;
  translation?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BookPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BooksResponse = {
  success: boolean;
  message: string;
  data: ApiBook[];
  meta?: BookPaginationMeta;
};

export type SingleBookResponse = {
  success: boolean;
  message: string;
  data: ApiBook;
};

export type BookSortBy = "title" | "createdAt" | "publicationDate";
export type BookSortOrder = "asc" | "desc";

export type GetBooksParams = {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  publisher?: string;
  category?: string;
  status?: string;
  language?: string;
  format?: string;
  sortBy?: BookSortBy;
  sortOrder?: BookSortOrder;
  [key: string]: string | number | boolean | undefined;
};

/**
 * UI View Model for Catalog Book
 */
export interface CatalogBook {
  id: string;
  slug: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  price: string;
  rawPrice: number;
  priceIn?: string;
  rawPriceIn?: number;
  originalPrice?: string;
  originalPriceIn?: string;
  rating: string;
  cover: StaticImageData | string;
  detail?: string;
  publishedYear?: string;
  inStock?: boolean;
  format?: string;
  pages?: number;
  isbn?: string;
  language?: string;
}

/**
 * Transforms an ApiBook into a CatalogBook with '-' fallback for missing properties
 */
export function transformApiBookToCatalogBook(
  book: ApiBook,
  fallbackCover: StaticImageData | string = FALLBACK_BOOK_COVER,
): CatalogBook {
  const authorsText =
    book.authors && book.authors.length > 0
      ? book.authors
          .map((a) => a?.name?.trim())
          .filter(Boolean)
          .join(", ")
      : "-";

  const publisherText = book.publisher?.name?.trim() || "-";

  const categoryText =
    book.categories && book.categories.length > 0
      ? book.categories
          .map((c) => c?.name?.trim())
          .filter(Boolean)
          .join(", ")
      : "-";

  let priceText = "-";
  let rawPrice = 0;
  if (book.price !== undefined && book.price !== null && book.price !== "") {
    const numPrice =
      typeof book.price === "number"
        ? book.price
        : parseFloat(String(book.price).replace(/[^0-9.]/g, ""));
    if (!isNaN(numPrice)) {
      if (numPrice === 0) {
        priceText = "Free";
        rawPrice = 0;
      } else {
        priceText = `₹${numPrice}`;
        rawPrice = numPrice;
      }
    } else if (typeof book.price === "string" && book.price.trim().length > 0) {
      priceText = book.price.trim();
    }
  }

  let priceInText: string | undefined = undefined;
  let rawPriceIn: number | undefined = undefined;
  if (book.priceIn !== undefined && book.priceIn !== null && book.priceIn !== "") {
    const numPriceIn =
      typeof book.priceIn === "number"
        ? book.priceIn
        : parseFloat(String(book.priceIn).replace(/[^0-9.]/g, ""));
    if (!isNaN(numPriceIn)) {
      if (numPriceIn === 0) {
        priceInText = "Free";
        rawPriceIn = 0;
      } else {
        priceInText = `₹${numPriceIn}`;
        rawPriceIn = numPriceIn;
      }
    } else if (typeof book.priceIn === "string" && book.priceIn.trim().length > 0) {
      priceInText = book.priceIn.trim();
    }
  }

  // If base price is missing or not given, fallback to priceIn
  if (priceText === "-" && priceInText) {
    priceText = priceInText;
    rawPrice = rawPriceIn ?? 0;
  }

  let originalPriceText: string | undefined = undefined;
  if (
    book.originalPrice !== undefined &&
    book.originalPrice !== null &&
    book.originalPrice !== ""
  ) {
    const numOrig =
      typeof book.originalPrice === "number"
        ? book.originalPrice
        : parseFloat(String(book.originalPrice).replace(/[^0-9.]/g, ""));
    if (!isNaN(numOrig) && numOrig > 0) {
      originalPriceText = `₹${numOrig}`;
    } else if (
      typeof book.originalPrice === "string" &&
      book.originalPrice.trim().length > 0
    ) {
      originalPriceText = book.originalPrice.trim();
    }
  }

  let originalPriceInText: string | undefined = undefined;
  if (
    book.originalPriceIn !== undefined &&
    book.originalPriceIn !== null &&
    book.originalPriceIn !== ""
  ) {
    const numOrigIn =
      typeof book.originalPriceIn === "number"
        ? book.originalPriceIn
        : parseFloat(String(book.originalPriceIn).replace(/[^0-9.]/g, ""));
    if (!isNaN(numOrigIn) && numOrigIn > 0) {
      originalPriceInText = `₹${numOrigIn}`;
    } else if (
      typeof book.originalPriceIn === "string" &&
      book.originalPriceIn.trim().length > 0
    ) {
      originalPriceInText = book.originalPriceIn.trim();
    }
  }

  let ratingText = "-";
  if (book.rating !== undefined && book.rating !== null && book.rating !== "") {
    ratingText = String(book.rating);
  }

  // Cover image resolution
  let coverSrc: StaticImageData | string = fallbackCover;
  if (book.coverImage && typeof book.coverImage === "string" && book.coverImage.trim()) {
    const trimmedCover = book.coverImage.trim();
    if (trimmedCover.startsWith("http://") || trimmedCover.startsWith("https://")) {
      coverSrc = trimmedCover;
    } else if (!trimmedCover.includes("/")) {
      // Relative filename in upload directory
      coverSrc = `https://indobanglabooks.in/upload/product/${trimmedCover}`;
    } else {
      coverSrc = trimmedCover;
    }
  }

  return {
    id: book._id || book.slug || "-",
    slug: book.slug || book._id || "-",
    title: book.title?.trim() || "-",
    author: authorsText,
    publisher: publisherText,
    category: categoryText,
    price: priceText,
    rawPrice,
    priceIn: priceInText,
    rawPriceIn,
    originalPrice: originalPriceText,
    originalPriceIn: originalPriceInText,
    rating: ratingText,
    cover: coverSrc,
    detail: book.description ? book.description.replace(/<[^>]*>?/gm, "").trim() : "-",
    publishedYear: book.publishedYear ? String(book.publishedYear) : "-",
    inStock: book.inStock ?? (book.stock ? book.stock > 0 : true),
    format: book.format || "-",
    pages: book.pages,
    isbn: book.isbn || "-",
    language: book.language || "-",
  };
}
