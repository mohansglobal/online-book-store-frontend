// Query hook for fetching seller recent orders feed
import { useQuery } from "@tanstack/react-query";
import { getSellerRecentOrders } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { SellerRecentOrdersParams } from "../types/seller.types";

export function useSellerRecentOrders(
  params?: SellerRecentOrdersParams,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: sellerKeys.recentOrders(params),
    queryFn: ({ signal }) => getSellerRecentOrders(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: options?.refetchInterval ?? 15 * 1000,
  });
}

