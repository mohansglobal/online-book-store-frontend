// Author API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  Author,
  AuthorsResponse,
  CreateAuthorInput,
  CreateAuthorResponse,
  DeleteAuthorResponse,
  GetAuthorsParams,
  SingleAuthorResponse,
  UpdateAuthorInput,
  UpdateAuthorResponse,
} from "../types/author.types";

export async function getAuthors(
  params?: GetAuthorsParams,
  options?: { signal?: AbortSignal },
): Promise<AuthorsResponse> {
  const queryParams: GetAuthorsParams = {
    ...params,
    sortOrder: params?.sortOrder ?? "asce",
  };

  return apiClient.get<AuthorsResponse>("/authors", {
    params: queryParams as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}

// Fetches all authors across all pages concurrently sorted alphabetically A to Z
export async function getAllAuthors(
  options?: { signal?: AbortSignal },
): Promise<Author[]> {
  const firstPage = await getAuthors(
    { limit: 100, page: 1, sortOrder: "asce" },
    options,
  );

  const totalPages = firstPage.meta?.totalPages ?? 1;
  const allAuthors = [...(firstPage.data ?? [])];

  if (totalPages > 1) {
    const pagePromises: Promise<AuthorsResponse>[] = [];

    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(
        getAuthors({ limit: 100, page: p, sortOrder: "asce" }, options),
      );
    }

    const remainingPages = await Promise.all(pagePromises);

    for (const res of remainingPages) {
      if (res.data) {
        allAuthors.push(...res.data);
      }
    }
  }

  return allAuthors.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }),
  );
}


// Fetches a single author by 24-character ObjectId or URL slug from /api/v1/authors/:idOrSlug
export async function getAuthorByIdOrSlug(
  idOrSlug: string,
  options?: { signal?: AbortSignal },
): Promise<SingleAuthorResponse> {
  return apiClient.get<SingleAuthorResponse>(`/authors/${encodeURIComponent(idOrSlug)}`, {
    signal: options?.signal,
  });
}

// Alias for getAuthorByIdOrSlug for backwards compatibility
export const getAuthorBySlug = getAuthorByIdOrSlug;

// Creates a new author via POST /api/v1/authors (Admin / Seller)
export async function createAuthor(
  input: CreateAuthorInput,
  options?: { signal?: AbortSignal },
): Promise<CreateAuthorResponse> {
  return apiClient.post<CreateAuthorResponse>("/authors", input, {
    signal: options?.signal,
  });
}

// Updates an existing author via PATCH /api/v1/authors/:id (Admin / Seller)
export async function updateAuthor(
  id: string,
  input: UpdateAuthorInput,
  options?: { signal?: AbortSignal },
): Promise<UpdateAuthorResponse> {
  return apiClient.patch<UpdateAuthorResponse>(`/authors/${encodeURIComponent(id)}`, input, {
    signal: options?.signal,
  });
}

// Soft deletes an author via DELETE /api/v1/authors/:id (Admin / Seller)
export async function deleteAuthor(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<DeleteAuthorResponse> {
  return apiClient.delete<DeleteAuthorResponse>(`/authors/${encodeURIComponent(id)}`, {
    signal: options?.signal,
  });
}
