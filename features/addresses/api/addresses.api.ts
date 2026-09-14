// Address API client functions matching /api/v1/addresses backend endpoints
import { apiClient } from "@/lib/api";
import type {
  AddressType,
  AddressesResponse,
  CreateAddressInput,
  DeleteAddressResponse,
  SingleAddressResponse,
  UpdateAddressInput,
} from "../types/address.types";

/**
 * Fetch all addresses for the authenticated user, optionally filtered by addressType.
 * GET /api/v1/addresses
 */
export async function getAddresses(
  addressType?: AddressType,
  options?: { signal?: AbortSignal },
): Promise<AddressesResponse> {
  return apiClient.get<AddressesResponse>("/addresses", {
    params: addressType ? { addressType } : undefined,
    signal: options?.signal,
  });
}

/**
 * Fetch the default address for the authenticated user (for fast checkout pre-fill).
 * GET /api/v1/addresses/default?addressType=BILLING|SHIPPING
 */
export async function getDefaultAddress(
  addressType?: AddressType,
  options?: { signal?: AbortSignal },
): Promise<SingleAddressResponse> {
  return apiClient.get<SingleAddressResponse>("/addresses/default", {
    params: addressType ? { addressType } : undefined,
    signal: options?.signal,
  });
}

/**
 * Fetch a single address by ID.
 * GET /api/v1/addresses/:id
 */
export async function getAddressById(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<SingleAddressResponse> {
  return apiClient.get<SingleAddressResponse>(
    `/addresses/${encodeURIComponent(id)}`,
    {
      signal: options?.signal,
    },
  );
}

/**
 * Create a new address for the authenticated user.
 * POST /api/v1/addresses
 */
export async function createAddress(
  payload: CreateAddressInput,
): Promise<SingleAddressResponse> {
  return apiClient.post<SingleAddressResponse>("/addresses", payload);
}

/**
 * Update an existing address by ID.
 * PATCH /api/v1/addresses/:id
 */
export async function updateAddress(
  id: string,
  payload: UpdateAddressInput,
): Promise<SingleAddressResponse> {
  return apiClient.patch<SingleAddressResponse>(
    `/addresses/${encodeURIComponent(id)}`,
    payload,
  );
}

/**
 * Mark an address as the default address.
 * PATCH /api/v1/addresses/:id/set-default
 */
export async function setDefaultAddress(
  id: string,
): Promise<SingleAddressResponse> {
  return apiClient.patch<SingleAddressResponse>(
    `/addresses/${encodeURIComponent(id)}/set-default`,
  );
}

/**
 * Delete an address by ID.
 * DELETE /api/v1/addresses/:id
 */
export async function deleteAddress(
  id: string,
): Promise<DeleteAddressResponse> {
  return apiClient.delete<DeleteAddressResponse>(
    `/addresses/${encodeURIComponent(id)}`,
  );
}
