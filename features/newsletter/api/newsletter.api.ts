// Newsletter API endpoint functions interacting with Express backend

import { apiClient } from "@/lib/api";

import type {
  GetSubscribersParams,
  GetSubscribersResponse,
  SubscribeNewsletterInput,
  SubscribeNewsletterResponse,
  UnsubscribeNewsletterInput,
  UnsubscribeNewsletterResponse,
} from "../types/newsletter.types";

// Subscribes a new email or updates preferences for existing subscriber via POST /api/v1/newsletter/subscribe
export async function subscribeToNewsletter(
  input: SubscribeNewsletterInput,
  options?: { signal?: AbortSignal },
): Promise<SubscribeNewsletterResponse> {
  const payload: SubscribeNewsletterInput = {
    email: input.email,
    source: input.source ?? "footer",
    preferences: input.preferences,
  };

  return apiClient.post<SubscribeNewsletterResponse>("/newsletter/subscribe", payload, {
    signal: options?.signal,
  });
}

// Unsubscribes an email from newsletter updates via POST /api/v1/newsletter/unsubscribe
export async function unsubscribeFromNewsletter(
  input: UnsubscribeNewsletterInput,
  options?: { signal?: AbortSignal },
): Promise<UnsubscribeNewsletterResponse> {
  return apiClient.post<UnsubscribeNewsletterResponse>("/newsletter/unsubscribe", input, {
    signal: options?.signal,
  });
}

// Fetches paginated subscribers list (Admin only) via GET /api/v1/newsletter/subscribers
export async function getSubscribers(
  params?: GetSubscribersParams,
  options?: { signal?: AbortSignal },
): Promise<GetSubscribersResponse> {
  return apiClient.get<GetSubscribersResponse>("/newsletter/subscribers", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}
