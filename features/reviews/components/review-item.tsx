"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  X,
} from "lucide-react";
import { ReviewRatingStars } from "./review-rating-stars";
import type { Review } from "../types/review.types";
import { resolveCoverUrl } from "@/lib/image-url";

type ReviewItemProps = {
  review: Review;
};

export function ReviewItem({ review }: ReviewItemProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const reviewerName = review.user?.name || "Customer";
  const avatarUrl = review.user?.profilePicture || review.user?.avatar;

  const imagesList = Array.isArray(review.images)
    ? review.images.map((img) => resolveCoverUrl(img))
    : [];

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Lock background scroll when modal is open
  useEffect(() => {
    if (activeImageIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeImageIndex]);

  // Keyboard navigation (Escape to close, Left/Right arrows to cycle)
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : imagesList.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev !== null && prev < imagesList.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, imagesList.length]);

  return (
    <article className="border-b border-border/60 pb-5 pt-1 space-y-2.5 last:border-b-0">
      {/* Header: User & Rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/60">
            {avatarUrl ? (
              <Image
                src={resolveCoverUrl(avatarUrl)}
                alt={reviewerName}
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon size={15} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-foreground">
                {reviewerName}
              </span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={10} />
                  Verified Purchase
                </span>
              )}
            </div>

            {formattedDate && (
              <time
                dateTime={review.createdAt}
                className="text-[11px] text-muted-foreground"
              >
                Reviewed on {formattedDate}
              </time>
            )}
          </div>
        </div>

        <ReviewRatingStars value={review.rating} size={14} />
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="text-xs font-semibold text-foreground leading-snug">
          {review.title}
        </h5>
      )}

      {/* Review text */}
      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
        {review.review}
      </p>

      {/* Images Gallery Thumbnails */}
      {imagesList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {imagesList.map((resolvedImg, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className="group relative size-14 overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:scale-105 hover:border-accent cursor-pointer"
            >
              <Image
                src={resolvedImg}
                alt={`Review photo ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Carousel Image Preview Modal */}
      {activeImageIndex !== null && imagesList[activeImageIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in-0 duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-background/95 border border-border/80 shadow-2xl p-3 sm:p-4"
          >
            {/* Modal Top Bar: Photo Counter & Close */}
            <div className="flex w-full items-center justify-between pb-2 text-xs font-medium text-muted-foreground border-b border-border/40">
              <span>
                Photo {activeImageIndex + 1} of {imagesList.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveImageIndex(null)}
                className="rounded-full bg-muted/80 p-1 text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close image preview"
              >
                <X size={16} />
              </button>
            </div>

            {/* Main Image Stage with Carousel Navigation */}
            <div className="relative h-[55vh] sm:h-[65vh] w-[75vw] max-w-2xl flex items-center justify-center my-2">
              <Image
                src={imagesList[activeImageIndex]}
                alt={`Review photo ${activeImageIndex + 1}`}
                fill
                priority
                className="object-contain select-none"
              />

              {/* Previous Button */}
              {imagesList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : imagesList.length - 1
                    );
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-all shadow-md cursor-pointer hover:scale-110"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Next Button */}
              {imagesList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) =>
                      prev !== null && prev < imagesList.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-all shadow-md cursor-pointer hover:scale-110"
                  aria-label="Next photo"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip for Multi-Picture Posts */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar max-w-full">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative size-11 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer ${
                      idx === activeImageIndex
                        ? "border-accent ring-2 ring-accent/30 scale-105"
                        : "border-border/60 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
