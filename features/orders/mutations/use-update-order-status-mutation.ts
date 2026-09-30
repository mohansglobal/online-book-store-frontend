"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError } from "@/lib/api";
import { sellerKeys } from "@/features/seller/queries/seller.keys";
import { updateOrderStatus } from "../api/orders.api";
import { orderKeys } from "../queries/order.keys";
import type { UpdateOrderStatusParams } from "../types/order.types";

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: UpdateOrderStatusParams) =>
      updateOrderStatus(orderId, payload),

    onSuccess: (response, variables) => {
      const message = response?.message || "Order status updated successfully";
      toast.success(message);

      // Invalidate seller queries (dashboard, recent orders, and all orders)
      queryClient.invalidateQueries({
        queryKey: sellerKeys.all,
      });

      // Invalidate general orders list cache
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });

      // Invalidate specific order detail cache
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },

    onError: (error: unknown) => {
      const apiError = normalizeApiError(
        error,
        "Failed to update order status. Please verify permissions.",
      );
      toast.error(apiError.message);
    },
  });
}
