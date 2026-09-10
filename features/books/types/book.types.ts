// Book domain types and contracts matching backend /api/v1/books
import type { StaticImageData } from "next/image";

export const FALLBACK_BOOK_COVER =
  "https://i.pinimg.com/736x/57/69/7a/57697aeaa7fa70578f344fb6ee4aa1d9.jpg";

export const DEFAULT_AUTHOR_FALLBACK =
  "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";

export type BookAuthor = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  bio?: string;
  photo?: string;
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
  country?: string;
  weight?: string | number;
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

export type BookSortBy =
  | "title"
  | "createdAt"
  | "publicationDate"
  | "price_high_to_low"
  | "price_low_to_high"
  | "price"
  | "rating"
  | "newest"
  | "oldest";

export type BookSortOrder = "asc" | "desc";

export type GetBooksParams = {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  publisher?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  status?: string;
  language?: string;
  format?: string;
  sortBy?: BookSortBy | string;
  sortOrder?: BookSortOrder;
  [key: string]: string | number | boolean | undefined;
};

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

function parsePrice(val?: number | string): { text: string; num: number } {
  if (val === undefined || val === null || val === "") return { text: "-", num: 0 };
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (!isNaN(num)) {
    return { text: num === 0 ? "Free" : `₹${num}`, num };
  }
  return { text: typeof val === "string" && val.trim() ? val.trim() : "-", num: 0 };
}

export function transformApiBookToCatalogBook(
  book: ApiBook,
  fallbackCover: StaticImageData | string = FALLBACK_BOOK_COVER,
): CatalogBook {
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

  let coverSrc: StaticImageData | string = fallbackCover;
  if (book.coverImage && typeof book.coverImage === "string" && book.coverImage.trim()) {
    const trimmedCover = book.coverImage.trim();
    if (trimmedCover.startsWith("http://") || trimmedCover.startsWith("https://")) {
      coverSrc = trimmedCover;
    } else if (!trimmedCover.includes("/")) {
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
    price: finalPrice,
    rawPrice: finalRawPrice,
    priceIn: priceInText !== "-" ? priceInText : undefined,
    rawPriceIn: rawPriceIn || undefined,
    originalPrice: origPriceText !== "-" ? origPriceText : undefined,
    originalPriceIn: origPriceInText !== "-" ? origPriceInText : undefined,
    rating: book.rating !== undefined && book.rating !== null && book.rating !== "" ? String(book.rating) : "-",
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
