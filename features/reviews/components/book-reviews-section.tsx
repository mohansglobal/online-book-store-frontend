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

  const isBuyer = currentUser?.role === "BUYER";

  // Review eligibility query - only for logged-in buyers
  const { data: eligibilityResponse } = useReviewEligibility(bookId, {
    enabled: Boolean(currentUser && isBuyer),
  });
  const eligibility = eligibilityResponse?.data;

  const canReview = Boolean(isBuyer && eligibility?.canReview);
  const hasPurchased = Boolean(isBuyer && eligibility?.hasPurchased);
  const hasDelivered = Boolean(isBuyer && eligibility?.hasDelivered);
  const existingReview = eligibility?.existingReview;
  const primaryEligibleSeller = eligibility?.eligibleSellers?.[0];

  const effectiveSellerId = primaryEligibleSeller?.sellerId || fallbackSellerId;
  const effectiveSellerName = primaryEligibleSeller?.sellerName || book.seller?.name;

  // Authoritative aggregate rating statistics from backend book listing
  const backendAverageRating =
    book.averageRating !== undefined && book.averageRating !== null && book.averageRating > 0
      ? Number(book.averageRating)
      : typeof book.rating === "number"
        ? book.rating
        : parseFloat(String(book.rating || "0")) || 0;

  const totalReviewsCount =
    book.totalReviews ?? book.reviewCount ?? reviews.length;

  const totalRatingsCount =
    book.totalRatings ?? book.ratingCount ?? book.totalReviews ?? reviews.length;

  const fallbackReviewsAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  const averageRating =
    backendAverageRating > 0 ? backendAverageRating : fallbackReviewsAverage;

  const handleOpenReviewForm = (initialRating?: number) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    if (!isBuyer || !canReview) {
      return;
    }
    if (initialRating) {
      setSelectedInitialRating(initialRating);
    }
    setIsWritingReview(true);
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 items-stretch h-full w-full">
        {/* Left 60% Area: Customer Reviews List */}
        <div className="lg:col-span-3 space-y-4 lg:pr-8 flex flex-col h-full overflow-hidden">
          {/* Customer Reviews Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3 shrink-0">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Customer Reviews
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified buyer feedback and ratings ({totalReviewsCount})
              </p>
            </div>
          </div>

          {/* Customer Reviews Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
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
              <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-muted/20 space-y-3 my-auto">
                <div className="mx-auto size-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    No customer reviews yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Have you read or purchased this book? Share your thoughts and help other readers make a choice!
                  </p>
                </div>
                {!isWritingReview && isBuyer && canReview && (
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
        </div>

        {/* Right 40% Area: Rating Summary & Quick Star Giving Widget / Compact Review Form (Fixed, non-scrollable) */}
        <div className="lg:col-span-2 lg:border-l lg:border-border/60 lg:pl-8 flex flex-col h-full overflow-hidden">
          <ReviewRatingSummary
            bookId={bookId}
            sellerId={effectiveSellerId}
            sellerName={effectiveSellerName}
            averageRating={averageRating}
            totalRatings={totalRatingsCount}
            totalReviews={totalReviewsCount}
            ratingBreakdown={book.ratingBreakdown}
            ratingPercentages={book.ratingPercentages}
            reviews={reviews}
            isWritingReview={isWritingReview}
            selectedInitialRating={selectedInitialRating}
            canReview={canReview}
            hasPurchased={hasPurchased}
            hasDelivered={hasDelivered}
            existingReview={existingReview}
            primaryEligibleSeller={primaryEligibleSeller}
            isLoggedIn={Boolean(currentUser)}
            isBuyer={Boolean(isBuyer)}
            onOpenReviewForm={handleOpenReviewForm}
            onCloseReviewForm={() => setIsWritingReview(false)}
          />
        </div>
      </div>
    </div>
  );
}


