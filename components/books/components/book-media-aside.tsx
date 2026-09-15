"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { Book, Lock, Plus, Trash2 } from "lucide-react";

interface BookMediaAsideProps {
  isBookFound: boolean;
  coverPreview: string | null;
  onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCoverRemove: () => void;
  extraPreviews: string[];
  onExtraImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExtraImageRemove: (index: number) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary";

export function BookMediaAside({
  isBookFound,
  coverPreview,
  onCoverChange,
  onCoverRemove,
  extraPreviews,
  onExtraImagesChange,
  onExtraImageRemove,
}: BookMediaAsideProps) {
  return (
    <aside className="sticky top-24 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8 lg:col-span-4">
      <div className="mb-6 border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="mb-1 text-lg font-semibold text-foreground">
            Cover Image
          </h2>
          {/* {isBookFound && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock size={10} />
              Locked
            </span>
          )} */}
        </div>
        <p className="text-sm text-text-secondary">
          {isBookFound
            ? "Canonical book cover from catalog."
            : "Upload or review the book cover."}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`group relative mb-6 flex aspect-[2/3] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-surface-soft p-6 text-center transition-colors ${isBookFound
          ? "cursor-default opacity-90"
          : "cursor-pointer hover:border-accent"
          }`}
      >
        {coverPreview ? (
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
              disabled={isBookFound}
              onChange={onCoverChange}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </>
        )}
      </div>

      {/* Additional Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={LABEL_CLASS}>Gallery Images</span>
          {isBookFound && extraPreviews.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Lock size={10} /> Locked
            </span>
          )}
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
              {!isBookFound && (
                <button
                  type="button"
                  onClick={() => onExtraImageRemove(idx)}
                  className="absolute top-1 right-1 rounded-full bg-rose-600/80 p-0.5 text-white hover:bg-rose-700"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          ))}

          {!isBookFound && extraPreviews.length < 3 && (
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
      </div>
    </aside>
  );
}
