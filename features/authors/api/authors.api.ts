// Author API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  AuthorsResponse,
  GetAuthorsParams,
  SingleAuthorResponse,
} from "../types/author.types";


export async function getAuthors(
  params?: GetAuthorsParams,
  options?: { signal?: AbortSignal },
): Promise<AuthorsResponse> {
  return apiClient.get<AuthorsResponse>("/authors", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}


//Fetches a single author by slug or id from /api/v1/authors/:identifier

export async function getAuthorBySlug(
  slug: string,
  options?: { signal?: AbortSignal },
): Promise<SingleAuthorResponse> {
  return apiClient.get<SingleAuthorResponse>(`/authors/${encodeURIComponent(slug)}`, {
    signal: options?.signal,
  });
}
