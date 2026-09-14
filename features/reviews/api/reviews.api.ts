// Reviews API service
import { apiClient } from "@/lib/api";
import type {
  BookReviewsResponse,
  CreateReviewInput,
  CreateReviewResponse,
  ReviewEligibilityResponse,
} from "../types/review.types";

/**
 * Submit a new customer review for a book
 */
export async function createReview(
  input: CreateReviewInput,
): Promise<CreateReviewResponse> {
  const hasFileAttachments =
    Array.isArray(input.images) &&
    input.images.some((img) => typeof File !== "undefined" && img instanceof File);

  if (hasFileAttachments) {
    const formData = new FormData();
    formData.append("bookId", input.bookId);

    if (input.sellerId) {
      formData.append("sellerId", input.sellerId);
    }

    formData.append("rating", String(input.rating));

    if (input.title?.trim()) {
      formData.append("title", input.title.trim());
    }

    formData.append("review", input.review.trim());

    if (Array.isArray(input.images)) {
      input.images.forEach((img) => {
        if (typeof File !== "undefined" && img instanceof File) {
          formData.append("images", img);
        }
      });
    }

    return apiClient.post<CreateReviewResponse>("/reviews", undefined, {
      body: formData,
    });
  }

  // JSON payload
  const payload: Record<string, unknown> = {
    bookId: input.bookId,
    rating: input.rating,
    review: input.review.trim(),
  };

  if (input.sellerId) {
    payload.sellerId = input.sellerId;
  }

  if (input.title?.trim()) {
    payload.title = input.title.trim();
  }

  if (Array.isArray(input.images) && input.images.length > 0) {
    payload.images = input.images.filter((img) => typeof img === "string");
  }

  return apiClient.post<CreateReviewResponse>("/reviews", payload);
}

/**
 * Fetch reviews for a specific book
 */
export async function getBookReviews(
  bookId: string,
  options?: { signal?: AbortSignal },
): Promise<BookReviewsResponse> {
  return apiClient.get<BookReviewsResponse>(
    `/reviews?bookId=${encodeURIComponent(bookId)}`,
    {
      signal: options?.signal,
    },
  );
}

/**
 * Check customer review eligibility for a specific book
 */
export async function checkReviewEligibility(
  bookId: string,
  params?: { sellerId?: string },
  options?: { signal?: AbortSignal },
): Promise<ReviewEligibilityResponse> {
  const queryParams: Record<string, string> = { bookId };
  if (params?.sellerId) {
    queryParams.sellerId = params.sellerId;
  }
  return apiClient.get<ReviewEligibilityResponse>(
    "/reviews/check-eligibility",
    {
      params: queryParams,
      signal: options?.signal,
    },
  );
}


