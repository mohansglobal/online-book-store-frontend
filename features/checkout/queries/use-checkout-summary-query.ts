// TanStack Query hook for checkout summary
import { useQuery } from "@tanstack/react-query";
import { getCheckoutSummary } from "../api/checkout.api";
import { checkoutKeys } from "./checkout.keys";
import type { CheckoutSummaryQueryParams } from "../types/checkout.types";

export function useCheckoutSummaryQuery(
  params?: CheckoutSummaryQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: checkoutKeys.summary(params),
    queryFn: ({ signal }) => getCheckoutSummary(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 15 * 1000, // 15 seconds
  });
}
