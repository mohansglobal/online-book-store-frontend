// Book domain types and contracts matching backend /api/v1/listings & /api/v1/books
import type { StaticImageData } from "next/image";
import type { ApiListing, ListingSeller } from "./listing.types";

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

export type RatingBreakdown = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  [key: string]: number;
};

export type RatingPercentages = RatingBreakdown;

export type BookCountry = {
  _id: string;
  name: string;
  code?: string;
  phoneCode?: string;
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
  averageRating?: number;
  ratingCount?: number;
  totalRatings?: number;
  totalReviews?: number;
  reviewCount?: number;
  ratingBreakdown?: RatingBreakdown;
  ratingPercentages?: RatingPercentages;
  stock?: number;
  inStock?: boolean;
  publishedYear?: string | number;
  legacyBookId?: string;
  legacyId?: string;
  edition?: string;
  translation?: string;
  country?: string | BookCountry;
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
  totalRatings?: number;
  ratingCount?: number;
  cover: StaticImageData | string;
  detail?: string;
  publishedYear?: string;
  inStock?: boolean;
  stock?: number;
  format?: string;
  pages?: number;
  isbn?: string;
  language?: string;
}

export type CanonicalBook = {
  _id: string;
  title: string;
  titleBn?: string;
  isbn: string;
  publisher?: {
    _id: string;
    name: string;
    nameBn?: string;
    slug?: string;
    logo?: string;
  };
  authors?: Array<{
    _id: string;
    name: string;
    nameBn?: string;
    slug?: string;
  }>;
  categories?: Array<{
    _id: string;
    name: string;
    nameBn?: string;
    slug?: string;
  }>;
  country?: {
    _id: string;
    name: string;
    code: string;
  };
  language?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  searchTags?: string[];
  edition?: string;
  pages?: number;
  price?: number | string;
  priceIn?: number | string;
  originalPrice?: number | string;
  originalPriceIn?: number | string;
  mrp?: number | string;
  mrpInPaise?: number;
  sellingPriceInPaise?: number;
};

export type IsbnLookupResponse = {
  success: boolean;
  exists: boolean;
  alreadyListedBySeller: boolean;
  existingListingId: string | null;
  message: string;
  data: CanonicalBook | null;
};

// Re-export listing contracts
export * from "./listing.types";

// Re-export transformation and stock utilities
export {
  normalizeListingToApiBook,
  parsePrice,
  transformApiBookToCatalogBook,
  resolveAuthorPhoto,
} from "../utils/book.transform";

export {
  getStockInfo,
  getBookStockInfo,
  getStockLabel,
  canPurchaseBook,
  type StockInfo,
  type StockLevel,
} from "../utils/stock.utils";
