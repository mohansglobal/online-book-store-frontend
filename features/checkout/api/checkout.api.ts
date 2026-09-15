// Checkout API client functions
import { apiClient } from "@/lib/api";
import type {
  CheckoutSummaryQueryParams,
  CheckoutSummaryResponse,
} from "../types/checkout.types";

/**
 * Fetch authoritative server-computed checkout summary.
 * GET /api/v1/checkout/summary
 */
export async function getCheckoutSummary(
  params?: CheckoutSummaryQueryParams,
  options?: { signal?: AbortSignal },
): Promise<CheckoutSummaryResponse> {
  return apiClient.get<CheckoutSummaryResponse>("/checkout/summary", {
    params: params as Record<string, string | number | undefined>,
    signal: options?.signal,
  });
}
