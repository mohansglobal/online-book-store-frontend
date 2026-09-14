// TanStack Query hook for fetching user wishlist
import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../api/wishlist.api";
import { wishlistKeys } from "./wishlist.keys";
import type { WishlistResponse } from "../types/wishlist.types";
import type { ApiClientError } from "@/lib/api";

export function useWishlistQuery(enabled = true) {
  return useQuery<WishlistResponse, ApiClientError>({
    queryKey: wishlistKeys.current(),
    queryFn: getWishlist,
    enabled,
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}
