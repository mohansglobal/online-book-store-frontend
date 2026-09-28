// TanStack Query mutations for Wishlist server modifications
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  clearWishlist,
  removeFromWishlist,
  syncWishlist,
} from "../api/wishlist.api";
import { wishlistKeys } from "../queries/wishlist.keys";
import type {
  AddWishlistApiInput,
  SyncWishlistInput,
  WishlistIdsResponse,
  WishlistResponse,
} from "../types/wishlist.types";
import type { ApiClientError } from "@/lib/api";

type WishlistMutationContext = {
  previousWishlist?: WishlistResponse;
  previousIds?: WishlistIdsResponse;
};

export function useSyncWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    WishlistResponse,
    ApiClientError,
    SyncWishlistInput,
    WishlistMutationContext
  >({
    mutationFn: syncWishlist,
    onSuccess: (res) => {
      queryClient.setQueryData(wishlistKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    WishlistResponse,
    ApiClientError,
    AddWishlistApiInput,
    WishlistMutationContext
  >({
    mutationFn: addToWishlist,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.ids() });
      const previousIds = queryClient.getQueryData<WishlistIdsResponse>(wishlistKeys.ids());
      const bookId = input.bookId || input.id || input.listingId;
      const listingId = input.listingId;
      const toAdd = [bookId, listingId].filter(Boolean) as string[];

      if (previousIds && toAdd.length > 0) {
        queryClient.setQueryData<WishlistIdsResponse>(wishlistKeys.ids(), {
          ...previousIds,
          data: Array.from(new Set([...(previousIds.data || []), ...toAdd])),
        });
      }
      return { previousIds };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(wishlistKeys.ids(), context.previousIds);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(wishlistKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    WishlistResponse,
    ApiClientError,
    string | { bookId: string; listingId?: string },
    WishlistMutationContext
  >({
    mutationFn: (param) => {
      const bookId = typeof param === "string" ? param : param.bookId;
      return removeFromWishlist(bookId);
    },
    onMutate: async (param) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.ids() });
      const previousIds = queryClient.getQueryData<WishlistIdsResponse>(wishlistKeys.ids());
      const bookId = typeof param === "string" ? param : param.bookId;
      const listingId = typeof param === "object" ? param.listingId : undefined;

      if (previousIds && bookId) {
        queryClient.setQueryData<WishlistIdsResponse>(wishlistKeys.ids(), {
          ...previousIds,
          data: (previousIds.data || []).filter(
            (id) => id !== bookId && (!listingId || id !== listingId),
          ),
        });
      }
      return { previousIds };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(wishlistKeys.ids(), context.previousIds);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(wishlistKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useClearWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    WishlistResponse,
    ApiClientError,
    void,
    WishlistMutationContext
  >({
    mutationFn: clearWishlist,
    onSuccess: (res) => {
      queryClient.setQueryData(wishlistKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
