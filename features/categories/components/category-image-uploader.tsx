// Category image uploader with preview and file selection
"use client";

import React, { useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCategoryImage } from "@/components/categories/category-images";

interface CategoryImageUploaderProps {
  currentImageUrl?: string;
  categoryName: string;
  categorySlug: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function CategoryImageUploader({
  currentImageUrl,
  categoryName,
  categorySlug,
  selectedFile,
  onFileSelect,
  disabled = false,
}: CategoryImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived local object URL preview without synchronizing state in effect
  const localPreview = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  // Clean up object URL when changed or unmounted
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const fallbackAssetImage = getCategoryImage(categoryName, categorySlug, 0);
  const hasUploadedCustomImage = Boolean(currentImageUrl && currentImageUrl.trim() !== "");
  const displayImage = localPreview || (hasUploadedCustomImage ? currentImageUrl!.trim() : fallbackAssetImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  const handleClear = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">
          Category Image (Cloudinary)
        </Label>

        {selectedFile && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            New image selected ({Math.round(selectedFile.size / 1024)} KB)
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/20 p-3">
        {/* Preview Thumbnail */}
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-xs">
          <Image
            src={displayImage}
            alt={categoryName || "Category cover"}
            fill
            sizes="112px"
            className="object-cover"
          />

          {localPreview && (
            <div className="absolute top-1 left-1 rounded-sm bg-accent/90 px-1 py-0.5 text-[9px] font-semibold text-white backdrop-blur-xs">
              Preview
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-1 flex-col justify-center space-y-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
            id="category-file-input"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="h-8 cursor-pointer gap-1.5 rounded-lg text-xs shadow-none hover:bg-surface"
            >
              <UploadCloud size={14} />
              {selectedFile ? "Change File" : hasUploadedCustomImage ? "Replace Image" : "Upload Image"}
            </Button>

            {selectedFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={handleClear}
                className="h-8 cursor-pointer gap-1 rounded-lg px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <X size={13} />
                Revert
              </Button>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground">
            PNG, JPG or WEBP up to 5MB. Uploads directly to Cloudinary.
          </p>
        </div>
      </div>
    </div>
  );
}
