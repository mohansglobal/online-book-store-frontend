// auth query options factory
import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";
import { authKeys } from "./auth.keys";

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      queryFn: ({ signal }) => getCurrentUser({ signal }),
      select: (res) => res.data,
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
};
