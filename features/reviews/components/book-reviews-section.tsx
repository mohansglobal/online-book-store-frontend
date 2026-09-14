"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewItem } from "./review-item";
import { ReviewRatingSummary } from "./review-rating-summary";
import {
  extractReviewsList,
  useBookReviews,
  useReviewEligibility,
} from "../hooks/use-reviews";
import { useCurrentUser, useRequireAuth } from "@/features/auth";
import type { ApiBook } from "@/features/books/types/book.types";

type BookReviewsSectionProps = {
  book: ApiBook;
};

export function BookReviewsSection({ book }: BookReviewsSectionProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedInitialRating, setSelectedInitialRating] = useState<number>(5);
  const { redirectToLogin } = useRequireAuth();
  const { data: currentUser } = useCurrentUser();

  const bookId = book._id || book.listingId || "";
  const fallbackSellerId = book.seller?._id || book.createdBy;

  const { data: reviewsResponse, isLoading } = useBookReviews(bookId);
  const reviews = extractReviewsList(reviewsResponse?.data);

  // Review eligibility query
  const { data: eligibilityResponse } = useReviewEligibility(bookId, {
    enabled: Boolean(currentUser),
  });
  const eligibility = eligibilityResponse?.data;

  const canReview = Boolean(eligibility?.canReview);
  const hasPurchased = Boolean(eligibility?.hasPurchased);
  const hasDelivered = Boolean(eligibility?.hasDelivered);
  const existingReview = eligibility?.existingReview;
  const primaryEligibleSeller = eligibility?.eligibleSellers?.[0];

  const effectiveSellerId = primaryEligibleSeller?.sellerId || fallbackSellerId;
  const effectiveSellerName = primaryEligibleSeller?.sellerName || book.seller?.name;

  // Compute average rating and count
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : typeof book.rating === "number"
        ? book.rating
        : parseFloat(String(book.rating || "0")) || 0;

  const handleOpenReviewForm = (initialRating?: number) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    if (initialRating) {
      setSelectedInitialRating(initialRating);
    }
    setIsWritingReview(true);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 75% Area: Customer Reviews List */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Customer Reviews Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Customer Reviews
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified buyer feedback and ratings ({totalReviews})
              </p>
            </div>
          </div>

          {/* Customer Reviews Content */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
              Loading customer reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((item) => (
                <ReviewItem key={item._id} review={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-10 text-center bg-muted/20 space-y-3">
              <div className="mx-auto size-11 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  No customer reviews yet
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Have you read or purchased this book? Share your thoughts and help other readers make a choice!
                </p>
              </div>
              {!isWritingReview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenReviewForm(5)}
                  className="h-8 text-xs font-semibold hover:border-accent hover:text-accent mt-2"
                >
                  Write the First Review
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right 25% Area: Rating Summary & Quick Star Giving Widget / Compact Review Form */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
          <ReviewRatingSummary
            bookId={bookId}
            sellerId={effectiveSellerId}
            sellerName={effectiveSellerName}
            averageRating={averageRating}
            totalReviews={totalReviews}
            reviews={reviews}
            isWritingReview={isWritingReview}
            selectedInitialRating={selectedInitialRating}
            canReview={canReview}
            hasPurchased={hasPurchased}
            hasDelivered={hasDelivered}
            existingReview={existingReview}
            primaryEligibleSeller={primaryEligibleSeller}
            isLoggedIn={Boolean(currentUser)}
            onOpenReviewForm={handleOpenReviewForm}
            onCloseReviewForm={() => setIsWritingReview(false)}
          />
        </div>
      </div>
    </div>
  );
}


