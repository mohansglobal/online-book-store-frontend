"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Average",
  4: "Good",
  5: "Excellent",
};

type ReviewRatingStarsProps = {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
  showLabel?: boolean;
  className?: string;
};

export function ReviewRatingStars({
  value,
  onChange,
  size = 16,
  interactive = false,
  showLabel = false,
  className,
}: ReviewRatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const activeRating = hovered !== null ? hovered : value;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= activeRating;

          if (interactive && onChange) {
            return (
              <button
                key={starNumber}
                type="button"
                aria-label={`Rate ${starNumber} out of 5 stars - ${RATING_LABELS[starNumber]}`}
                onClick={() => onChange(starNumber)}
                onMouseEnter={() => setHovered(starNumber)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer p-0.5 text-zinc-300 transition-transform hover:scale-110 focus:outline-none dark:text-zinc-700"
              >
                <Star
                  size={size}
                  className={cn(
                    "transition-colors",
                    isFilled
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-300 dark:text-zinc-600",
                  )}
                />
              </button>
            );
          }

          return (
            <Star
              key={starNumber}
              size={size}
              className={cn(
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-300 dark:text-zinc-700",
              )}
            />
          );
        })}
      </div>

      {showLabel && activeRating > 0 && (
        <span className="text-xs font-medium text-muted-foreground">
          {RATING_LABELS[activeRating] || ""}
        </span>
      )}
    </div>
  );
}
