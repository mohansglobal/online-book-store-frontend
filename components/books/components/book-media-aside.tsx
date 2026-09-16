"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { Book, Loader2, Lock, Plus, Trash2 } from "lucide-react";

interface BookMediaAsideProps {
  isBookFound: boolean;
  coverPreview: string | null;
  isUploadingCover?: boolean;
  onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCoverRemove: () => void;
  extraPreviews: string[];
  isUploadingGallery?: boolean;
  onExtraImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExtraImageRemove: (index: number) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary";

export function BookMediaAside({
  isBookFound,
  coverPreview,
  isUploadingCover = false,
  onCoverChange,
  onCoverRemove,
  extraPreviews,
  isUploadingGallery = false,
  onExtraImagesChange,
  onExtraImageRemove,
}: BookMediaAsideProps) {
  return (
    <aside className="sticky top-24 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-4">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Cover Image
        </h2>
        <p className="text-sm text-text-secondary">
          {isBookFound
            ? "Canonical book cover from catalog."
            : "Upload or review the book cover."}
        </p>
      </div>

      <div
        className={`group relative mb-6 flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface-soft p-6 text-center transition-colors ${isBookFound
            ? "cursor-default opacity-90"
            : isUploadingCover
              ? "cursor-wait opacity-80 border-accent"
              : "cursor-pointer hover:border-accent"
          }`}
      >
        {isUploadingCover ? (
          <div className="flex flex-col items-center gap-3 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-xs font-medium text-foreground">
              Uploading...
            </p>
          </div>
        ) : coverPreview ? (
          <>
            <Image
              src={coverPreview}
              alt="Cover preview"
              fill
              unoptimized
              className="object-cover"
            />
            {!isBookFound && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCoverRemove();
                }}
                className="absolute top-2 right-2 z-10 rounded-full bg-rose-600 p-1.5 text-white shadow-md hover:bg-rose-700"
                title="Remove cover"
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        ) : (
          <>
            <div className="mb-3 rounded-xl border border-border bg-surface p-3.5 shadow-xs">
              <Book className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Upload book cover, or{" "}
              <span className="font-semibold text-accent underline">browse</span>
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Recommended:{" "}
              <span className="font-medium text-foreground">
                1600 × 2400 px
              </span>{" "}
              (2:3 ratio)
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80">
              JPG, PNG, WEBP (Max 5MB)
            </p>
            <input
              type="file"
              name="cover"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload book cover"
              disabled={isBookFound || isUploadingCover}
              onChange={onCoverChange}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={LABEL_CLASS}>Gallery Images</span>
          <span className="text-[11px] text-muted-foreground">
            {extraPreviews.length}/4
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {extraPreviews.map((src, idx) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-soft"
            >
              <Image
                src={src}
                alt={`Extra ${idx + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onExtraImageRemove(idx)}
                className="absolute top-1 right-1 rounded-full bg-rose-600/80 p-0.5 text-white hover:bg-rose-700"
                title="Remove image"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}

          {isUploadingGallery && (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-accent bg-accent/5">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          )}

          {!isUploadingGallery && extraPreviews.length < 4 && (
            <label
              className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-surface-soft transition-colors hover:border-accent hover:bg-surface-hover"
              title="Add gallery image"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onExtraImagesChange}
              />
            </label>
          )}
        </div>
        {isBookFound && (
          <p className="text-[11px] text-muted-foreground">
            You can add extra photos (e.g. book condition, pages) for your listing.
          </p>
        )}
      </div>
    </aside>
  );
}
