"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";

export interface BookDetailsGalleryProps {
  title: string;
  images: string[];
  formatLabel: string;
  onOpenPreview: () => void;
}

export function BookDetailsGallery({
  title,
  images,
  formatLabel,
  onOpenPreview,
}: BookDetailsGalleryProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const rawActive = images[selectedThumbnail] || images[0] || FALLBACK_BOOK_COVER;
  const [activeImage, setActiveImage] = useState(rawActive);

  useEffect(() => {
    setActiveImage(images[selectedThumbnail] || images[0] || FALLBACK_BOOK_COVER);
  }, [images, selectedThumbnail]);

  const handleThumbnailChange = (index: number) => {
    if (index === selectedThumbnail || index < 0 || index >= images.length) return;
    setSelectedThumbnail(index);
  };

  const handlePreviousImage = () => {
    const nextIndex = (selectedThumbnail - 1 + images.length) % images.length;
    handleThumbnailChange(nextIndex);
  };

  const handleNextImage = () => {
    const nextIndex = (selectedThumbnail + 1) % images.length;
    handleThumbnailChange(nextIndex);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="group relative w-full max-w-[280px]">
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-accent/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 bg-black/5 shadow-book">
          <div className="relative h-full w-full">
            <Image
              src={activeImage}
              alt={`${title} cover`}
              fill
              priority={selectedThumbnail === 0}
              sizes="280px"
              onError={() => setActiveImage(FALLBACK_BOOK_COVER)}
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />
          </div>

          {/* Book Spine Shadow */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/20 via-white/10 to-transparent" />

          {/* Navigation Arrows for multi-image gallery */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePreviousImage}
                aria-label="Previous book cover"
                className="absolute top-1/2 left-2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70 active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next book cover"
                className="absolute top-1/2 right-2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70 active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Format Badge */}
          <div className="pointer-events-none absolute bottom-2 left-2 z-10 flex gap-1.5">
            <span className="rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white uppercase backdrop-blur-md">
              {formatLabel || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((imgSrc, index) => (
            <button
              key={`${imgSrc}-${index}`}
              type="button"
              onClick={() => handleThumbnailChange(index)}
              aria-label={`View cover ${index + 1}`}
              aria-pressed={selectedThumbnail === index}
              className={`relative h-16 w-12 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                selectedThumbnail === index
                  ? "scale-105 border-accent shadow-sm ring-2 ring-accent/30"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={imgSrc}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Look Inside Modal Trigger */}
      <button
        type="button"
        onClick={onOpenPreview}
        className="mt-4 flex h-9 w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background text-xs font-medium transition-colors hover:border-primary"
      >
        <BookOpen size={14} className="text-accent" />
        Look Inside
      </button>
    </div>
  );
}
