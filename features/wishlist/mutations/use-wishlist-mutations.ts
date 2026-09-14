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
  WishlistResponse,
} from "../types/wishlist.types";
import type { ApiClientError } from "@/lib/api";

type WishlistMutationContext = {
  previousWishlist?: WishlistResponse;
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
    string,
    WishlistMutationContext
  >({
    mutationFn: removeFromWishlist,
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
