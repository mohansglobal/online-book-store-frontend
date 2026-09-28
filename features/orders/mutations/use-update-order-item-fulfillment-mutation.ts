"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api";
import { updateOrderItemFulfillment } from "../api/orders.api";
import { orderKeys } from "../queries/order.keys";
import type { UpdateOrderItemFulfillmentParams } from "../types/order.types";

export function useUpdateOrderItemFulfillmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, itemId, payload }: UpdateOrderItemFulfillmentParams) =>
      updateOrderItemFulfillment(orderId, itemId, payload),

    onSuccess: (response) => {
      toast.success(
        response?.message || "Item fulfillment updated successfully",
      );

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
        "Failed to update item fulfillment. Please verify your seller permissions.",
      );
      toast.error(apiError.message);
    },
  });
}
