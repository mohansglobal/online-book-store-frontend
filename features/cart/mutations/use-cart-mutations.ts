// TanStack Query mutations for Cart server modifications

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart.api";
import { cartKeys } from "../queries/cart.keys";
import type {
  AddToCartInput,
  CartResponse,
  MergeCartInput,
  UpdateCartItemInput,
} from "../types/cart.types";
import type { ApiClientError } from "@/lib/api";

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, AddToCartInput>({
    mutationFn: addToCart,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, UpdateCartItemInput>({
    mutationFn: updateCartItem,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, string>({
    mutationFn: removeCartItem,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, void>({
    mutationFn: clearCart,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useMergeCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, MergeCartInput>({
    mutationFn: mergeCart,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
