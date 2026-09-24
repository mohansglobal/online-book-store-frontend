// React TanStack Query mutation hook for updating an author
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAuthor } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";
import type { UpdateAuthorInput, UpdateAuthorResponse } from "../types/author.types";

export type UpdateAuthorVariables = {
  id: string;
  data: UpdateAuthorInput;
};

export function useUpdateAuthor() {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateAuthorResponse, Error, UpdateAuthorVariables>({
    mutationFn: ({ id, data }) => updateAuthor(id, data),
    onSuccess: (response, variables) => {
      // Invalidate all author query caches so lists, tables, and selectors refresh immediately
      queryClient.invalidateQueries({ queryKey: authorKeys.all });

      // Invalidate the specific author details query by id
      queryClient.invalidateQueries({
        queryKey: authorKeys.detail(variables.id),
      });

      // Invalidate the specific author details query by slug if available
      const updatedSlug = response.data?.slug;
      if (updatedSlug) {
        queryClient.invalidateQueries({
          queryKey: authorKeys.detail(updatedSlug),
        });
      }
    },
  });
}
