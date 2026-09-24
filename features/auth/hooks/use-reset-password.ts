// reset password mutation hook
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { resetPassword } from "../api/auth.api";
import type { ResetPasswordInput, ResetPasswordResponse } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useResetPasswordMutation(
  options?: Omit<
    UseMutationOptions<ResetPasswordResponse, ApiClientError, ResetPasswordInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
}

export const useResetPassword = useResetPasswordMutation;
