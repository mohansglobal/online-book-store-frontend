// TanStack Query cache key factory for orders
import type { OrdersQueryParams } from "../types/order.types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: OrdersQueryParams) =>
    [...orderKeys.lists(), params || {}] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};
