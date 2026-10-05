// auth query options factory
import { queryOptions } from "@tanstack/react-query";
import { isApiClientError } from "@/lib/api";
import { getCurrentUser } from "../api/auth.api";
import { authKeys } from "./auth.keys";

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      queryFn: ({ signal }) => getCurrentUser({ signal }),
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error: unknown) => {
        if (isApiClientError(error) && error.status === 401) {
          return false;
        }

        return failureCount < 2;
      },
    }),
};
