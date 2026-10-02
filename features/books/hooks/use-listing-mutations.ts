// React TanStack Query hooks for seller listings and mutation operations
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  applyBulkDiscount,
  applyListingDiscount,
  getMyBookListings,
  removeBulkDiscount,
  removeListingDiscount,
  toggleListingStatus,
  updateListingStock,
  updateSellerListing,
} from "../api/books.api";
import { bookKeys } from "../queries/book.keys";
import type {
  ApplyListingDiscountInput,
  ApplyListingDiscountResponse,
  BulkApplyDiscountInput,
  BulkApplyDiscountResponse,
  BulkRemoveDiscountInput,
  BulkRemoveDiscountResponse,
  GetSellerListingsParams,
  RemoveListingDiscountResponse,
  SellerListingsResponse,
  ToggleListingStatusInput,
  ToggleListingStatusResponse,
  UpdateListingInput,
  UpdateListingResponse,
  UpdateStockInput,
  UpdateStockResponse,
} from "../types/listing.types";
import type { ApiClientError } from "@/lib/api";

type MutationContext = {
  previousSnapshots: [readonly unknown[], SellerListingsResponse | undefined][];
};

// Hook to fetch seller's own listings
export function useMyBookListings(params?: GetSellerListingsParams) {
  return useQuery({
    queryKey: bookKeys.myListings(params),
    queryFn: ({ signal }) => getMyBookListings(params, { signal }),
  });
}

// Hook to update a listing's stock with optimistic updates and detail cache invalidation
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
      await queryClient.cancelQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      const previousSnapshots = queryClient.getQueriesData<SellerListingsResponse>({
        queryKey: bookKeys.myListingsAll(),
      });

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

      if (context?.previousSnapshots) {
        for (const [queryKey, data] of context.previousSnapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
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
      await queryClient.cancelQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      const previousSnapshots = queryClient.getQueriesData<SellerListingsResponse>({
        queryKey: bookKeys.myListingsAll(),
      });

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

      if (context?.previousSnapshots) {
        for (const [queryKey, data] of context.previousSnapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });

      options?.onSettled?.(...args);
    },

    ...options,
  });
}

// Hook to apply discount to a listing with optimistic updates
export function useApplyListingDiscountMutation(
  options?: Omit<
    UseMutationOptions<
      ApplyListingDiscountResponse,
      ApiClientError,
      ApplyListingDiscountInput,
      MutationContext
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApplyListingDiscountResponse,
    ApiClientError,
    ApplyListingDiscountInput,
    MutationContext
  >({
    mutationFn: (input: ApplyListingDiscountInput) => applyListingDiscount(input),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      const previousSnapshots = queryClient.getQueriesData<SellerListingsResponse>({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.setQueriesData<SellerListingsResponse>(
        { queryKey: bookKeys.myListingsAll() },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;

          const updatedData = old.data.map((item) => {
            if (item._id !== variables.listingId) return item;

            const existingMrp = item.mrpInPaise ?? 0;

            const updatedMrp = variables.mrpInPaise ?? (variables.mrp ? variables.mrp * 100 : existingMrp);

            let calculatedSellingPriceInPaise = updatedMrp;

            if (variables.discountType === "PERCENTAGE") {
              const discountFraction = variables.discountValue / 100;

              const discountInPaise = Math.round(updatedMrp * discountFraction);

              calculatedSellingPriceInPaise = Math.max(0, updatedMrp - discountInPaise);
            } else if (variables.discountType === "FLAT") {
              const flatDiscountInPaise = variables.discountValue * 100;

              calculatedSellingPriceInPaise = Math.max(0, updatedMrp - flatDiscountInPaise);
            }

            return {
              ...item,
              mrpInPaise: updatedMrp,
              sellingPriceInPaise: calculatedSellingPriceInPaise,
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

      if (context?.previousSnapshots) {
        for (const [queryKey, data] of context.previousSnapshots) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      options?.onError?.(...args);
    },

    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });

      options?.onSettled?.(...args);
    },

    ...options,
  });
}

// Hook to remove discount from a single listing via DELETE /api/v1/listings/:id/discount
export function useRemoveListingDiscountMutation(
  options?: Omit<
    UseMutationOptions<RemoveListingDiscountResponse, ApiClientError, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<RemoveListingDiscountResponse, ApiClientError, string>({
    mutationFn: (listingId: string) => removeListingDiscount(listingId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });
    },

    ...options,
  });
}

// Hook to apply scheduled or instant discounts in bulk via POST /api/v1/listings/discounts/bulk
export function useApplyBulkDiscountMutation(
  options?: Omit<
    UseMutationOptions<
      BulkApplyDiscountResponse,
      ApiClientError,
      BulkApplyDiscountInput
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    BulkApplyDiscountResponse,
    ApiClientError,
    BulkApplyDiscountInput
  >({
    mutationFn: (input: BulkApplyDiscountInput) => applyBulkDiscount(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });
    },

    ...options,
  });
}

// Hook to remove discounts in bulk via DELETE /api/v1/listings/discounts/bulk
export function useRemoveBulkDiscountMutation(
  options?: Omit<
    UseMutationOptions<
      BulkRemoveDiscountResponse,
      ApiClientError,
      BulkRemoveDiscountInput
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    BulkRemoveDiscountResponse,
    ApiClientError,
    BulkRemoveDiscountInput
  >({
    mutationFn: (input: BulkRemoveDiscountInput) => removeBulkDiscount(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });
    },

    ...options,
  });
}

// Hook to update listing and/or book catalog details via PATCH /api/v1/listings/:id
export function useUpdateListingMutation(
  options?: Omit<
    UseMutationOptions<UpdateListingResponse, ApiClientError, UpdateListingInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<UpdateListingResponse, ApiClientError, UpdateListingInput>({
    mutationFn: (input: UpdateListingInput) => updateSellerListing(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookKeys.myListingsAll(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bookKeys.details(),
      });
    },

    ...options,
  });
}
