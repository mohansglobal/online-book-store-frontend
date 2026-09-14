// Domain types for Checkout Summary API (/api/v1/checkout/summary)
import type { Address } from "@/features/addresses";

export type CheckoutUnavailableReason =
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "LISTING_INACTIVE";

export type CheckoutIssueCode =
  | "EMPTY_CART"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "LISTING_INACTIVE"
  | "SHIPPING_ADDRESS_REQUIRED"
  | "BILLING_ADDRESS_REQUIRED"
  | "ADDRESS_NOT_FOUND"
  | "COD_UNAVAILABLE";

export interface CheckoutSummaryItem {
  bookListingId: string;
  bookId: string;
  title: string;
  titleBn?: string;
  author: string;
  format?: string;
  coverImage?: string | null;
  quantity: number;
  stockAvailable: number;
  isAvailable: boolean;
  unavailableReason?: CheckoutUnavailableReason;
  mrpInPaise: number;
  sellingPriceInPaise: number;
  subtotalInPaise: number;
  itemDiscountInPaise: number;
  seller: {
    id: string;
    name: string;
  };
}

export interface CheckoutPricing {
  itemsCount: number;
  totalQuantity: number;
  mrpTotalInPaise: number;
  subtotalInPaise: number;
  itemDiscountInPaise: number;
  couponDiscountInPaise: number;
  deliveryChargeInPaise: number;
  totalSavingsInPaise: number;
  totalAmountInPaise: number;
  currency: string;
}

export interface CheckoutCoupon {
  code: string;
  isValid: boolean;
  discountInPaise: number;
  message?: string;
}

export interface CheckoutPaymentMethod {
  id: "ONLINE_PAY" | "CASH_ON_DELIVERY";
  label: string;
  isAvailable: boolean;
}

export interface CheckoutDelivery {
  estimatedMinDays: number;
  estimatedMaxDays: number;
}

export interface CheckoutIssue {
  code: CheckoutIssueCode;
  message: string;
  bookListingId?: string;
}

export interface CheckoutState {
  canCheckout: boolean;
  issues: CheckoutIssue[];
}

export interface CheckoutSummaryData {
  items: CheckoutSummaryItem[];
  pricing: CheckoutPricing;
  coupon: CheckoutCoupon | null;
  addresses: {
    shippingAddress: Address | null;
    billingAddress: Address | null;
    billingSameAsShipping: boolean;
  };
  paymentMethods: CheckoutPaymentMethod[];
  delivery: CheckoutDelivery;
  checkoutState: CheckoutState;
}

export interface CheckoutSummaryResponse {
  success: boolean;
  message: string;
  data: CheckoutSummaryData;
}

export type CheckoutSummaryQueryParams = {
  shippingAddressId?: string;
  billingAddressId?: string;
  billingSameAsShipping?: "true" | "false";
  couponCode?: string;
  [key: string]: string | undefined;
};
