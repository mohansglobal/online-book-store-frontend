// Mutation hooks for address CRUD operations
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../api/addresses.api";
import { addressKeys } from "../queries/address.keys";
import type {
  AddressesResponse,
  CreateAddressInput,
  UpdateAddressInput,
} from "../types/address.types";

export function useCreateAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressInput) => createAddress(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(res.message || "Address saved successfully!");
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string })?.message || "Failed to save address";
      toast.error(message);
    },
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAddressInput;
    }) => updateAddress(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(res.message || "Address updated successfully!");
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string })?.message || "Failed to update address";
      toast.error(message);
    },
  });
}

export function useSetDefaultAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),
    onSuccess: (res, id) => {
      // Optimistically update lists in cache so only the isDefault flag changes without list jumping
      queryClient.setQueriesData<AddressesResponse>(
        { queryKey: addressKeys.lists() },
        (old) => {
          if (!old?.data || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((addr) => ({
              ...addr,
              isDefault: addr._id === id,
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string })?.message ||
        "Failed to set default address";
      toast.error(message);
    },
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(res.message || "Address deleted successfully!");
    },
    onError: (err: unknown) => {
      const message =
        (err as { message?: string })?.message || "Failed to delete address";
      toast.error(message);
    },
  });
}
