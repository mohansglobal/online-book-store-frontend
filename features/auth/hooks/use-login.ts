import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
import { useUserStore } from "../stores/use-user-store";
import type { LoginInput, LoginResponse } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useLoginMutation(
  options?: Omit<
    UseMutationOptions<LoginResponse, ApiClientError, LoginInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      const user = data.data.user;

      if (user) {
        useUserStore.getState().setUser(user);
        queryClient.setQueryData(authKeys.me(), user);
      }

      options?.onSuccess?.(...args);
    },
  });
}

// alias for clean imports
export const useLogin = useLoginMutation;
