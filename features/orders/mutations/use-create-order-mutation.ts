// Mutation hook for placing orders via POST /api/v1/orders
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrder } from "../api/orders.api";
import { orderKeys } from "../queries/order.keys";
import { cartKeys } from "@/features/cart";
import { checkoutKeys } from "@/features/checkout";
import type { CreateOrderInput } from "../types/order.types";

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderInput) => createOrder(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: checkoutKeys.all });
      toast.success(res.message || "Order placed successfully!");
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string })?.message ||
        "Failed to place order. Please try again.";
      toast.error(message);
    },
  });
}
