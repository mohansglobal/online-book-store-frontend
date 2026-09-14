"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReviewRatingStars } from "./review-rating-stars";
import { ReviewImageUploader } from "./review-image-uploader";
import { useCreateReviewMutation } from "../hooks/use-reviews";
import { isApiClientError } from "@/lib/api";

import type { Review } from "../types/review.types";

type ReviewFormProps = {
  bookId: string;
  sellerId?: string;
  sellerName?: string;
  initialReview?: Review | null;
  initialRating?: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ReviewForm({
  bookId,
  sellerId,
  sellerName,
  initialReview,
  initialRating,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || initialRating || 5);
  const [title, setTitle] = useState(initialReview?.title || "");
  const [review, setReview] = useState(initialReview?.review || "");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createReviewMutation = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    if (!review.trim()) {
      setError("Please write your review comments.");
      return;
    }

    setError(null);

    try {
      const response = await createReviewMutation.mutateAsync({
        bookId,
        sellerId,
        rating,
        title: title.trim() || undefined,
        review: review.trim(),
        images: images.length > 0 ? images : undefined,
      });

      toast.success(response.message || "Review submitted successfully!");
      onSuccess();
    } catch (err) {
      if (isApiClientError(err)) {
        const msg = err.message || "Failed to submit review. Please try again.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = "Failed to submit review. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border/80 bg-surface/50 p-4 sm:p-5 shadow-xs animate-in fade-in-50 duration-200"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {initialReview ? "Edit Your Review" : "Write a Customer Review"}
          </h4>
          {sellerName && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Purchased from <strong className="text-foreground font-medium">{sellerName}</strong>
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={createReviewMutation.isPending}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>

      {/* Rating selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Your Rating <span className="text-destructive">*</span>
        </Label>
        <div>
          <ReviewRatingStars
            value={rating}
            onChange={setRating}
            interactive
            showLabel
            size={22}
          />
        </div>
      </div>

      {/* Headline Title */}
      <div className="space-y-1.5">
        <Label htmlFor="review-title" className="text-xs font-medium text-foreground">
          Review Title <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="review-title"
          placeholder="e.g. Crisp condition and fast delivery"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={createReviewMutation.isPending}
          className="h-9 text-xs"
        />
      </div>

      {/* Review Comments */}
      <div className="space-y-1.5">
        <Label htmlFor="review-body" className="text-xs font-medium text-foreground">
          Your Review <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="review-body"
          placeholder="What did you like or dislike about this book? How was the print and binding quality?"
          rows={3}
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
            if (error) setError(null);
          }}
          disabled={createReviewMutation.isPending}
          className="resize-y text-xs min-h-[75px]"
        />
      </div>

      {/* Photos upload */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Attach Photos <span className="text-xs font-normal text-muted-foreground">(optional, max 5)</span>
        </Label>
        <ReviewImageUploader
          files={images}
          onChange={setImages}
          disabled={createReviewMutation.isPending}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={createReviewMutation.isPending}
          className="h-8 text-xs font-medium"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={createReviewMutation.isPending || !review.trim()}
          className="h-8 bg-accent font-semibold text-white hover:bg-accent-hover"
        >
          {createReviewMutation.isPending ? (
            <>
              <Loader2 size={13} className="mr-1.5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={13} className="mr-1.5" />
              Submit Review
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
