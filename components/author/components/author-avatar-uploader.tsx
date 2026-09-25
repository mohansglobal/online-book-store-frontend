// Author circular avatar uploader with upload status, preview, and quick remove actions
"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload, X } from "lucide-react";

interface AuthorAvatarUploaderProps {
  name: string;
  photo: string;
  photoPreview: string | null;
  onPhotoFileChange: (file: File | null) => void;
  onRemovePhoto: () => void;
  isUploadingPhoto: boolean;
  disabled?: boolean;
}

const DEFAULT_FALLBACK_PHOTO = "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";

//Resolves author photo source from preview, absolute CDN URL, or backend assets

export function resolveAuthorDisplayPhoto(
  photoPreview?: string | null,
  photo?: string,
): string {
  if (photoPreview && photoPreview.trim()) {
    return photoPreview.trim();
  }

  if (!photo || !photo.trim()) {
    return DEFAULT_FALLBACK_PHOTO;
  }

  const trimmed = photo.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "http://localhost:5000";

  return `${backendBase}/assets/upload/author/${trimmed}`;
}

export function AuthorAvatarUploader({
  name,
  photo,
  photoPreview,
  onPhotoFileChange,
  onRemovePhoto,
  isUploadingPhoto,
  disabled = false,
}: AuthorAvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPhoto = resolveAuthorDisplayPhoto(photoPreview, photo);
  const hasCustomPhoto = Boolean(photoPreview?.trim() || photo?.trim());
  const isBusy = disabled || isUploadingPhoto;

  const handleAvatarClick = () => {
    if (!isBusy) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onPhotoFileChange(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
              
      <button
        type="button"
        onClick={handleAvatarClick}
        disabled={isBusy}
        title={hasCustomPhoto ? "Click to replace portrait" : "Click to upload portrait"}
        className="group/avatar relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border bg-[#ebe4d2] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 hover:border-accent disabled:cursor-not-allowed"
      >
        {isUploadingPhoto ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-black/60 text-white">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="mt-1 text-[10px] font-medium">Uploading...</span>
          </div>
        ) : (
          <>
            <Image
              src={displayPhoto}
              alt={name || "Author photo"}
              fill
              sizes="96px"
              unoptimized={typeof displayPhoto === "string"}
              className="object-cover object-top transition-transform duration-300 group-hover/avatar:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-200 group-hover/avatar:opacity-100">
              <Camera className="h-5 w-5" />
              <span className="mt-0.5 text-[10px] font-semibold">
                {hasCustomPhoto ? "Change" : "Upload"}
              </span>
            </div>
          </>
        )}
      </button>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={isBusy}
          className="flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground hover:text-accent cursor-pointer transition-colors disabled:cursor-not-allowed"
          title="Upload image from device"
        >
          <Upload className="h-3 w-3" />
          {hasCustomPhoto ? "Change" : "Upload"}
        </button>

        {hasCustomPhoto && (
          <button
            type="button"
            onClick={onRemovePhoto}
            disabled={isBusy}
            className="flex items-center gap-0.5 text-[10px] font-medium text-destructive hover:underline cursor-pointer transition-colors disabled:cursor-not-allowed"
            title="Remove portrait"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
