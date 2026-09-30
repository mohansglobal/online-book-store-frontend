// React TanStack Query hook for authors
"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAuthors, getAllAuthors } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";
import type { GetAuthorsParams } from "../types/author.types";

// Hook to fetch paginated or filtered authors
export function useAuthors(params?: GetAuthorsParams) {
  return useQuery({
    queryKey: authorKeys.list(params),
    queryFn: ({ signal }) => getAuthors(params, { signal }),
  });
}

// Hook to fetch all authors across all pages sorted alphabetically A to Z
export function useAllAuthors() {
  return useQuery({
    queryKey: [...authorKeys.all, "all", "asce"] as const,
    queryFn: ({ signal }) => getAllAuthors({ signal }),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch authors infinitely with pagination for virtualized infinite scroll
export function useInfiniteAuthors(params?: Omit<GetAuthorsParams, "page">) {
  const queryParams: GetAuthorsParams = {
    limit: 20,
    sortOrder: "asce",
    ...params,
  };

  return useInfiniteQuery({
    queryKey: authorKeys.infinite(queryParams),
    queryFn: ({ pageParam = 1, signal }) =>
      getAuthors({ ...queryParams, page: pageParam as number }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;

      const currentPage = meta.page ?? 1;
      const totalPages = meta.totalPages ?? 1;
      const hasNext = meta.hasNextPage ?? (currentPage < totalPages);

      return hasNext ? currentPage + 1 : undefined;
    },
  });
}


