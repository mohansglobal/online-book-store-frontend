// TanStack Query hook for fetching user wishlisted book IDs
import { useQuery } from "@tanstack/react-query";
import { getWishlistIds } from "../api/wishlist.api";
import { wishlistKeys } from "./wishlist.keys";
import type { WishlistIdsResponse } from "../types/wishlist.types";
import type { ApiClientError } from "@/lib/api";

export function useWishlistIdsQuery(enabled = true) {
  return useQuery<WishlistIdsResponse, ApiClientError, Set<string>>({
    queryKey: wishlistKeys.ids(),
    queryFn: getWishlistIds,
    enabled,
    staleTime: 60 * 1000,
    select: (res) => new Set<string>(res.data || []),
    retry: (failureCount, error) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}
