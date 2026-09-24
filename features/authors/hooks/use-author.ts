// React TanStack Query hook for fetching a single author by ID or slug
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthorByIdOrSlug } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";

export function useAuthor(idOrSlug: string, enabled = true) {
  const isEnabled = Boolean(idOrSlug) && enabled;

  return useQuery({
    queryKey: authorKeys.detail(idOrSlug),
    queryFn: ({ signal }) => getAuthorByIdOrSlug(idOrSlug, { signal }),
    enabled: isEnabled,
  });
}
