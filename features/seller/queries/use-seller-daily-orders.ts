// Query hook for fetching seller daily orders & 7-day growth analytics
import { useQuery } from "@tanstack/react-query";
import { getDailyOrdersAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { DailyOrdersAnalyticsParams } from "../types/seller.types";

export function useSellerDailyOrders(
  params?: DailyOrdersAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.dailyOrders(params),
    queryFn: ({ signal }) => getDailyOrdersAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}
