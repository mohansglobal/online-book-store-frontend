import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
import { useUserStore } from "../stores/use-user-store";
import type { LogoutResponse } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useLogoutMutation(
  options?: Omit<
    UseMutationOptions<LogoutResponse, ApiClientError, void>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    ...options,
    onSuccess: (...args) => {
      useUserStore.getState().clearUser();
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({
        predicate: (query) => {
          const firstKey = query.queryKey[0];
          return (
            firstKey === "orders" ||
            firstKey === "cart" ||
            firstKey === "wishlist" ||
            firstKey === "addresses" ||
            firstKey === "profile" ||
            firstKey === "seller"
          );
        },
      });
      options?.onSuccess?.(...args);
    },
  });
}

// alias for clean imports
export const useLogout = useLogoutMutation;
