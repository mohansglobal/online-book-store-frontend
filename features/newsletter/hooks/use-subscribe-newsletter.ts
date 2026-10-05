// React TanStack Query mutation hook for subscribing to newsletter updates

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { subscribeToNewsletter } from "../api/newsletter.api";

import { newsletterKeys } from "../queries/newsletter.keys";

import type {
  SubscribeNewsletterInput,
  SubscribeNewsletterResponse,
} from "../types/newsletter.types";

export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation<SubscribeNewsletterResponse, Error, SubscribeNewsletterInput>({
    mutationFn: (input: SubscribeNewsletterInput) => subscribeToNewsletter(input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
    },
  });
}
