// Wishlist domain types and data models

export type WishlistItem = {
  /** Unique identifier for the wishlist item (listingId or bookId) */
  id: string;
  bookId: string;
  listingId?: string;
  slug: string;
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
