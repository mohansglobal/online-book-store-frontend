// Change password mutation hook
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { changePassword } from "../api/auth.api";
import type {
  ChangePasswordInput,
  ChangePasswordResponse,
} from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useChangePasswordMutation(
  options?: Omit<
    UseMutationOptions<
      ChangePasswordResponse,
      ApiClientError,
      ChangePasswordInput
    >,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: changePassword,
    ...options,
  });
}

export const useChangePassword = useChangePasswordMutation;
