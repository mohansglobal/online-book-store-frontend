// verify reset OTP mutation hook
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { verifyResetOtp } from "../api/auth.api";
import type {
  VerifyResetOtpInput,
  VerifyResetOtpResponse,
} from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useVerifyResetOtpMutation(
  options?: Omit<
    UseMutationOptions<VerifyResetOtpResponse, ApiClientError, VerifyResetOtpInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: verifyResetOtp,
    ...options,
  });
}

export const useVerifyResetOtp = useVerifyResetOtpMutation;
