"use client";

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
import type { EligibleSeller, Review } from "../types/review.types";

type ReviewRatingSummaryProps = {
  bookId: string;
  sellerId?: string;
  sellerName?: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  isWritingReview: boolean;
  selectedInitialRating?: number;
  canReview: boolean;
  hasPurchased: boolean;
  hasDelivered: boolean;
  existingReview?: Review | null;
  primaryEligibleSeller?: EligibleSeller;
  isLoggedIn: boolean;
  onOpenReviewForm: (initialRating?: number) => void;
  onCloseReviewForm: () => void;
};

export function ReviewRatingSummary({
  bookId,
  sellerId,
  sellerName,
  averageRating,
  totalReviews,
  reviews,
  isWritingReview,
  selectedInitialRating = 5,
  canReview,
  hasPurchased,
  hasDelivered,
  existingReview,
  primaryEligibleSeller,
  isLoggedIn,
  onOpenReviewForm,
  onCloseReviewForm,
}: ReviewRatingSummaryProps) {
  // If user is writing/editing a review, show the compact ReviewForm right inside this 25% sidebar
  if (isWritingReview) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface/60 shadow-xs">
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

  // Calculate distribution for 1..5 stars
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (star >= 1 && star <= 5) {
      starCounts[star] = (starCounts[star] || 0) + 1;
    }
  });

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-surface/60 p-4 sm:p-5 shadow-xs">
      {/* Average Score Header */}
      <div className="space-y-2 border-b border-border/60 pb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Customer Rating
        </h4>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {averageRating > 0 ? averageRating.toFixed(1) : "-"}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            out of 5.0
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ReviewRatingStars value={Math.round(averageRating)} size={16} />
          <span className="text-xs text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {/* 5-Star Breakdown Bars */}
      <div className="space-y-2 border-b border-border/60 pb-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = starCounts[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-11 font-medium text-muted-foreground flex items-center gap-0.5 shrink-0">
                {star} <Star size={11} className="fill-amber-400 text-amber-400" />
              </span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-right font-mono text-[11px] text-muted-foreground shrink-0">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Star Giving / Review Action Area */}
      <div className="space-y-3 pt-1">
        {isLoggedIn && existingReview ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onOpenReviewForm(existingReview.rating)}
            className="w-full h-9 font-semibold text-xs border-accent/40 text-accent hover:bg-accent/10"
          >
            <Edit3 size={13} className="mr-1.5" />
            Edit Your Review
          </Button>
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium text-foreground">
              {isLoggedIn ? "Rate this product" : "Have you read this book?"}
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
        )}

        {/* Eligibility & Delivery Notices */}
        {isLoggedIn && (
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
        )}
      </div>
    </div>
  );
}
