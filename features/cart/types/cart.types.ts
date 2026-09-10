// Cart domain types matching backend /api/v1/cart contracts

export type CartAuthor = {
  _id: string;
  name: string;
  slug: string;
  photo?: string;
};

export type CartPublisher = {
  _id: string;
  name: string;
  slug: string;
};

export type CartBook = {
  _id: string;
  title: string;
  titleBn?: string;
  slug: string;
  isbn?: string;
  coverImage?: string | null;
  format?: string;
  status?: string;
  authors?: CartAuthor[];
  publisher?: CartPublisher;
};

export type CartSeller = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type CartListing = {
  _id: string;
  mrpInPaise: number;
  sellingPriceInPaise: number;
  stock: number;
  sku?: string;
  isActive: boolean;
  book?: CartBook;
  seller?: CartSeller;
};

export type BackendCartItem = {
  id: string;
  listing?: CartListing;
  quantity: number;
  unitPriceInPaise: number;
  unitMrpInPaise: number;
  itemSubtotalInPaise: number;
  itemSavingsInPaise: number;
  isAvailable: boolean;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  availableStock: number;
  addedAt: string;
};

export type BackendCartSummary = {
  totalItems: number;
  subtotalInPaise: number;
  totalMrpInPaise: number;
  totalDiscountInPaise: number;
  hasUnavailableItems: boolean;
  hasStockIssues: boolean;
};

export type BackendCart = {
  id: string;
  user: string;
  items: BackendCartItem[];
  summary: BackendCartSummary;
  updatedAt: string;
};

export type CartResponse = {
  success: boolean;
  message: string;
  data: BackendCart;
};

// Input payload contracts
export type AddToCartInput = {
  listingId?: string;
  bookId?: string;
  quantity: number;
};

export type UpdateCartItemInput = {
  itemId: string;
  quantity: number;
};

export type MergeCartItemInput = {
  listingId?: string;
  bookId?: string;
  quantity: number;
};

export type MergeCartInput = {
  items: MergeCartItemInput[];
};

// Guest Cart Store item contract
export type GuestCartItem = {
  listingId: string;
  bookId: string;
  slug: string;
  title: string;
  coverImage: string;
  author: string;
  format: string;
  price: number;
  originalPrice: number;
  quantity: number;
};

// Unified presentation view contract for both server and guest items (in Rupees)
export type CartItemView = {
  id: string;
  listingId: string;
  bookId: string;
  slug: string;
  title: string;
  author: string;
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
