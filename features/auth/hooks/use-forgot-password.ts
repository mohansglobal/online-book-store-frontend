// forgot password mutation hook (send OTP)
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth.api";
import type {
  ForgotPasswordInput,
  ForgotPasswordResponse,
} from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useForgotPasswordMutation(
  options?: Omit<
    UseMutationOptions<ForgotPasswordResponse, ApiClientError, ForgotPasswordInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
}

export const useForgotPassword = useForgotPasswordMutation;
