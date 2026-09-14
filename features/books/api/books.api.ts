// Book and Listing API endpoint functions
import { apiClient } from "@/lib/api";
import {
  normalizeListingToApiBook,
  type BooksResponse,
  type GetBooksParams,
  type SingleBookResponse,
} from "../types/book.types";

/**
 * Fetches listings/books from /api/v1/listings
 */
export async function getBooks(
  params?: GetBooksParams,
  options?: { signal?: AbortSignal },
): Promise<BooksResponse> {
  const response = await apiClient.get<BooksResponse>("/listings", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });

  return {
    ...response,
    data: Array.isArray(response?.data)
      ? response.data.map(normalizeListingToApiBook)
      : [],
  };
}

/**
 * Fetches a single listing/book by id from /api/v1/listings/:identifier
 */
export async function getBookByIdOrSlug(
  identifier: string,
  options?: { signal?: AbortSignal },
): Promise<SingleBookResponse> {
  const response = await apiClient.get<SingleBookResponse>(
    `/listings/${encodeURIComponent(identifier)}`,
    {
      signal: options?.signal,
    },
  );

  return {
    ...response,
    data: response?.data ? normalizeListingToApiBook(response.data) : response?.data,
  };
}
