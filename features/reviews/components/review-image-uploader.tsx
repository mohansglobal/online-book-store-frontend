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
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {files.map((file, index) => {
          const previewUrl = URL.createObjectURL(file);

          return (
            <div
              key={`${file.name}-${index}`}
              className="group relative size-14 overflow-hidden rounded-lg border border-border bg-muted/30"
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
                className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white opacity-90 transition-opacity hover:bg-destructive hover:opacity-100"
              >
                <X size={12} />
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
            className="h-14 w-20 flex-col gap-1 rounded-lg border-dashed border-border/80 text-[11px] font-medium text-muted-foreground hover:border-accent hover:text-accent"
          >
            <ImagePlus size={15} />
            <span>Add Photo</span>
          </Button>
        )}
      </div>

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
