// React TanStack Query hook for authors
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";
import type { GetAuthorsParams } from "../types/author.types";

/**
 * Hook to fetch paginated/filtered authors
 */
export function useAuthors(params?: GetAuthorsParams) {
  return useQuery({
    queryKey: authorKeys.list(params),
    queryFn: ({ signal }) => getAuthors(params, { signal }),
  });
}
