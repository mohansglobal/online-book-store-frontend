"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, User as UserIcon } from "lucide-react";
import { ReviewRatingStars } from "./review-rating-stars";
import type { Review } from "../types/review.types";
import { resolveCoverUrl } from "@/lib/image-url";

type ReviewItemProps = {
  review: Review;
};

export function ReviewItem({ review }: ReviewItemProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const reviewerName = review.user?.name || "Customer";
  const avatarUrl = review.user?.profilePicture || review.user?.avatar;

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

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

      {/* Images Gallery */}
      {Array.isArray(review.images) && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {review.images.map((imgUrl, index) => {
            const resolved = resolveCoverUrl(imgUrl);
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(resolved)}
                className="group relative size-14 overflow-hidden rounded-lg border border-border bg-muted/20 transition-all hover:scale-105 hover:border-accent cursor-pointer"
              >
                <Image
                  src={resolved}
                  alt={`Review photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in-0 duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-xl bg-background border border-border shadow-2xl"
          >
            <div className="relative h-[65vh] w-[65vw] max-w-2xl">
              <Image
                src={activeImage}
                alt="Review photo full preview"
                fill
                className="object-contain p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black transition-colors"
              aria-label="Close image preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
