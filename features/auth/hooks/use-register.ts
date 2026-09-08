// register mutation hook
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { registerUser } from "../api/auth.api";
import type { AuthResponse, RegisterInput } from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useRegisterMutation(
  options?: Omit<
    UseMutationOptions<AuthResponse, ApiClientError, RegisterInput>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
}

// alias for clean imports
export const useRegister = useRegisterMutation;
