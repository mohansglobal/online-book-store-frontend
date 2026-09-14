// Book domain types and contracts matching backend /api/v1/listings & /api/v1/books
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
  logo?: string;
};

export type BookCategory = {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
};

export type ListingSeller = {
  _id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
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
  // Listing-level properties
  listingId?: string;
  bookId?: string;
  seller?: ListingSeller;
  mrpInPaise?: number;
  sellingPriceInPaise?: number;
  sku?: string;
  isActive?: boolean;
  effectiveImages?: string[];
  listingImages?: string[];
};

export type ApiListing = {
  _id: string;
  seller?: ListingSeller;
  book?: ApiBook;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  mrpInPaise?: number;
  sellingPriceInPaise?: number;
  sku?: string;
  stock?: number;
  publisher?: string | BookPublisher;
  effectiveImages?: string[];
  listingImages?: string[];
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
  homesection?: boolean | string;
  homeSection?: boolean | string;
  [key: string]: string | number | boolean | undefined;
};

export interface CatalogBook {
  id: string;
  slug: string;
  title: string;
  author: string;
  publisher: string;
  seller?: string;
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

// Re-export transformation utilities
export {
  normalizeListingToApiBook,
  parsePrice,
  transformApiBookToCatalogBook,
  resolveAuthorPhoto,
} from "../utils/book.transform";
