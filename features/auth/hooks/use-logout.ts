// logout mutation hook
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { logoutUser } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
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
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}

// alias for clean imports
export const useLogout = useLogoutMutation;
