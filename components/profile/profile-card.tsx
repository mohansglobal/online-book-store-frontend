"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2, MapPin, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageCropModal } from "@/components/ui/image-crop-modal";
import {
  useCurrentUser,
  useUploadProfileImage,
  useRemoveProfileImage,
} from "@/features/auth";

export function ProfileCard() {
  const { data: user } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const uploadMutation = useUploadProfileImage();
  const removeMutation = useRemoveProfileImage();

  const isUploading = uploadMutation.isPending;
  const isRemoving = removeMutation.isPending;

  const displayName = user?.name || "Mohan Das";
  const profilePicture = user?.profilePicture;

  const initials =
    displayName
      .split(" ")
      .map((namePart) => namePart[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File | null): Promise<void> => {
    if (!croppedFile) return;

    uploadMutation.mutate(croppedFile, {
      onSuccess: () => {
        setIsCropModalOpen(false);
        setCropImageSrc(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },

      onError: () => {
        setIsCropModalOpen(false);
        setCropImageSrc(null);
      },
    });
  };

  const handleCloseCropModal = () => {
    if (!isUploading) {
      setIsCropModalOpen(false);
      setCropImageSrc(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading || isRemoving}
        />

        {/* Header Banner with Image-Based Ambient Glow */}
        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-r from-primary/80 via-accent/70 to-primary/60">
          {profilePicture ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profilePicture}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover scale-150 blur-xl brightness-75 opacity-70 transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-card/90" />
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/15 blur-lg"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-6 -bottom-6 size-20 rounded-full bg-white/10 blur-md"
              />
            </>
          )}
        </div>

        {/* Card Content with Centered Round Avatar */}
        <div className="relative px-5 pb-5 pt-0 text-center">
          {/* Round Avatar Container with Ambient Halo (Unobstructed Image View) */}
          <div className="group/avatar relative -mt-12 mb-3 mx-auto flex size-22 items-center justify-center">
            {/* Ambient Glow Halo behind the avatar */}
            {profilePicture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profilePicture}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 size-full rounded-full object-cover blur-md opacity-60 scale-110"
              />
            )}

            <div className="relative size-full overflow-hidden rounded-full border-3 border-card bg-muted shadow-lg ring-2 ring-primary/20">
              {profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePicture}
                  alt={displayName}
                  className="size-full rounded-full object-cover transition-transform duration-300"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/15 text-primary">
                  <span className="font-display text-2xl font-bold tracking-tight">
                    {initials}
                  </span>
                </div>
              )}

              {/* Hover Action Overlay: Only appears on hover so image is never blocked */}
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-full bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/avatar:opacity-100">
                <button
                  type="button"
                  disabled={isUploading || isRemoving}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={profilePicture ? "Change photo" : "Upload photo"}
                  title={profilePicture ? "Change photo" : "Upload photo"}
                  className="grid size-8 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/35 cursor-pointer disabled:opacity-50"
                >
                  <Camera size={14} />
                </button>

                {profilePicture && (
                  <button
                    type="button"
                    disabled={isUploading || isRemoving}
                    onClick={() => removeMutation.mutate()}
                    aria-label="Delete profile photo"
                    title="Delete photo"
                    className="grid size-8 place-items-center rounded-full bg-red-600/80 text-white transition hover:bg-red-600 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {/* Loading Overlay */}
              {(isUploading || isRemoving) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-base font-bold tracking-tight text-foreground truncate">
            {displayName}
          </h2>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {user?.email || "mohan@example.com"}
          </p>

          {/* Location badge */}
          {/* <div className="mt-2.5 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface-soft px-3 py-0.5 text-[11px] font-medium text-text-secondary">
              <MapPin size={12} className="text-primary shrink-0" />
              <span>Kolkata, India</span>
            </div>
          </div> */}

          {/* Dedicated Photo Actions below: Clean and unblocking */}
          <div className="mt-3.5 flex items-center justify-center gap-2 border-t border-border/50 pt-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUploading || isRemoving}
              onClick={() => fileInputRef.current?.click()}
              className="h-7.5 rounded-full px-3 text-xs font-medium cursor-pointer"
            >
              <Camera size={12} className="mr-1.5" />
              {profilePicture ? "Change" : "Upload"}
            </Button>

            {profilePicture && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isUploading || isRemoving}
                onClick={() => removeMutation.mutate()}
                className="h-7.5 rounded-full px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <Trash2 size={12} className="mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Image Crop Modal with react-easy-crop */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropImageSrc}
        onClose={handleCloseCropModal}
        onCropComplete={handleCropComplete}
        isProcessing={isUploading}
        title="Crop Profile Photo"
        fileName="profile-picture.jpg"
        cropShape="round"
      />
    </>
  );
}

export function AccountStatus() {
  return (
    <div className="mt-6 rounded-[18px] border border-border bg-surface-soft p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck size={17} />
        </span>

        <div>
          <p className="text-xs font-medium">Account protected</p>
          <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
            Your email address has been verified.
          </p>
        </div>
      </div>
    </div>
  );
}
