// Interactive storefront preview card with integrated direct avatar photo uploader
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { formatDateDisplay } from "@/lib/date-utils";
import {
  Camera,
  Loader2,
  Sparkles,
  Calendar,
  X,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthorPreviewCardProps {
  name: string;
  nameBn?: string;
  bio?: string;
  photo?: string;
  photoPreview?: string | null;
  birthDate?: string;
  deathDate?: string;
  isActive?: boolean;
  isUploadingPhoto: boolean;
  onPhotoFileChange: (file: File | null) => void;
  onPhotoUrlChange: (url: string) => void;
}

const DEFAULT_FALLBACK_PHOTO =
  "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";


export function AuthorPreviewCard({
  name,
  nameBn,
  bio,
  photo,
  photoPreview,
  birthDate,
  deathDate,
  isActive = true,
  isUploadingPhoto,
  onPhotoFileChange,
  onPhotoUrlChange,
}: AuthorPreviewCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(photo || "");

  const displayName = name.trim() || "";
  const displayBio = bio?.trim() || "";
  const displayPhoto = photoPreview?.trim() || photo?.trim() || DEFAULT_FALLBACK_PHOTO;

  const birthFormatted = formatDateDisplay(birthDate);
  const deathFormatted = formatDateDisplay(deathDate);
  const dateLifespan = [birthFormatted, deathFormatted].filter(Boolean).join(" — ");

  
  
  const handleApplyUrl = () => {
    onPhotoUrlChange(tempUrl.trim());
    setUrlInputOpen(false);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoFileChange(null);
    onPhotoUrlChange("");
    setTempUrl("");
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border/80 bg-[#F7F1E3] p-6 shadow-sm">
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Storefront Preview
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
        >
          {isActive ? "Active" : "Draft"}
        </span>
      </div>

      {/* Avatar with Direct Click-to-Upload */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="relative group/avatar">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onPhotoFileChange(file);
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            title="Click to upload portrait"
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border bg-[#ebe4d2] shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 group-hover/avatar:border-accent"
          >
            {isUploadingPhoto ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black/60 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="mt-1 text-[10px] font-medium">Uploading</span>
              </div>
            ) : (
              <>
                <Image
                  src={displayPhoto}
                  alt={displayName}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover object-top transition-transform duration-300 group-hover/avatar:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-200 group-hover/avatar:opacity-100">
                  <Camera className="h-5 w-5" />
                  <span className="mt-0.5 text-[10px] font-semibold">Change</span>
                </div>
              </>
            )}
          </button>

          {/* Quick Remove & URL Actions */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {displayPhoto !== DEFAULT_FALLBACK_PHOTO && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                title="Remove custom photo"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            )}

            <Popover open={urlInputOpen} onOpenChange={setUrlInputOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-accent hover:bg-accent/10 cursor-pointer transition-colors"
                  title="Paste direct image URL"
                >
                  <LinkIcon className="h-3 w-3" />
                  URL
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3" align="start">
                <p className="text-xs font-semibold mb-2">Paste Image URL</p>
                <div className="flex gap-1.5">
                  <Input
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyUrl}
                    className="h-8 px-2.5 bg-accent text-white hover:bg-accent-hover"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Bengali Name Pill */}
        {nameBn && (
          <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {nameBn}
          </span>
        )}
      </div>

      {/* Author Name */}
      <h3 className="mb-1.5 font-display text-2xl font-bold leading-tight text-foreground">
        {displayName}
      </h3>

      {/* Lifespan */}
      {dateLifespan && (
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-accent" />
          <span>{dateLifespan}</span>
        </p>
      )}

      {/* Bio */}
      <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {displayBio}
      </p>

      {/* Footer Meta */}
      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-text-secondary">
        <span>Catalog Slug</span>
        <span className="font-mono text-accent">Auto Generated</span>
      </div>
    </div>
  );
}
