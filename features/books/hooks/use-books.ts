// React TanStack Query hooks for books and listings
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  createBookListing,
  getBookByIdOrSlug,
  getBooks,
  getMyBookListings,
  lookupBookByIsbn,
  toggleListingStatus,
  updateListingStock,
} from "../api/books.api";
import { bookKeys } from "../queries/book.keys";
import type {
  CreateBookListingInput,
  CreateBookListingResponse,
  GetBooksParams,
} from "../types/book.types";
import type {
  GetSellerListingsParams,
  SellerListingsResponse,
  ToggleListingStatusInput,
  ToggleListingStatusResponse,
  UpdateStockInput,
  UpdateStockResponse,
} from "../types/listing.types";
import type { ApiClientError } from "@/lib/api";

// Hook to fetch paginated/filtered books
export function useBooks(params?: GetBooksParams) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: ({ signal }) => getBooks(params, { signal }),
  });
}

// Hook to fetch a single book by ID or slug
export function useBook(identifier: string) {
  return useQuery({
    queryKey: bookKeys.detail(identifier),
    queryFn: ({ signal }) => getBookByIdOrSlug(identifier, { signal }),
    enabled: Boolean(identifier),
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

      // Invalidate book listings cache
      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
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

// Hook to fetch seller's own listings
export function useMyBookListings(params?: GetSellerListingsParams) {
  return useQuery({
    queryKey: bookKeys.myListings(params),
    queryFn: ({ signal }) => getMyBookListings(params, { signal }),
  });
}

type MutationContext = {
  previousSnapshots: [readonly unknown[], SellerListingsResponse | undefined][];
};

// Hook to update a listing's stock with optimistic updates
export function useUpdateListingStockMutation(
  options?: Omit<
    UseMutationOptions<UpdateStockResponse, ApiClientError, UpdateStockInput, MutationContext>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<UpdateStockResponse, ApiClientError, UpdateStockInput, MutationContext>({
    mutationFn: (input: UpdateStockInput) => updateListingStock(input),

    onMutate: async (variables) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      // Snapshot previous listings data for rollback
      const previousSnapshots = queryClient.getQueriesData<SellerListingsResponse>({
        queryKey: bookKeys.myListingsAll(),
      });

      // Optimistically update stock across active my-listings queries
      queryClient.setQueriesData<SellerListingsResponse>(
        { queryKey: bookKeys.myListingsAll() },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;

          const updatedData = old.data.map((item) => {
            if (item._id !== variables.listingId) return item;

            const currentStock = item.stock ?? 0;
            let newStock = currentStock;

            if (variables.operation === "increase") {
              newStock = currentStock + variables.quantity;
            } else if (variables.operation === "decrease") {
              newStock = Math.max(0, currentStock - variables.quantity);
            } else if (variables.operation === "set") {
              newStock = variables.quantity;
            }

            return {
              ...item,
              stock: newStock,
            };
          });

          return {
            ...old,
            data: updatedData,
          };
        },
      );

      return { previousSnapshots };
    },

    onError: (...args) => {
      const [, , context] = args;
      // Rollback to previous state on error
      if (context?.previousSnapshots) {
        for (const [queryKey, data] of context.previousSnapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      // Invalidate relevant queries to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      options?.onSettled?.(...args);
    },

    ...options,
  });
}

// Hook to toggle or set a listing's active status with optimistic updates
export function useToggleListingStatusMutation(
  options?: Omit<
    UseMutationOptions<ToggleListingStatusResponse, ApiClientError, ToggleListingStatusInput, MutationContext>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<ToggleListingStatusResponse, ApiClientError, ToggleListingStatusInput, MutationContext>({
    mutationFn: (input: ToggleListingStatusInput) => toggleListingStatus(input),

    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      // Snapshot previous data for rollback
      const previousSnapshots = queryClient.getQueriesData<SellerListingsResponse>({
        queryKey: bookKeys.myListingsAll(),
      });

      // Optimistically update isActive across active my-listings queries
      queryClient.setQueriesData<SellerListingsResponse>(
        { queryKey: bookKeys.myListingsAll() },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;

          const updatedData = old.data.map((item) => {
            if (item._id !== variables.listingId) return item;

            const nextActive =
              variables.isActive !== undefined ? variables.isActive : !item.isActive;

            return {
              ...item,
              isActive: nextActive,
            };
          });

          return {
            ...old,
            data: updatedData,
          };
        },
      );

      return { previousSnapshots };
    },

    onError: (...args) => {
      const [, , context] = args;
      // Rollback on error
      if (context?.previousSnapshots) {
        for (const [queryKey, data] of context.previousSnapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      // Re-sync with backend
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      options?.onSettled?.(...args);
    },

    ...options,
  });
}


