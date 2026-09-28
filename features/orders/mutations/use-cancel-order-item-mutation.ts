"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api";
import { cancelOrderItem } from "../api/orders.api";
import { orderKeys } from "../queries/order.keys";
import type { CancelOrderItemInput } from "../types/order.types";

export function useCancelOrderItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, itemId, reason }: CancelOrderItemInput) =>
      cancelOrderItem(orderId, itemId, reason),

    onSuccess: (response) => {
      toast.success(response?.message || "Item cancelled successfully");

      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      if (response?.data?._id) {
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(response.data._id),
        });
      }
    },

    onError: (error: unknown) => {
      const apiError = normalizeApiError(
        error,
        "Failed to cancel item. Please try again.",
      );
      toast.error(apiError.message);
    },
  });
}
