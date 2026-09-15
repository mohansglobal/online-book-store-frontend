"use client";

import Image from "next/image";
import {
  Edit3,
  MessageSquarePlus,
  PackageCheck,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewRatingStars } from "./review-rating-stars";
import { ReviewForm } from "./review-form";
import ratingIllustration from "@/assets/rating.png";
import type { EligibleSeller, Review } from "../types/review.types";
import type {
  RatingBreakdown,
  RatingPercentages,
} from "@/features/books/types/book.types";

type ReviewRatingSummaryProps = {
  bookId: string;
  sellerId?: string;
  sellerName?: string;
  averageRating: number;
  totalRatings?: number;
  totalReviews: number;
  ratingBreakdown?: RatingBreakdown;
  ratingPercentages?: RatingPercentages;
  reviews: Review[];
  isWritingReview: boolean;
  selectedInitialRating?: number;
  canReview: boolean;
  hasPurchased: boolean;
  hasDelivered: boolean;
  existingReview?: Review | null;
  primaryEligibleSeller?: EligibleSeller;
  isLoggedIn: boolean;
  isBuyer?: boolean;
  onOpenReviewForm: (initialRating?: number) => void;
  onCloseReviewForm: () => void;
};

export function ReviewRatingSummary({
  bookId,
  sellerId,
  sellerName,
  averageRating,
  totalRatings,
  totalReviews,
  ratingBreakdown,
  ratingPercentages,
  reviews,
  isWritingReview,
  selectedInitialRating = 5,
  canReview,
  hasPurchased,
  hasDelivered,
  existingReview,
  primaryEligibleSeller,
  isLoggedIn,
  isBuyer = false,
  onOpenReviewForm,
  onCloseReviewForm,
}: ReviewRatingSummaryProps) {
  // If user is writing/editing a review, show the compact ReviewForm right inside this 40% sidebar
  if (isWritingReview) {
    return (
      <div className="w-full h-full overflow-hidden">
        <ReviewForm
          bookId={bookId}
          sellerId={sellerId}
          sellerName={sellerName}
          initialReview={existingReview}
          initialRating={selectedInitialRating}
          onSuccess={onCloseReviewForm}
          onCancel={onCloseReviewForm}
        />
      </div>
    );
  }

  const effectiveTotalRatings =
    totalRatings !== undefined ? totalRatings : totalReviews;

  // Calculate fallback distribution for 1..5 stars from reviews list if backend breakdown is not provided
  const fallbackStarCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (star >= 1 && star <= 5) {
      fallbackStarCounts[star] = (fallbackStarCounts[star] || 0) + 1;
    }
  });

  return (
    <div className="flex flex-col h-full w-full overflow-hidden justify-between">
      {/* Rating Overview & 5-Star Breakdown (Compact Side-by-Side) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 border-b border-border/60 pb-3 shrink-0">
        {/* Compact Left: Average Score & Stars */}
        <div className="space-y-1 shrink-0 min-w-[115px]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Customer Rating
          </h4>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              {averageRating > 0 ? averageRating.toFixed(1) : "-"}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              / 5.0
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ReviewRatingStars value={Math.round(averageRating)} size={14} />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {effectiveTotalRatings} {effectiveTotalRatings === 1 ? "rating" : "ratings"}
          </p>
        </div>

        {/* Right: 5-Star Breakdown Bars */}
        <div className="flex-1 w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingBreakdown?.[star] ?? fallbackStarCounts[star] ?? 0;
            const percentage =
              ratingPercentages?.[star] !== undefined
                ? ratingPercentages[star]
                : effectiveTotalRatings > 0
                  ? Math.round((count / effectiveTotalRatings) * 100)
                  : 0;

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-10 font-medium text-muted-foreground flex items-center gap-0.5 shrink-0 text-[11px]">
                  {star} <Star size={10} className="fill-amber-400 text-amber-400" />
                </span>

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-7 text-right font-mono text-[10px] text-muted-foreground shrink-0">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Star Giving / Review Action Area (for verified buyers) OR Decorative illustration (for non-buyers) */}
      {isLoggedIn && isBuyer && (existingReview || canReview || (hasPurchased && !hasDelivered)) ? (
        <div className="space-y-3 pt-2">
          {existingReview ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenReviewForm(existingReview.rating)}
              className="w-full h-9 font-semibold text-xs border-accent/40 text-accent "
            >
              <Edit3 size={13} className="mr-1.5" />
              Edit Your Review
            </Button>
          ) : canReview ? (
            <div className="space-y-2 text-center">
              <p className="text-xs font-medium text-foreground">
                Rate this product
              </p>

              {/* Interactive Star Giving Shortcut */}
              <div className="flex justify-center py-1">
                <ReviewRatingStars
                  value={0}
                  onChange={(selectedStar) => onOpenReviewForm(selectedStar)}
                  interactive
                  size={22}
                />
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => onOpenReviewForm(5)}
                className="w-full h-9 bg-accent font-semibold text-white hover:bg-accent-hover shadow-xs text-xs"
              >
                <MessageSquarePlus size={14} className="mr-1.5" />
                Write a Review
              </Button>
            </div>
          ) : null}

          {/* Eligibility & Delivery Notices */}
          <div className="space-y-2 pt-1 text-[11px]">
            {hasPurchased && !hasDelivered && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-700 dark:text-amber-300">
                <Truck size={14} className="shrink-0 text-amber-500 mt-0.5" />
                <span>
                  Order in progress. Review unlocks upon delivery.
                </span>
              </div>
            )}

            {canReview && primaryEligibleSeller && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-700 dark:text-emerald-300">
                <PackageCheck size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                <span>
                  Verified delivery from <strong>{primaryEligibleSeller.sellerName}</strong>.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Non-buyer rating illustration (Bigger, fills remaining vertical/horizontal area without scroll) */
        <div className="relative flex-1 w-full min-h-0 overflow-hidden flex items-center justify-center my-auto">
          <Image
            src={ratingIllustration}
            alt="Customer ratings and reviews"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-contain scale-100 pointer-events-none select-none drop-shadow-xs"
            priority
          />
        </div>
      )}
    </div>
  );
}
