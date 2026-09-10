// guest cart domain types

export type GuestCartItem = {
  /** Primary identity — unique listing from a specific seller */
  listingId: string;
  /** Book reference for metadata/navigation */
  bookId: string;
  slug: string;
  title: string;
  coverImage: string;
  author: string;
  format: string;
  /** Snapshot price at add-time (display only, not authoritative) */
  price: number;
  /** Snapshot original/MRP price at add-time (display only) */
  originalPrice: number;
  quantity: number;
};
