// TanStack Query cache key factory for seller features
import type {
  CategoryBreakdownAnalyticsParams,
  DailyOrdersAnalyticsParams,
  SellerOrdersQueryParams,
  SellerRecentOrdersParams,
  SellerRevenueAnalyticsParams,
  TopAuthorsAnalyticsParams,
  TopSellersAnalyticsParams,
  TopSellingBooksParams,
  OrderHealthAnalyticsParams,
} from "../types/seller.types";

export const sellerKeys = {
  all: ["seller"] as const,

  dashboard: () => [...sellerKeys.all, "dashboard"] as const,
  
  recentOrders: (params?: SellerRecentOrdersParams) =>
    [...sellerKeys.dashboard(), "recent-orders", params ?? {}] as const,

  orders: (params?: SellerOrdersQueryParams) =>
    [...sellerKeys.all, "orders", params ?? {}] as const,

  infiniteOrders: (params?: SellerOrdersQueryParams) =>
    [...sellerKeys.all, "orders", "infinite", params ?? {}] as const,

  revenueAnalytics: (params?: SellerRevenueAnalyticsParams) =>
    [...sellerKeys.dashboard(), "revenue-analytics", params ?? {}] as const,

  dailyOrders: (params?: DailyOrdersAnalyticsParams) =>
    [...sellerKeys.dashboard(), "daily-orders", params ?? {}] as const,

  categoryBreakdown: (params?: CategoryBreakdownAnalyticsParams) =>
    [...sellerKeys.dashboard(), "category-breakdown", params ?? {}] as const,

  topAuthors: (params?: TopAuthorsAnalyticsParams) =>
    [...sellerKeys.dashboard(), "top-authors", params ?? {}] as const,

  topSellers: (params?: TopSellersAnalyticsParams) =>
    [...sellerKeys.dashboard(), "top-sellers", params ?? {}] as const,

  topBooks: (params?: TopSellingBooksParams) =>
    [...sellerKeys.dashboard(), "top-books", params ?? {}] as const,

  orderHealth: (params?: OrderHealthAnalyticsParams) =>
    [...sellerKeys.dashboard(), "order-health", params ?? {}] as const,
};










