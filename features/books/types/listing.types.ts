// Seller Listing types and creation contracts matching /api/v1/listings
import type { ApiBook, BookPublisher, RatingBreakdown, RatingPercentages } from "./book.types";

export type ListingSeller = {
  _id: string;

  name: string;

  email?: string;

  mobileNumber?: string;

  role?: string;
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

  rating?: number | string;

  averageRating?: number;

  ratingCount?: number;

  totalRatings?: number;

  totalReviews?: number;

  reviewCount?: number;

  ratingBreakdown?: RatingBreakdown;

  ratingPercentages?: RatingPercentages;
};

export type CreateBookListingInput = {
  // Reference to existing book in catalog
  book?: string;

  isbn?: string;

  // Canonical bibliographic metadata
  title?: string;

  titleBn?: string;

  authors?: string[];

  publisher?: string;

  categories?: string[];

  description?: string;

  coverImage?: string;

  images?: string[];

  language?: string;

  format?: string;

  pages?: number;

  edition?: string;

  country?: string;

  searchTags?: string[];

  // Inventory and pricing
  mrpInPaise: number;

  sellingPriceInPaise: number;

  stock: number;

  sku?: string;
};

export type CreateBookListingResponse = {
  success: boolean;

  message: string;

  data: ApiListing | ApiBook;
};

export type GetSellerListingsParams = {
  page?: number;

  limit?: number;

  search?: string;

  isActive?: boolean;

  inStock?: boolean;

  sortBy?:
    | "createdAt"
    | "sellingPriceInPaise"
    | "stock"
    | "mrpInPaise"
    | "title"
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "stock_asc"
    | "stock_desc";

  sortOrder?: "asc" | "desc";
};

export type SellerBookListingItem = {
  _id: string;

  book?: {
    _id?: string;

    title?: string;

    titleBn?: string;

    authors?: Array<{ _id?: string; name: string; nameBn?: string }>;

    categories?: Array<{ _id?: string; name: string; nameBn?: string }>;

    isbn?: string;

    description?: string;

    format?: string;

    coverImage?: string;

    images?: string[];

    price?: number;

    priceIn?: number;

    originalPrice?: number;
  };

  mrpInPaise?: number;

  sellingPriceInPaise?: number;

  priceInPaise?: number;

  mrp?: number;

  price?: number;

  discountPercentage?: number;

  discountStatus?: string;

  isDiscountActive?: boolean;

  activeDiscount?: {
    discountType?: ListingDiscountType;

    discountValue?: number;

    discountAmountInPaise?: number;

    startDate?: string | null;

    endDate?: string | null;
  } | null;

  stock?: number;

  isActive?: boolean;

  coverImage?: string;

  effectiveImages?: string[];

  listingImages?: string[];

  averageRating?: number;

  ratingCount?: number;

  totalRatings?: number;

  totalReviews?: number;

  sku?: string;

  discountSchedule?: ListingDiscountSchedule | null;

  createdAt?: string;

  updatedAt?: string;
};

export type SellerListingsResponse = {
  success: boolean;

  message: string;

  data: SellerBookListingItem[];

  meta?: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
};

export type StockOperation = "increase" | "decrease" | "set";

export type UpdateStockInput = {
  listingId: string;

  operation: StockOperation;

  quantity: number;
};

export type UpdateStockResponse = {
  success: boolean;

  message: string;

  data: {
    _id: string;

    stock: number;

    mrpInPaise?: number;

    sellingPriceInPaise?: number;

    isActive?: boolean;
  };
};

export type ToggleListingStatusInput = {
  listingId: string;

  isActive?: boolean;
};

export type ToggleListingStatusResponse = {
  success: boolean;

  message: string;

  data: {
    _id: string;

    isActive: boolean;

    stock?: number;

    mrpInPaise?: number;

    sellingPriceInPaise?: number;
  };
};

export type ListingDiscountType = "PERCENTAGE" | "FLAT";

export type ListingDiscountSchedule = {
  startDate?: string | null;

  endDate?: string | null;

  discountType: ListingDiscountType;

  discountValue: number;

  campaignName?: string;

  isActive?: boolean;
};

export type ApplyListingDiscountInput = {
  listingId: string;

  discountType: ListingDiscountType;

  discountValue: number;

  startDate?: string;

  endDate?: string;

  campaignName?: string;

  mrp?: number;

  mrpInPaise?: number;
};

export type ApplyListingDiscountResponse = {
  success: boolean;

  message: string;

  data: {
    _id: string;

    id?: string;

    book?: string | ApiBook;

    seller?: string | ListingSeller;

    stock?: number;

    isActive?: boolean;

    listingImages?: string[];

    mrpInPaise?: number;

    sellingPriceInPaise?: number;

    priceInPaise?: number;

    mrp?: number;

    price?: number;

    discountPercentage?: number;

    discountSchedule?: ListingDiscountSchedule | null;

    createdAt?: string;

    updatedAt?: string;
  };
};

export type RemoveListingDiscountResponse = {
  success: boolean;

  message: string;

  data?: unknown;
};

export type BulkDiscountTargetType = "ALL" | "SPECIFIC";

export type BulkApplyDiscountInput = {
  targetType: BulkDiscountTargetType;

  listingIds?: string[];

  discountType: ListingDiscountType;

  discountValue: number;

  startDate?: string;

  endDate?: string;

  campaignName?: string;
};

export type BulkApplyDiscountResponse = {
  success: boolean;

  message: string;

  data?: {
    modifiedCount?: number;

    matchedCount?: number;
  };
};

export type BulkRemoveDiscountInput = {
  targetType: BulkDiscountTargetType;

  listingIds?: string[];
};

export type BulkRemoveDiscountResponse = {
  success: boolean;

  message: string;

  data?: {
    modifiedCount?: number;
  };
};

export type UpdateListingInput = {
  listingId: string;

  mrp?: number;

  mrpInPaise?: number;

  sellingPrice?: number;

  sellingPriceInPaise?: number;

  stock?: number;

  sku?: string;

  listingImages?: string[];

  isActive?: boolean;

  clearDiscount?: boolean;

  discountAction?: "REMOVE" | "KEEP";

  discountSchedule?: ListingDiscountSchedule | null;

  title?: string;

  titleBn?: string;

  isbn?: string;

  description?: string;

  authors?: string[];

  publisher?: string;

  categories?: string[];

  language?: string;

  format?: string;

  edition?: string;

  pages?: number;

  coverImage?: string;
};

export type UpdateListingResponse = {
  success: boolean;
  message: string;
  data: SellerBookListingItem;
};
