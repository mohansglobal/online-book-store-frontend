// Query hook for fetching seller category / genre breakdown analytics
import { useQuery } from "@tanstack/react-query";
import { getCategoryBreakdownAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { CategoryBreakdownAnalyticsParams } from "../types/seller.types";

export function useSellerCategoryBreakdown(
  params?: CategoryBreakdownAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.categoryBreakdown(params),
    queryFn: ({ signal }) => getCategoryBreakdownAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}
