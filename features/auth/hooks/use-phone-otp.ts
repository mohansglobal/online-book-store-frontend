// phone verification OTP mutation hooks
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { sendPhoneOtp, verifyPhoneOtp } from "../api/auth.api";
import type {
  SendPhoneOtpInput,
  SendPhoneOtpResponse,
  VerifyPhoneOtpInput,
  VerifyPhoneOtpResponse,
} from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useSendPhoneOtpMutation(
  options?: Omit<
    UseMutationOptions<SendPhoneOtpResponse, ApiClientError, SendPhoneOtpInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: sendPhoneOtp,
    ...options,
  });
}

export function useVerifyPhoneOtpMutation(
  options?: Omit<
    UseMutationOptions<VerifyPhoneOtpResponse, ApiClientError, VerifyPhoneOtpInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: verifyPhoneOtp,
    ...options,
  });
}
