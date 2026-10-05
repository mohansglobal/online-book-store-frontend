// React TanStack Query hook for fetching newsletter subscribers list (Admin)

"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubscribers } from "../api/newsletter.api";

import { newsletterKeys } from "../queries/newsletter.keys";

import type {
  GetSubscribersParams,
  GetSubscribersResponse,
} from "../types/newsletter.types";

export function useNewsletterSubscribers(
  params?: GetSubscribersParams,
  options?: { enabled?: boolean },
) {
  return useQuery<GetSubscribersResponse, Error>({
    queryKey: newsletterKeys.subscribers(params),

    queryFn: ({ signal }) => getSubscribers(params, { signal }),

    enabled: options?.enabled ?? true,
  });
}
