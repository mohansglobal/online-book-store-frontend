// TanStack Query hook for fetching user cart

import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/cart.api";
import { cartKeys } from "./cart.keys";
import type { CartResponse } from "../types/cart.types";
import type { ApiClientError } from "@/lib/api";

export function useCartQuery(enabled = true) {
  return useQuery<CartResponse, ApiClientError>({
    queryKey: cartKeys.current(),
    queryFn: getCart,
    enabled,
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      // Do not retry on 401 unauthenticated
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
  });
}
