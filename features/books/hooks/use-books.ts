// React TanStack Query hook for books
"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooks, getBookByIdOrSlug, lookupBookByIsbn } from "../api/books.api";
import { bookKeys } from "../queries/book.keys";
import type { GetBooksParams } from "../types/book.types";

/**
 * Hook to fetch paginated/filtered books
 */
export function useBooks(params?: GetBooksParams) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: ({ signal }) => getBooks(params, { signal }),
  });
}

/**
 * Hook to fetch a single book by ID or slug
 */
export function useBook(identifier: string) {
  return useQuery({
    queryKey: bookKeys.detail(identifier),
    queryFn: ({ signal }) => getBookByIdOrSlug(identifier, { signal }),
    enabled: Boolean(identifier),
  });
}

/**
 * Hook to lookup canonical book by ISBN
 */
export function useIsbnLookup(isbn: string, enabled = true) {
  const cleanIsbn = isbn.trim();
  return useQuery({
    queryKey: bookKeys.isbnLookup(cleanIsbn),
    queryFn: ({ signal }) => lookupBookByIsbn(cleanIsbn, { signal }),
    enabled: enabled && cleanIsbn.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}
