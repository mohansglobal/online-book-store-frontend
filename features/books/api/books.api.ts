// Book API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  BooksResponse,
  GetBooksParams,
  SingleBookResponse,
} from "../types/book.types";

/**
 * Fetches books from /api/v1/books
 */
export async function getBooks(
  params?: GetBooksParams,
  options?: { signal?: AbortSignal },
): Promise<BooksResponse> {
  return apiClient.get<BooksResponse>("/books", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}

/**
 * Fetches a single book by slug or id from /api/v1/books/:identifier
 */
export async function getBookByIdOrSlug(
  identifier: string,
  options?: { signal?: AbortSignal },
): Promise<SingleBookResponse> {
  return apiClient.get<SingleBookResponse>(`/books/${encodeURIComponent(identifier)}`, {
    signal: options?.signal,
  });
}
