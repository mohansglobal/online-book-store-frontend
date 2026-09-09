// React TanStack Query hook for publishers
"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublishers, getAllPublishers } from "../api/publishers.api";
import { publisherKeys } from "../queries/publisher.keys";
import type { GetPublishersParams } from "../types/publisher.types";


//Hook to fetch paginated/filtered publishers

export function usePublishers(params?: GetPublishersParams) {
  return useQuery({
    queryKey: publisherKeys.list(params),
    queryFn: ({ signal }) => getPublishers(params, { signal }),
  });
}

/**
 * Hook to fetch all publishers across all pages (ideal for filter sidebars and alphabetical directories)
 */
export function useAllPublishers() {
  return useQuery({
    queryKey: [...publisherKeys.all, "all"] as const,
    queryFn: ({ signal }) => getAllPublishers({ signal }),
    staleTime: 5 * 60 * 1000,
  });
}
