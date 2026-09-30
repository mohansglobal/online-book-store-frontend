// React TanStack Query hook for publishers
"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPublishers, getAllPublishers } from "../api/publishers.api";
import { publisherKeys } from "../queries/publisher.keys";
import type { GetPublishersParams } from "../types/publisher.types";

// Hook to fetch paginated/filtered publishers
export function usePublishers(params?: GetPublishersParams) {
  return useQuery({
    queryKey: publisherKeys.list(params),
    queryFn: ({ signal }) => getPublishers(params, { signal }),
  });
}

// Hook to fetch all publishers across all pages (for filter sidebars and lookups)
export function useAllPublishers() {
  return useQuery({
    queryKey: [...publisherKeys.all, "all"] as const,
    queryFn: ({ signal }) => getAllPublishers({ signal }),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to fetch publishers infinitely with pagination for infinite scroll
export function useInfinitePublishers(params?: Omit<GetPublishersParams, "page">) {
  const queryParams: GetPublishersParams = {
    limit: 20,
    ...params,
  };

  return useInfiniteQuery({
    queryKey: publisherKeys.infinite(queryParams),
    queryFn: ({ pageParam = 1, signal }) =>
      getPublishers({ ...queryParams, page: pageParam as number }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;

      const currentPage = meta.page ?? 1;
      const totalPages = meta.totalPages ?? 1;
      const hasNext = currentPage < totalPages;

      return hasNext ? currentPage + 1 : undefined;
    },
  });
}

