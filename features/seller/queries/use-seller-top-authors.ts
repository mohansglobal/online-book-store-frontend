// Query hook for fetching seller top authors by sales volume
import { useQuery } from "@tanstack/react-query";
import { getTopAuthorsAnalytics } from "../api/seller.api";
import { sellerKeys } from "./seller.keys";
import type { TopAuthorsAnalyticsParams } from "../types/seller.types";

export function useSellerTopAuthors(
  params?: TopAuthorsAnalyticsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sellerKeys.topAuthors(params),
    queryFn: ({ signal }) => getTopAuthorsAnalytics(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}
