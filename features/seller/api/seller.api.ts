// Seller API client functions matching backend /api/v1/dashboard endpoints
import { apiClient } from "@/lib/api";
import type {
  CategoryBreakdownAnalyticsParams,
  CategoryBreakdownAnalyticsResponse,
  DailyOrdersAnalyticsParams,
  DailyOrdersAnalyticsResponse,
  SellerOrdersQueryParams,
  SellerOrdersResponse,
  SellerRecentOrdersParams,
  SellerRecentOrdersResponse,
  SellerRevenueAnalyticsParams,
  SellerRevenueAnalyticsResponse,
  TopAuthorsAnalyticsParams,
  TopAuthorsAnalyticsResponse,
} from "../types/seller.types";

// GET /api/v1/orders/seller
export async function getSellerOrders(
  params?: SellerOrdersQueryParams,
  options?: { signal?: AbortSignal },
): Promise<SellerOrdersResponse> {
  return apiClient.get<SellerOrdersResponse>("/orders/seller", {
    params: params as Record<string, string | number | undefined>,
    signal: options?.signal,
  });
}

// GET /api/v1/dashboard/recent-orders
export async function getSellerRecentOrders(
  params?: SellerRecentOrdersParams,
  options?: { signal?: AbortSignal },
): Promise<SellerRecentOrdersResponse> {
  return apiClient.get<SellerRecentOrdersResponse>("/dashboard/recent-orders", {
    params: params as Record<string, string | number | undefined>,
    signal: options?.signal,
  });
}

// GET /api/v1/dashboard/revenue-analytics
export async function getSellerRevenueAnalytics(
  params?: SellerRevenueAnalyticsParams,
  options?: { signal?: AbortSignal },
): Promise<SellerRevenueAnalyticsResponse> {
  return apiClient.get<SellerRevenueAnalyticsResponse>(
    "/dashboard/revenue-analytics",
    {
      params: params as Record<string, string | number | undefined>,
      signal: options?.signal,
    },
  );
}

// GET /api/v1/dashboard/daily-orders
export async function getDailyOrdersAnalytics(
  params?: DailyOrdersAnalyticsParams,
  options?: { signal?: AbortSignal },
): Promise<DailyOrdersAnalyticsResponse> {
  return apiClient.get<DailyOrdersAnalyticsResponse>(
    "/dashboard/daily-orders",
    {
      params: params as Record<string, string | number | undefined>,
      signal: options?.signal,
    },
  );
}

// GET /api/v1/dashboard/category-breakdown
export async function getCategoryBreakdownAnalytics(
  params?: CategoryBreakdownAnalyticsParams,
  options?: { signal?: AbortSignal },
): Promise<CategoryBreakdownAnalyticsResponse> {
  return apiClient.get<CategoryBreakdownAnalyticsResponse>(
    "/dashboard/category-breakdown",
    {
      params: params as Record<string, string | number | undefined>,
      signal: options?.signal,
    },
  );
}

// GET /api/v1/dashboard/top-authors
export async function getTopAuthorsAnalytics(
  params?: TopAuthorsAnalyticsParams,
  options?: { signal?: AbortSignal },
): Promise<TopAuthorsAnalyticsResponse> {
  return apiClient.get<TopAuthorsAnalyticsResponse>(
    "/dashboard/top-authors",
    {
      params: params as Record<string, string | number | undefined>,
      signal: options?.signal,
    },
  );
}


