// Cloudinary Image Upload API client
import { apiClient } from "@/lib/api";

export type UploadedFileMeta = {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  originalName: string;
};

export type UploadResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    urls: string[];
    files: UploadedFileMeta[];
    count: number;
  };
};

// Uploads a single image to Cloudinary via POST /api/v1/upload
export async function uploadSingleImage(
  file: File,
  folder: string = "books/covers",
  options?: { signal?: AbortSignal },
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("coverImage", file);
  formData.append("folder", folder);

  return apiClient.post<UploadResponse>("/upload", undefined, {
    body: formData,
    signal: options?.signal,
  });
}

// Uploads multiple images to Cloudinary via POST /api/v1/upload
export async function uploadMultipleImages(
  files: File[],
  folder: string = "books/gallery",
  options?: { signal?: AbortSignal },
): Promise<UploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  formData.append("folder", folder);

  return apiClient.post<UploadResponse>("/upload", undefined, {
    body: formData,
    signal: options?.signal,
  });
}

// Deletes an image from Cloudinary by publicId via DELETE /api/v1/upload/:publicId
export async function deleteUploadedImage(
  publicId: string,
  options?: { signal?: AbortSignal },
): Promise<{ success: boolean; message: string }> {
  return apiClient.delete<{ success: boolean; message: string }>(
    `/upload/${encodeURIComponent(publicId)}`,
    {
      signal: options?.signal,
    },
  );
}
