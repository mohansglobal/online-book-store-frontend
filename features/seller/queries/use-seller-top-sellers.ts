// Query hook for fetching admin top sellers by sold volume
import { useQuery } from "@tanstack/react-query";
import { getTopSellersAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { TopSellersAnalyticsParams } from "../types/seller.types";

export function useSellerTopSellers(
  params?: TopSellersAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.topSellers(params),
    queryFn: ({ signal }) => getTopSellersAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}
