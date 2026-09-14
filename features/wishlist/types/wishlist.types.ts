// Wishlist domain types and data models

export interface WishlistAuthor {
  _id: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

export interface WishlistPublisher {
  _id: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

export interface WishlistCategory {
  _id: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

export interface WishlistSeller {
  _id: string;
  name: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
}

export interface WishlistBookItem {
  id: string; // Canonical book _id
  bookId: string; // Canonical book _id
  listingId?: string; // Lowest price active seller listing ID
  title: string;
  titleBn?: string;
  slug: string; // Guaranteed book _id
  canonicalSlug?: string; // SEO text slug
  isbn?: string;
  coverImage: string;
  images?: string[];
  format?: string;
  priceInPaise?: number;
  priceInRupees?: number;
  mrpInPaise?: number;
  mrpInRupees?: number;
  inStock?: boolean;
  totalStock?: number;
  authors?: WishlistAuthor[];
  publisher?: WishlistPublisher;
  seller?: WishlistSeller | string;
  categories?: WishlistCategory[];
  quantity?: number;
  addedAt?: string;
}

export interface WishlistData {
  _id: string;
  user: string;
  items: WishlistBookItem[];
  totalItemsCount: number;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistData;
}

// Payloads for mutations
export type AddWishlistApiInput = {
  bookId?: string;
  id?: string;
  listingId?: string;
};

export type SyncWishlistItemInput = {
  bookId?: string;
  id?: string;
  listingId?: string;
};

export type SyncWishlistInput =
  | SyncWishlistItemInput[]
  | {
      items: SyncWishlistItemInput[];
    };

// Unified presentation view model
export type WishlistItem = {
  /** Unique identifier for the wishlist item */
  id: string;
  bookId?: string;
  listingId?: string;
  slug?: string;
  title: string;
  author: string;
  coverImage: string;
  format?: string;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
  rating?: number | string;
  category?: string;
  publisher?: string;
  seller?: string;
  quantity?: number;
  addedAt: string; // ISO date string
};

export type AddWishlistItemInput = Omit<WishlistItem, "addedAt"> & {
  addedAt?: string;
};

export type WishlistSortOption =
  | "recently_added"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "title_asc"
  | "in_stock";

export type WishlistFilterOption = "all" | "in_stock" | "discounted" | string;

export type WishlistViewMode = "grid" | "list";
