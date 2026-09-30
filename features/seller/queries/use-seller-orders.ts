// Query hook for fetching seller orders list with filtering and pagination
import { useQuery } from "@tanstack/react-query";
import { getSellerOrders } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { SellerOrdersQueryParams } from "../types/seller.types";

export function useSellerOrders(
  params?: SellerOrdersQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.orders(params),
    queryFn: ({ signal }) => getSellerOrders(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 10 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}
