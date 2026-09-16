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
  GetSellerListingsParams,
  SellerListingsResponse,
  ToggleListingStatusInput,
  ToggleListingStatusResponse,
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

// Creates a new seller book listing via POST /api/v1/listings
export async function createBookListing(
  input: CreateBookListingInput,
  options?: { signal?: AbortSignal },
): Promise<CreateBookListingResponse> {
  return apiClient.post<CreateBookListingResponse>("/listings", input, {
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


