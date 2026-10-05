// React TanStack Query mutation hook for unsubscribing from newsletter updates

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unsubscribeFromNewsletter } from "../api/newsletter.api";

import { newsletterKeys } from "../queries/newsletter.keys";

import type {
  UnsubscribeNewsletterInput,
  UnsubscribeNewsletterResponse,
} from "../types/newsletter.types";

export function useUnsubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation<UnsubscribeNewsletterResponse, Error, UnsubscribeNewsletterInput>({
    mutationFn: (input: UnsubscribeNewsletterInput) => unsubscribeFromNewsletter(input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
    },
  });
}
