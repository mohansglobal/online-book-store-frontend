import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../api/orders.api";
import { orderKeys } from "./order.keys";

export function useOrderDetailQuery(
  orderId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: ({ signal }) => getOrderById(orderId, { signal }),
    enabled: (options?.enabled ?? true) && Boolean(orderId),
    staleTime: 30 * 1000,
  });
}
