// Cart domain types matching backend /api/v1/cart contracts

export interface CartAuthor {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
  photo?: string;
}

export interface CartPublisher {
  _id: string;
  name: string;
  nameBn?: string;
  slug: string;
}

export interface CartBook {
  _id: string;
  title: string;
  titleBn?: string;
  slug: string;
  isbn?: string;
  coverImage: string;
  images?: string[];
  publisher?: CartPublisher;
  authors?: CartAuthor[];
  format?: string;
}

export interface CartSeller {
  _id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role?: string;
}

export interface CartItem {
  bookListingId: string;
  quantity: number;
  priceInPaise: number;
  priceInRupees: number;
  mrpInPaise: number;
  mrpInRupees: number;
  subtotalInPaise: number;
  subtotalInRupees: number;
  stockAvailable: number;
  isAvailable: boolean;
  book: CartBook;
  seller: CartSeller;
}

export interface CartData {
  _id: string;
  user: string;
  items: CartItem[];
  totalItemsCount: number;
  totalAmountInPaise: number;
  totalAmountInRupees: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: CartData;
}

// Input payload contracts
export type AddToCartInput = {
  bookListingId?: string;
  bookListing?: string;
  listingId?: string;
  bookId?: string;
  quantity?: number;
};

export type SyncCartItemInput = {
  bookListingId?: string;
  bookListing?: string;
  listingId?: string;
  quantity?: number;
};

export type SyncCartInput =
  | SyncCartItemInput[]
  | {
      items: SyncCartItemInput[];
    };

export type UpdateCartItemInput = {
  bookListingId: string;
  quantity: number;
};

// Guest Cart Store item contract
export type GuestCartItem = {
  id: string;
  listingId: string;
  bookListingId?: string;
  bookId?: string;
  slug: string;
  title: string;
  coverImage: string;
  author: string;
  seller?: string;
  format: string;
  price: number;
  originalPrice: number;
  quantity: number;
};

// Unified presentation view contract for both server and guest items (in Rupees)
export type CartItemView = {
  id: string;
  listingId: string;
  bookListingId: string;
  bookId: string;
  slug: string;
  title: string;
  author: string;
  seller?: string;
  coverImage: string;
  format: string;
  price: number;
  originalPrice: number;
  quantity: number;
  subtotal: number;
  savings: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  availableStock?: number;
};

export type CartSummaryView = {
  totalItems: number;
  totalCount: number;
  subtotal: number;
  totalMrp: number;
  mrpSavings: number;
  totalDiscount: number;
  hasUnavailableItems: boolean;
  hasStockIssues: boolean;
};
