// login mutation hook
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
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
      queryClient.setQueryData(authKeys.me(), {
        success: true,
        data: data.data.user,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      options?.onSuccess?.(...args);
    },
  });
}

// alias for clean imports
export const useLogin = useLoginMutation;
