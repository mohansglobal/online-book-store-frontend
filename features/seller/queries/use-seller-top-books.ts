import { useQuery } from "@tanstack/react-query";
import { getTopSellingBooksAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { TopSellingBooksParams } from "../types/seller.types";

export function useSellerTopBooks(
  params?: TopSellingBooksParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.topBooks(params),
    queryFn: ({ signal }) => getTopSellingBooksAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}
