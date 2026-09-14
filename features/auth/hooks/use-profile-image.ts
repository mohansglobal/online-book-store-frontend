// upload and remove profile image mutation hooks
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeProfileImage, uploadProfileImage } from "../api/auth.api";
import { authKeys } from "../queries/auth.keys";
import type {
  CurrentUserResponse,
  RemoveProfileImageResponse,
  UploadProfileImageResponse,
} from "../types/auth.types";
import type { ApiClientError } from "@/lib/api";

export function useUploadProfileImageMutation(
  options?: Omit<
    UseMutationOptions<UploadProfileImageResponse, ApiClientError, File>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      // update auth queries cache with the updated user data
      queryClient.setQueryData<CurrentUserResponse>(authKeys.me(), {
        success: true,
        data: data.data.user,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.success(data.message || "Profile image updated successfully");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to upload profile image");
      options?.onError?.(...args);
    },
  });
}

export function useRemoveProfileImageMutation(
  options?: Omit<
    UseMutationOptions<RemoveProfileImageResponse, ApiClientError, void>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProfileImage,
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.setQueryData<CurrentUserResponse>(authKeys.me(), {
        success: true,
        data: data.data,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.success(data.message || "Profile image removed successfully");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Failed to remove profile image");
      options?.onError?.(...args);
    },
  });
}

export const useUploadProfileImage = useUploadProfileImageMutation;
export const useRemoveProfileImage = useRemoveProfileImageMutation;
