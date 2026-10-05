"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type ReviewImageUploaderProps = {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  disabled?: boolean;
};

export function ReviewImageUploader({
  files,
  onChange,
  existingImages = [],
  onRemoveExisting,
  disabled = false,
}: ReviewImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalCount = existingImages.length + files.length;
  const remainingSlots = Math.max(0, MAX_IMAGES - existingImages.length);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} is too large (max 5MB).`);
        continue;
      }
      validFiles.push(file);
    }

    const merged = [...files, ...validFiles].slice(0, remainingSlots);
    if (files.length + validFiles.length > remainingSlots) {
      toast.info(`Maximum of ${MAX_IMAGES} total images allowed.`);
    }

    onChange(merged);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    onChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
      {/* Existing Server Images (when editing) */}
      {existingImages.map((url, index) => (
        <div
          key={`existing-${url}-${index}`}
          className="group relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30"
        >
          <Image
            src={url}
            alt={`Existing upload ${index + 1}`}
            fill
            sizes="36px"
            className="object-cover"
          />
          {onRemoveExisting && (
            <button
              type="button"
              onClick={() => onRemoveExisting(url)}
              disabled={disabled}
              aria-label={`Remove existing photo ${index + 1}`}
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={11} />
            </button>
          )}
        </div>
      ))}

      {/* Newly Selected Local Files */}
      {files.map((file, index) => {
        const previewUrl = URL.createObjectURL(file);

        return (
          <div
            key={`${file.name}-${index}`}
            className="group relative size-9 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30"
          >
            <Image
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              disabled={disabled}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={11} />
            </button>
          </div>
        );
      })}

      {totalCount < MAX_IMAGES && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="h-8 px-2.5 gap-1.5 rounded-md border-dashed border-border/80 text-xs font-medium text-muted-foreground shrink-0 cursor-pointer"
        >
          <ImagePlus size={14} />
          <span>{totalCount === 0 ? "Add Photo" : "+"}</span>
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}
