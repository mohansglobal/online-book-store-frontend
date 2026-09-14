// TanStack Query cache key factory for address entities
import type { AddressType } from "../types/address.types";

export const addressKeys = {
  all: ["addresses"] as const,
  lists: () => [...addressKeys.all, "list"] as const,
  list: (type?: AddressType) =>
    [...addressKeys.lists(), { type: type || "ALL" }] as const,
  default: (type?: AddressType) =>
    [...addressKeys.all, "default", { type: type || "ALL" }] as const,
  details: () => [...addressKeys.all, "detail"] as const,
  detail: (id: string) => [...addressKeys.details(), id] as const,
};
