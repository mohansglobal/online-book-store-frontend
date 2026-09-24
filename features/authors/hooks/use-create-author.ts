// React TanStack Query mutation hook for creating an author
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthor } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";
import type { CreateAuthorInput, CreateAuthorResponse } from "../types/author.types";

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation<CreateAuthorResponse, Error, CreateAuthorInput>({
    mutationFn: (input: CreateAuthorInput) => createAuthor(input),
    onSuccess: () => {
      // Invalidate all author query caches so lists and selectors refresh
      queryClient.invalidateQueries({ queryKey: authorKeys.all });
    },
  });
}
