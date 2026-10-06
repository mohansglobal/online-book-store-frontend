// Query hook for fetching admin order health analytics
import { useQuery } from "@tanstack/react-query";
import { getOrderHealthAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { OrderHealthAnalyticsParams } from "../types/seller.types";

export function useSellerOrderHealth(
  params?: OrderHealthAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.orderHealth(params),
    queryFn: ({ signal }) => getOrderHealthAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
