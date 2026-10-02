// Query hook for fetching seller orders list with filtering and pagination
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

// Infinite query hook for seller orders list with auto-paginated scroll
export function useInfiniteSellerOrders(
  params?: Omit<SellerOrdersQueryParams, "page">,
  options?: { enabled?: boolean },
) {
  const queryParams: SellerOrdersQueryParams = {
    limit: 20,
    ...params,
  };

  return useInfiniteQuery({
    queryKey: sellerKeys.infiniteOrders(queryParams),
    queryFn: ({ pageParam = 1, signal }) =>
      getSellerOrders({ ...queryParams, page: pageParam as number }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return undefined;

      const currentPage = meta.page ?? 1;
      const totalPages = meta.totalPages ?? 1;
      const hasNext = currentPage < totalPages;

      return hasNext ? currentPage + 1 : undefined;
    },
    enabled: options?.enabled ?? true,
    staleTime: 10 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}

