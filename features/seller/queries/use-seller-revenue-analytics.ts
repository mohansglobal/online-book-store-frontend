// Query hook for fetching seller revenue analytics
import { useQuery } from "@tanstack/react-query";
import { getSellerRevenueAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { SellerRevenueAnalyticsParams } from "../types/seller.types";

export function useSellerRevenueAnalytics(
  params?: SellerRevenueAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.revenueAnalytics(params),
    queryFn: ({ signal }) => getSellerRevenueAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}
