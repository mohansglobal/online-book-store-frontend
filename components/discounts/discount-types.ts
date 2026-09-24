// Domain types for seller discount management

export type DiscountType = "PERCENTAGE" | "FLAT";

export type DiscountStatusFilter = "all" | "active" | "inactive" | "discounted";

export interface EditDiscountFormData {
  listingId: string;
  bookTitle: string;
  mrp: number;
  currentSellingPrice: number;
  discountType: DiscountType;
  discountValue: number;
  startDate?: string;
  endDate?: string;
}
