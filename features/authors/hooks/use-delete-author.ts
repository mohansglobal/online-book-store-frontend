// React TanStack Query mutation hook for soft deleting an author
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAuthor } from "../api/authors.api";
import { authorKeys } from "../queries/author.keys";
import type { DeleteAuthorResponse } from "../types/author.types";

export function useDeleteAuthor() {
  const queryClient = useQueryClient();

  return useMutation<DeleteAuthorResponse, Error, string>({
    mutationFn: (id: string) => deleteAuthor(id),
    onSuccess: (response, authorId) => {
      // Invalidate all author query caches so lists and tables refresh immediately
      queryClient.invalidateQueries({ queryKey: authorKeys.all });

      // Invalidate the specific author details query
      queryClient.invalidateQueries({
        queryKey: authorKeys.detail(authorId),
      });

      const deletedName = response.data?.name || "Author";
      toast.success(response.message || `Author "${deletedName}" deleted successfully`);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete author";
      toast.error(message);
    },
  });
}
