// Standardized React Query keys for books domain
import type { GetBooksParams } from "../types/book.types";

export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params?: GetBooksParams) =>
    params !== undefined
      ? ([...bookKeys.lists(), params] as const)
      : ([...bookKeys.lists()] as const),
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (identifier: string) => [...bookKeys.details(), identifier] as const,
};
