"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReviewRatingStars } from "./review-rating-stars";
import { ReviewImageUploader } from "./review-image-uploader";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../hooks/use-reviews";
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
  const [existingImages, setExistingImages] = useState<string[]>(
    Array.isArray(initialReview?.images) ? initialReview.images : []
  );
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();

  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;
  const isEditing = Boolean(initialReview?._id);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setTitle(initialReview.title || "");
      setReview(initialReview.review || "");
      setExistingImages(Array.isArray(initialReview.images) ? initialReview.images : []);
    } else {
      setRating(initialRating || 5);
      setTitle("");
      setReview("");
      setExistingImages([]);
    }
  }, [initialReview, initialRating]);

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

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
      if (isEditing && initialReview?._id) {
        const response = await updateReviewMutation.mutateAsync({
          reviewId: initialReview._id,
          bookId,
          rating,
          title: title.trim() || undefined,
          review: review.trim(),
          existingImages,
          images: images.length > 0 ? images : undefined,
        });

        toast.success(response.message || "Review updated successfully!");
        onSuccess();
      } else {
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
      }
    } catch (err) {
      if (isApiClientError(err)) {
        const msg = err.message || (isEditing ? "Failed to update review. Please try again." : "Failed to submit review. Please try again.");
        setError(msg);
        toast.error(msg);
      } else {
        const msg = isEditing ? "Failed to update review. Please try again." : "Failed to submit review. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full justify-between space-y-2.5 animate-in p-0.5 fade-in-50 duration-200 overflow-hidden"
    >
      {/* Header: Title + Stars + Close Button */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 shrink-0">
        <div className="flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {isEditing ? "Edit Your Review" : "Write Review"}
          </h4>
          {sellerName && (
            <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
              {sellerName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ReviewRatingStars
            value={rating}
            onChange={setRating}
            interactive
            size={18}
          />
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Review Title (Normal Input Height) */}
      <div className="shrink-0 ">
        <Input
          id="review-title"
          placeholder="Title (e.g. Crisp condition, fast delivery)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="h-9 text-xs"
        />
      </div>

      {/* Review Comments (Normal Textarea Height) */}
      <div className="flex-1 min-h-0">
        <Textarea
          id="review-body"
          placeholder="Share your experience (print, paper quality, binding)..."
          rows={2}
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
            if (error) setError(null);
          }}
          disabled={isSubmitting}
          className="h-full min-h-[68px] text-xs resize-none"
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-destructive leading-tight shrink-0" role="alert">
          {error}
        </p>
      )}

      {/* Inline Bottom Row: Photo Uploader (Left) + Actions (Right) */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 shrink-0">
        <div className="flex-1 overflow-hidden min-w-0">
          <ReviewImageUploader
            files={images}
            onChange={setImages}
            existingImages={existingImages}
            onRemoveExisting={handleRemoveExistingImage}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-8 px-2.5 text-xs text-muted-foreground "
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !review.trim()}
            className="h-8 bg-accent font-semibold text-white hover:bg-accent-hover px-3.5 text-xs shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isEditing ? (
              <div className="flex items-center gap-1.5">
                <Check size={12} />
                <span>Update</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Send size={12} />
                <span>Submit</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
