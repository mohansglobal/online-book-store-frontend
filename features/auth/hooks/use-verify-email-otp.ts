// verify email otp mutation hook
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { verifyEmailOtp } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
import type { VerifyEmailOtpInput, VerifyEmailOtpResponse } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useVerifyEmailOtpMutation(
  options?: Omit<
    UseMutationOptions<VerifyEmailOtpResponse, ApiClientError, VerifyEmailOtpInput>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailOtp,
    ...options,
    onSuccess: (...args) => {
      const [data] = args;

      if (data.data?.user) {
        queryClient.setQueryData(authKeys.me(), {
          success: true,
          data: data.data.user,
        });
      }

      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      options?.onSuccess?.(...args);
    },
  });
}

export const useVerifyEmailOtp = useVerifyEmailOtpMutation;
