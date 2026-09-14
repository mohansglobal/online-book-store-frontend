"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api";
import { cancelOrder } from "../api/orders.api";
import { orderKeys } from "../queries/order.keys";

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason?: string;
    }) => cancelOrder(orderId, reason),
    onSuccess: (response) => {
      toast.success(response?.message || "Order cancelled successfully");
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
        "Failed to cancel order. Please try again.",
      );
      toast.error(apiError.message);
    },
  });
}
