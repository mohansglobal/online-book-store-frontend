// Book and Listing API endpoint functions
import { apiClient } from "@/lib/api";
import {
  normalizeListingToApiBook,
  type BooksResponse,
  type CreateBookListingInput,
  type CreateBookListingResponse,
  type GetBooksParams,
  type IsbnLookupResponse,
  type SingleBookResponse,
} from "../types/book.types";

import type {
  ApplyListingDiscountInput,
  ApplyListingDiscountResponse,
  BulkApplyDiscountInput,
  BulkApplyDiscountResponse,
  BulkRemoveDiscountInput,
  BulkRemoveDiscountResponse,
  GetSellerListingsParams,
  RemoveListingDiscountResponse,
  SellerListingsResponse,
  ToggleListingStatusInput,
  ToggleListingStatusResponse,
  UpdateListingInput,
  UpdateListingResponse,
  UpdateStockInput,
  UpdateStockResponse,
} from "../types/listing.types";

// Fetches listings/books from /api/v1/listings
export async function getBooks(
  params?: GetBooksParams,
  options?: { signal?: AbortSignal },
): Promise<BooksResponse> {
  const response = await apiClient.get<BooksResponse>("/listings", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });

  return {
    ...response,
    data: Array.isArray(response?.data)
      ? response.data.map(normalizeListingToApiBook)
      : [],
  };
}

// Fetches a single listing/book by id from /api/v1/listings/:identifier
export async function getBookByIdOrSlug(
  identifier: string,
  options?: { signal?: AbortSignal },
): Promise<SingleBookResponse> {
  const response = await apiClient.get<SingleBookResponse>(
    `/listings/${encodeURIComponent(identifier)}`,
    {
      signal: options?.signal,
    },
  );

  return {
    ...response,
    data: response?.data ? normalizeListingToApiBook(response.data) : response?.data,
  };
}

// Looks up a canonical book by ISBN from /api/v1/books/isbn/:isbn
export async function lookupBookByIsbn(
  isbn: string,
  options?: { signal?: AbortSignal },
): Promise<IsbnLookupResponse> {
  return apiClient.get<IsbnLookupResponse>(
    `/books/isbn/${encodeURIComponent(isbn)}`,
    {
      signal: options?.signal,
    },
  );
}

// Creates a new seller book listing via POST /api/v1/book-listings
export async function createBookListing(
  input: CreateBookListingInput,
  options?: { signal?: AbortSignal },
): Promise<CreateBookListingResponse> {
  return apiClient.post<CreateBookListingResponse>("/book-listings", input, {
    signal: options?.signal,
  });
}

// Fetches current seller's own listings from /api/v1/book-listings/my-listings
export async function getMyBookListings(
  params?: GetSellerListingsParams,
  options?: { signal?: AbortSignal },
): Promise<SellerListingsResponse> {
  return apiClient.get<SellerListingsResponse>("/book-listings/my-listings", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}

// Atomically updates listing stock (increase, decrease, set) via PATCH /api/v1/book-listings/:id/stock
export async function updateListingStock(
  input: UpdateStockInput,
  options?: { signal?: AbortSignal },
): Promise<UpdateStockResponse> {
  return apiClient.patch<UpdateStockResponse>(
    `/book-listings/${encodeURIComponent(input.listingId)}/stock`,
    {
      operation: input.operation,
      quantity: input.quantity,
    },
    {
      signal: options?.signal,
    },
  );
}

// Toggles or sets listing active status via PATCH /api/v1/book-listings/:id/toggle-status
export async function toggleListingStatus(
  input: ToggleListingStatusInput,
  options?: { signal?: AbortSignal },
): Promise<ToggleListingStatusResponse> {
  const body =
    input.isActive !== undefined ? { isActive: input.isActive } : {};

  return apiClient.patch<ToggleListingStatusResponse>(
    `/book-listings/${encodeURIComponent(input.listingId)}/toggle-status`,
    body,
    {
      signal: options?.signal,
    },
  );
}

// Applies discount and updates selling price via PATCH /api/v1/listings/:id/discount
export async function applyListingDiscount(
  input: ApplyListingDiscountInput,
  options?: { signal?: AbortSignal },
): Promise<ApplyListingDiscountResponse> {
  const listingId = input.listingId;

  const payload = {
    discountType: input.discountType,
    discountValue: input.discountValue,
    ...(input.startDate ? { startDate: input.startDate } : {}),
    ...(input.endDate ? { endDate: input.endDate } : {}),
    ...(input.campaignName ? { campaignName: input.campaignName } : {}),
    ...(input.mrp !== undefined ? { mrp: input.mrp } : {}),
    ...(input.mrpInPaise !== undefined ? { mrpInPaise: input.mrpInPaise } : {}),
  };

  return apiClient.patch<ApplyListingDiscountResponse>(
    `/listings/${encodeURIComponent(listingId)}/discount`,
    payload,
    {
      signal: options?.signal,
    },
  );
}

// Removes discount for a single listing via DELETE /api/v1/listings/:id/discount
export async function removeListingDiscount(
  listingId: string,
  options?: { signal?: AbortSignal },
): Promise<RemoveListingDiscountResponse> {
  return apiClient.delete<RemoveListingDiscountResponse>(
    `/listings/${encodeURIComponent(listingId)}/discount`,
    {
      signal: options?.signal,
    },
  );
}

// Applies scheduled or instant discount in bulk via POST /api/v1/listings/discounts/bulk
export async function applyBulkDiscount(
  input: BulkApplyDiscountInput,
  options?: { signal?: AbortSignal },
): Promise<BulkApplyDiscountResponse> {
  return apiClient.post<BulkApplyDiscountResponse>(
    "/listings/discounts/bulk",
    input,
    {
      signal: options?.signal,
    },
  );
}

// Removes discount in bulk via DELETE /api/v1/listings/discounts/bulk
export async function removeBulkDiscount(
  input: BulkRemoveDiscountInput,
  options?: { signal?: AbortSignal },
): Promise<BulkRemoveDiscountResponse> {
  return apiClient.delete<BulkRemoveDiscountResponse>(
    "/listings/discounts/bulk",
    {
      json: input,
      signal: options?.signal,
    },
  );
}

// Updates a seller listing and optional master book details via PATCH /api/v1/listings/:id
export async function updateSellerListing(
  input: UpdateListingInput,
  options?: { signal?: AbortSignal },
): Promise<UpdateListingResponse> {
  const { listingId, ...payload } = input;

  return apiClient.patch<UpdateListingResponse>(
    `/listings/${encodeURIComponent(listingId)}`,
    payload,
    {
      signal: options?.signal,
    },
  );
}



