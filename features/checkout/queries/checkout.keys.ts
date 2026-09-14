// TanStack Query cache key factory for checkout
import type { CheckoutSummaryQueryParams } from "../types/checkout.types";

export const checkoutKeys = {
  all: ["checkout"] as const,
  summaries: () => [...checkoutKeys.all, "summary"] as const,
  summary: (params?: CheckoutSummaryQueryParams) =>
    [...checkoutKeys.summaries(), params || {}] as const,
};
