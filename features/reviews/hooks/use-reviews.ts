// React TanStack Query hooks for reviews
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { checkReviewEligibility, createReview, getBookReviews } from "../api/reviews.api";
import { reviewKeys } from "../queries/review.keys";
import { bookKeys } from "@/features/books/queries/book.keys";
import type {
  CreateReviewInput,
  CreateReviewResponse,
  Review,
  ReviewEligibilityResponse,
} from "../types/review.types";
import type { ApiClientError } from "@/lib/api";

/**
 * Helper to normalize reviews from API responses
 */
export function extractReviewsList(data: unknown): Review[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) {
    if ("reviews" in data && Array.isArray((data as { reviews: unknown }).reviews)) {
      return (data as { reviews: Review[] }).reviews;
    }
  }
  return [];
}

/**
 * Hook to fetch reviews for a specific book
 */
export function useBookReviews(bookId: string) {
  return useQuery({
    queryKey: reviewKeys.book(bookId),
    queryFn: ({ signal }) => getBookReviews(bookId, { signal }),
    enabled: Boolean(bookId),
  });
}

/**
 * Hook to check if current user is eligible to review a book
 */
export function useReviewEligibility(
  bookId: string,
  params?: { sellerId?: string; enabled?: boolean },
) {
  const sellerId = params?.sellerId;
  const isExplicitlyDisabled = params?.enabled === false;

  return useQuery({
    queryKey: reviewKeys.eligibility(bookId, sellerId),
    queryFn: ({ signal }) => checkReviewEligibility(bookId, { sellerId }, { signal }),
    enabled: Boolean(bookId) && !isExplicitlyDisabled,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to submit a review for a book
 */
export function useCreateReviewMutation(
  options?: Omit<
    UseMutationOptions<CreateReviewResponse, ApiClientError, CreateReviewInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (...args) => {
      const [, variables] = args;
      // Invalidate book reviews list
      queryClient.invalidateQueries({
        queryKey: reviewKeys.book(variables.bookId),
      });

      // Invalidate eligibility
      queryClient.invalidateQueries({
        queryKey: reviewKeys.eligibilities(),
      });

      // Invalidate book details so refreshed overall rating displays
      queryClient.invalidateQueries({
        queryKey: bookKeys.detail(variables.bookId),
      });

      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

