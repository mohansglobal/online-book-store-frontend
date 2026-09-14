// Query hook for fetching user orders
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders.api";
import { orderKeys } from "./order.keys";
import type { OrdersQueryParams } from "../types/order.types";

export function useOrdersQuery(
  params?: OrdersQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: ({ signal }) => getOrders(params, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
}
