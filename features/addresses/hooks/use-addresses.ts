// Unified hook for managing user addresses in components
"use client";

import { useMemo } from "react";
import { useCurrentUser } from "@/features/auth";
import { useAddressesQuery } from "../queries/use-addresses-query";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from "../mutations/use-address-mutations";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  UpdateAddressInput,
} from "../types/address.types";

export function useAddresses(addressType?: AddressType) {
  const { data: user } = useCurrentUser();
  const isLoggedIn = Boolean(user);

  const {
    data: addressesResponse,
    isLoading: isQueryLoading,
    isFetching,
    refetch,
  } = useAddressesQuery(addressType, { enabled: isLoggedIn });

  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();
  const setDefaultMutation = useSetDefaultAddressMutation();
  const deleteMutation = useDeleteAddressMutation();

  // Stable address sorting by creation time / ID so items never shift positions when default changes
  const addresses: Address[] = useMemo(() => {
    if (Array.isArray(addressesResponse?.data)) {
      return [...addressesResponse.data].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeA - timeB;
        return a._id.localeCompare(b._id);
      });
    }
    return [];
  }, [addressesResponse]);

  const defaultAddress = useMemo(() => {
    return addresses.find((a) => a.isDefault) || addresses[0];
  }, [addresses]);

  const handleCreate = async (payload: CreateAddressInput) => {
    return createMutation.mutateAsync(payload);
  };

  const handleUpdate = async (id: string, payload: UpdateAddressInput) => {
    return updateMutation.mutateAsync({ id, payload });
  };

  const handleSetDefault = async (id: string) => {
    return setDefaultMutation.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    addresses,
    defaultAddress,
    isLoading: isQueryLoading,
    isFetching,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      setDefaultMutation.isPending,
    createAddress: handleCreate,
    updateAddress: handleUpdate,
    setDefaultAddress: handleSetDefault,
    deleteAddress: handleDelete,
    refetch,
  };
}
