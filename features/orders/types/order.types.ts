// Order domain types matching backend /api/v1/orders contracts

export type OrderPaymentMethod = "ONLINE_PAY" | "CASH_ON_DELIVERY";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type RefundStatus = "NONE" | "PENDING" | "PROCESSED" | "FAILED";

export interface CreateOrderInput {
  shippingAddressId: string;
  billingSameAsShipping: boolean;
  billingAddressId?: string;
  paymentMethod: OrderPaymentMethod;
  couponCode?: string;
  paymentId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface OrderItem {
  bookListing: string;
  book?: string;
  title: string;
  coverImage?: string;
  priceInPaise: number;
  quantity: number;
  subtotalInPaise: number;
}

export interface OrderSnapshotAddress {
  fullName: string;
  mobileNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer?: string;
  items: OrderItem[];
  subtotalInPaise: number;
  deliveryChargeInPaise: number;
  couponDiscountInPaise: number;
  couponCode?: string;
  totalAmountInPaise: number;
  paymentMethod: OrderPaymentMethod;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  refundStatus?: RefundStatus;
  cancelledAt?: string;
  cancellationReason?: string;
  shippingAddress: OrderSnapshotAddress;
  billingAddress: OrderSnapshotAddress;
  billingSameAsShipping: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  from?: string;
  to?: string;
  [key: string]: string | number | undefined;
}

export interface OrdersPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrdersPaginationMeta;
}

export type OrderTabFilter = "ALL" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";

export type DateRangeFilterOption =
  | "ALL_TIME"
  | "today"
  | "last7days"
  | "last30days"
  | "last3months"
  | "thisYear";


