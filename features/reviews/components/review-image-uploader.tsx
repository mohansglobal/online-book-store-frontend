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
  disabled?: boolean;
};

export function ReviewImageUploader({
  files,
  onChange,
  disabled = false,
}: ReviewImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const merged = [...files, ...validFiles].slice(0, MAX_IMAGES);
    if (files.length + validFiles.length > MAX_IMAGES) {
      toast.info(`Maximum of ${MAX_IMAGES} images allowed.`);
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
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={11} />
            </button>
          </div>
        );
      })}

      {files.length < MAX_IMAGES && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="h-8 px-2.5 gap-1.5 rounded-md border-dashed border-border/80 text-xs font-medium text-muted-foreground  shrink-0"
        >
          <ImagePlus size={14} />
          <span>{files.length === 0 ? "Add Photo" : "+"}</span>
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
