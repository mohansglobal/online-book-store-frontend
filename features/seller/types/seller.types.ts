import type {
  OrderItem,
  OrderItemStatus,
  OrderPaymentMethod,
  OrderSnapshotAddress,
  OrderStatus,
  PaymentStatus,
} from "@/features/orders/types/order.types";

export interface SellerCustomerSummary {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface SellerOrderItem {
  itemId?: string;
  _id?: string;
  bookListingId: string;
  bookId: string;
  title: string;
  coverImage?: string;
  priceInRupees: number;
  priceInPaise: number;
  quantity: number;
  subtotalInRupees: number;
  subtotalInPaise: number;
  status?: OrderItemStatus;
}

export interface SellerRecentOrder {
  orderId: string;
  orderNumber: string;
  customer: SellerCustomerSummary;
  orderStatus: OrderStatus;
  overallOrderStatus?: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: OrderPaymentMethod;
  createdAt: string;
  sellerTotalInRupees: number;
  sellerTotalInPaise: number;
  sellerItemCount: number;
  items: SellerOrderItem[];
}

export interface SellerDashboardMonthlySummary {
  month: string;
  totalOrdersInMonth: number;
  totalSellerEarningsInRupees: number;
  totalSellerEarningsInPaise: number;
}

export interface SellerRecentOrdersData {
  summary: SellerDashboardMonthlySummary;
  recentOrders: SellerRecentOrder[];
}

export interface SellerPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SellerRecentOrdersResponse {
  success: boolean;
  message: string;
  data: SellerRecentOrdersData;
  meta: SellerPaginationMeta;
}

export interface SellerRecentOrdersParams {
  month?: string;
  year?: number;
  status?: OrderStatus | string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export type SellerRevenueTimeframe = "weekly" | "monthly" | "yearly";

export interface SellerRevenuePoint {
  label: string;
  date: string;
  revenueInRupees: number;
  revenueInPaise: number;
  orders: number;
}

export interface SellerRevenueMain {
  totalRevenueInRupees: number;
  totalRevenueInPaise: number;
  growthPercentage: number;
  differenceInRupees: number;
  differenceInPaise: number;
  isGrowthPositive: boolean;
  comparisonText: string;
  previousPeriodRevenueInRupees: number;
  previousPeriodRevenueInPaise: number;
}

export interface SellerRevenueToday {
  todayRevenueInRupees: number;
  todayRevenueInPaise: number;
  todayOrdersCount: number;
}

export interface SellerRevenueMetrics {
  netRevenueInRupees: number;
  netRevenueInPaise: number;
  formattedNetRevenue: string;
  avgOrderValueInRupees: number;
  avgOrderValueInPaise: number;
  totalOrders: number;
  totalItemsSold: number;
}

export interface SellerRevenueTrend {
  title: string;
  subtitle: string;
  trendTotalInRupees: number;
  trendTotalInPaise: number;
  trendGrowthPercentage: number;
  isTrendGrowthPositive: boolean;
  points: SellerRevenuePoint[];
}

export interface SellerRevenueAnalyticsData {
  timeframe: SellerRevenueTimeframe;
  currency: string;
  main: SellerRevenueMain;
  today: SellerRevenueToday;
  metrics: SellerRevenueMetrics;
  trend: SellerRevenueTrend;
}

export interface SellerRevenueAnalyticsResponse {
  success: boolean;
  message: string;
  data: SellerRevenueAnalyticsData;
}

export interface SellerRevenueAnalyticsParams {
  timeframe?: SellerRevenueTimeframe;
  [key: string]: string | number | undefined;
}

// Daily orders & 7-day growth breakdown types matching GET /api/v1/dashboard/daily-orders
export interface DailyOrdersDayData {
  day: string;
  dayFull?: string;
  date: string;
  orders: number;
  shipments?: number;
  revenueInRupees?: number;
  revenueInPaise?: number;
  isPeak: boolean;
}

export interface DailyOrdersMainMetrics {
  averageDailyOrders: number;
  growthPercentage: number;
  formattedGrowth: string;
  isGrowthPositive: boolean;
  growthBadge: string;
  totalOrders: number;
  totalShipments?: number;
  totalRevenueInRupees?: number;
  totalRevenueInPaise?: number;
}

export interface DailyOrdersPeakInfo {
  day: string;
  date: string;
  orders: number;
  badge: string;
}

export interface DailyOrdersCurrentPeriod {
  startDate: string;
  endDate: string;
  totalOrders: number;
  averageDailyOrders: number;
  totalShipments?: number;
  totalRevenueInRupees?: number;
  totalRevenueInPaise?: number;
  days: DailyOrdersDayData[];
}

export interface DailyOrdersPreviousPeriod {
  startDate: string;
  endDate: string;
  totalOrders: number;
  averageDailyOrders: number;
  totalShipments?: number;
  totalRevenueInRupees?: number;
  totalRevenueInPaise?: number;
}

export interface DailyOrdersComparison {
  differenceInOrders: number;
  differenceInDailyAverage: number;
  growthPercentage: number;
  isGrowthPositive: boolean;
  comparisonText: string;
}

export interface DailyOrdersAnalyticsData {
  title: string;
  subtitle: string;
  periodLabel: string;
  main: DailyOrdersMainMetrics;
  peak: DailyOrdersPeakInfo;
  currentPeriod: DailyOrdersCurrentPeriod;
  previousPeriod?: DailyOrdersPreviousPeriod;
  comparison?: DailyOrdersComparison;
}

export interface DailyOrdersAnalyticsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: DailyOrdersAnalyticsData;
}

export interface DailyOrdersAnalyticsParams {
  days?: number;
  sellerId?: string;
  [key: string]: string | number | undefined;
}

// Category / Genre breakdown analytics types matching backend contracts
export type CategoryBreakdownTimeframe =
  | "all"
  | "weekly"
  | "monthly"
  | "yearly";

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  nameBn?: string;
  slug: string;
  booksSold: number;
  percentage: number;
  formattedPercentage: string;
  revenueInRupees: number;
  revenueInPaise: number;
  color: string;
  isOthers: boolean;
}

export interface CategoryBreakdownAnalyticsData {
  title: string;
  subtitle: string;
  timeframe: CategoryBreakdownTimeframe;
  totalBooksSold: number;
  formattedTotalBooksSold: string;
  totalRevenueInRupees: number;
  totalRevenueInPaise: number;
  totalCategories: number;
  items: CategoryBreakdownItem[];
  others?: CategoryBreakdownItem | null;
}

export interface CategoryBreakdownAnalyticsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: CategoryBreakdownAnalyticsData;
}

export interface CategoryBreakdownAnalyticsParams {
  timeframe?: CategoryBreakdownTimeframe;
  limit?: number;
  year?: number;
  month?: number;
  sellerId?: string;
  [key: string]: string | number | undefined;
}

// Top authors volume analytics types matching backend GET /api/v1/dashboard/top-authors
export interface TopAuthorAnalyticsItem {
  rank: number;
  authorId: string;
  name: string;
  nameBn?: string;
  slug: string;
  photo?: string;
  booksSold: number;
  formattedBooksSold: string;
  percentage: number;
  formattedPercentage: string;
  revenueInRupees: number;
  revenueInPaise: number;
}

export interface TopAuthorsAnalyticsData {
  title: string;
  subtitle: string;
  timeframe: string;
  limit: number;
  activeAuthorsInCatalogCount: number;
  totalCopiesSold: number;
  formattedTotalCopiesSold: string;
  totalRevenueInRupees: number;
  totalRevenueInPaise: number;
  totalAuthorsWithSales: number;
  items: TopAuthorAnalyticsItem[];
}

export interface TopAuthorsAnalyticsResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: TopAuthorsAnalyticsData;
}

export interface TopAuthorsAnalyticsParams {
  timeframe?: CategoryBreakdownTimeframe;
  limit?: number;
  year?: number;
  month?: number;
  sellerId?: string;
  [key: string]: string | number | undefined;
}

// Seller Orders List matching GET /api/v1/orders/seller
export interface SellerOrderBuyer {
  _id?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  profilePicture?: string;
}

export interface SellerOrder {
  _id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  overallOrderStatus?: OrderStatus;
  sellerSubtotalInPaise: number;
  subtotalInPaise?: number;
  totalAmountInPaise?: number;
  couponCode?: string;
  couponDiscountInPaise?: number;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: PaymentStatus;
  buyer?: SellerOrderBuyer;
  shippingAddress?: OrderSnapshotAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface SellerOrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  q?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | undefined;
}

export interface SellerOrdersResponse {
  success: boolean;
  message: string;
  data: SellerOrder[];
  meta: SellerPaginationMeta;
}


