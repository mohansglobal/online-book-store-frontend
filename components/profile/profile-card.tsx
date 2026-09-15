"use client";

import React, { useRef } from "react";
import { Camera, Loader2, MapPin, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useUploadProfileImage, useRemoveProfileImage } from "@/features/auth";

export function ProfileCard() {
  const { data: user } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadProfileImage();
  const removeMutation = useRemoveProfileImage();

  const isUploading = uploadMutation.isPending;
  const isRemoving = removeMutation.isPending;

  const displayName = user?.name || "Mohan Das";
  const profilePicture = user?.profilePicture;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }

    uploadMutation.mutate(file, {
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  return (
    <div className="group relative min-h-[200px] overflow-hidden rounded-lg border border-border/40 p-5 text-white shadow-md flex flex-col justify-end">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || isRemoving}
      />

      {/* Background: Whole-card profile picture or fallback brand gradient */}
      {profilePicture ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profilePicture}
            alt={displayName}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Scrim overlay for text readability and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[color-mix(in_oklab,var(--color-primary)_80%,var(--color-accent))] to-accent pointer-events-none">
          <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-white/10 blur-xl" />
          <span className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-8xl font-black text-white/10">
            {initials}
          </span>
        </div>
      )}

      {/* Loading Overlay */}
      {(isUploading || isRemoving) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-xs text-white">
          <Loader2 size={24} className="animate-spin text-white" />
          <p className="text-xs font-medium">
            {isUploading ? "Uploading photo..." : "Removing photo..."}
          </p>
        </div>
      )}

      {/* Bottom section: Left info + Right actions */}
      <div className="relative z-10 flex items-end justify-between gap-3">
        {/* Left: User details */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold tracking-tight text-white drop-shadow-sm truncate">
            {displayName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-white/80 font-normal">
            {user?.email || "mohan@example.com"}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/75 font-medium">
            <MapPin size={13} className="shrink-0 text-white/90" />
            <span>Kolkata, India</span>
          </div>
        </div>

        {/* Right: Quick action buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            disabled={isUploading || isRemoving}
            onClick={() => fileInputRef.current?.click()}
            aria-label={profilePicture ? "Change profile photo" : "Upload profile photo"}
            title={profilePicture ? "Change photo" : "Upload photo"}
            className="size-8 rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white cursor-pointer"
          >
            {isUploading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Camera size={13} />
            )}
          </Button>

          {profilePicture && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              disabled={isUploading || isRemoving}
              onClick={() => removeMutation.mutate()}
              aria-label="Remove profile photo"
              title="Remove photo"
              className="size-8 rounded-full border border-white/20 bg-red-600/80 text-white backdrop-blur-md transition-colors hover:bg-red-600 cursor-pointer"
            >
              {isRemoving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
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


