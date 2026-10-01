// resend email otp mutation hook
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { resendEmailOtp } from "../api/auth.api";
import type { ResendEmailOtpInput, ResendEmailOtpResponse } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useResendEmailOtpMutation(
  options?: Omit<
    UseMutationOptions<ResendEmailOtpResponse, ApiClientError, ResendEmailOtpInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: resendEmailOtp,
    ...options,
  });
}

export const useResendEmailOtp = useResendEmailOtpMutation;
