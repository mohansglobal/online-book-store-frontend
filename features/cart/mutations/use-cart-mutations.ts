// TanStack Query mutations for Cart server modifications with optimistic updates
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  removeCartItem,
  syncCart,
  updateCartItem,
} from "../api/cart.api";
import { cartKeys } from "../queries/cart.keys";
import {
  createEmptyCartData,
  recalculateCartDataWithAddedItem,
  recalculateCartDataWithRemovedItem,
  recalculateCartDataWithUpdatedQuantity,
} from "../utils/cart-recalculate";
import type {
  AddToCartInput,
  CartResponse,
  SyncCartInput,
  UpdateCartItemInput,
} from "../types/cart.types";
import type { ApiClientError } from "@/lib/api";

type CartMutationContext = {
  previousCart?: CartResponse;
};

export function useSyncCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CartResponse,
    ApiClientError,
    SyncCartInput,
    CartMutationContext
  >({
    mutationFn: syncCart,
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CartResponse,
    ApiClientError,
    AddToCartInput,
    CartMutationContext
  >({
    mutationFn: addToCart,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.current(),
      );

      if (previousCart?.data) {
        const updatedData = recalculateCartDataWithAddedItem(
          previousCart.data,
          variables,
        );
        queryClient.setQueryData<CartResponse>(cartKeys.current(), {
          ...previousCart,
          data: updatedData,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CartResponse,
    ApiClientError,
    UpdateCartItemInput,
    CartMutationContext
  >({
    mutationFn: updateCartItem,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.current(),
      );

      if (previousCart?.data) {
        const updatedData = recalculateCartDataWithUpdatedQuantity(
          previousCart.data,
          variables.bookListingId,
          variables.quantity,
        );

        queryClient.setQueryData<CartResponse>(cartKeys.current(), {
          ...previousCart,
          data: updatedData,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CartResponse,
    ApiClientError,
    string,
    CartMutationContext
  >({
    mutationFn: removeCartItem,
    onMutate: async (bookListingId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.current(),
      );

      if (previousCart?.data) {
        const updatedData = recalculateCartDataWithRemovedItem(
          previousCart.data,
          bookListingId,
        );

        queryClient.setQueryData<CartResponse>(cartKeys.current(), {
          ...previousCart,
          data: updatedData,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiClientError, void, CartMutationContext>({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartResponse>(
        cartKeys.current(),
      );

      if (previousCart?.data) {
        const updatedData = createEmptyCartData(previousCart.data);

        queryClient.setQueryData<CartResponse>(cartKeys.current(), {
          ...previousCart,
          data: updatedData,
        });
      }

      return { previousCart };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.current(), context.previousCart);
      }
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.current(), res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
