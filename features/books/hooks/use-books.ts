// React TanStack Query hooks for books and listings
"use client";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createBookListing,
  getBookByIdOrSlug,
  getBooks,
  lookupBookByIsbn,
} from "../api/books.api";
import { bookKeys } from "../queries/book.keys";
import type {
  CreateBookListingInput,
  GetBooksParams,
} from "../types/book.types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { CreateBookListingResponse } from "../types/book.types";
import type { ApiClientError } from "@/lib/api";

// Re-export seller listing and discount mutation hooks
export * from "./use-listing-mutations";

// Hook to fetch paginated/filtered books
export function useBooks(params?: GetBooksParams) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: ({ signal }) => getBooks(params, { signal }),
  });
}

// Hook to fetch a single book by ID or slug with instant fresh refetching
export function useBook(identifier: string) {
  return useQuery({
    queryKey: bookKeys.detail(identifier),
    queryFn: ({ signal }) => getBookByIdOrSlug(identifier, { signal }),
    enabled: Boolean(identifier),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

// Hook to lookup canonical book by ISBN
export function useIsbnLookup(isbn: string, enabled = true) {
  const cleanIsbn = isbn.trim();

  return useQuery({
    queryKey: bookKeys.isbnLookup(cleanIsbn),
    queryFn: ({ signal }) => lookupBookByIsbn(cleanIsbn, { signal }),
    enabled: enabled && cleanIsbn.length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to create a new seller book listing
export function useCreateBookListingMutation(
  options?: Omit<
    UseMutationOptions<CreateBookListingResponse, ApiClientError, CreateBookListingInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookListingInput) => createBookListing(input),

    onSuccess: (...args) => {
      const [, variables] = args;

      // Invalidate book listings and details caches
      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });

      // Invalidate specific ISBN lookup if provided
      if (variables.isbn) {
        const cleanIsbn = variables.isbn.trim();

        queryClient.invalidateQueries({
          queryKey: bookKeys.isbnLookup(cleanIsbn),
        });
      }

      options?.onSuccess?.(...args);
    },

    ...options,
  });
}
