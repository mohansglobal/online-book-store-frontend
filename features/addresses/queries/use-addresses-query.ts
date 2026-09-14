// Query hooks for fetching saved addresses
import { useQuery } from "@tanstack/react-query";
import {
  getAddressById,
  getAddresses,
  getDefaultAddress,
} from "../api/addresses.api";
import { addressKeys } from "./address.keys";
import type { AddressType } from "../types/address.types";

export function useAddressesQuery(
  addressType?: AddressType,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: addressKeys.list(addressType),
    queryFn: ({ signal }) => getAddresses(addressType, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}

export function useDefaultAddressQuery(
  addressType?: AddressType,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: addressKeys.default(addressType),
    queryFn: ({ signal }) => getDefaultAddress(addressType, { signal }),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });
}

export function useAddressDetailQuery(id?: string) {
  return useQuery({
    queryKey: addressKeys.detail(id || ""),
    queryFn: ({ signal }) => getAddressById(id || "", { signal }),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}
