"use client";

import { useEffect, useMemo, useState } from "react";
import { calculatePriceBounds } from "../utils/price-bounds";
import type { CatalogBook } from "@/features/books/types/book.types";

export interface UseVisiblePriceBoundsProps {
  books: CatalogBook[];
  minPrice?: number;
  maxPrice?: number;
  contextKey: string;
}

export function useVisiblePriceBounds({
  books,
  minPrice,
  maxPrice,
  contextKey,
}: UseVisiblePriceBoundsProps) {
  // Store baseline unfiltered price bounds for current context
  const [baselineBounds, setBaselineBounds] = useState<{
    minLimit: number;
    maxLimit: number;
  } | null>(null);

  const [lastContextKey, setLastContextKey] = useState(contextKey);

  // When context filters (search, author, publisher, category) change, reset baseline
  if (contextKey !== lastContextKey) {
    setLastContextKey(contextKey);
    setBaselineBounds(null);
  }

  // Record baseline range whenever unfiltered books are visible
  useEffect(() => {
    const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

    if (!hasPriceFilter && books.length > 0) {
      const calculated = calculatePriceBounds(books);

      if (calculated.hasBooks) {
        setBaselineBounds({
          minLimit: calculated.minLimit,
          maxLimit: calculated.maxLimit,
        });
      }
    }
  }, [books, minPrice, maxPrice]);

  // Derived effective minLimit and maxLimit for the slider track
  const limits = useMemo(() => {
    const visibleBounds = calculatePriceBounds(books);

    const baseMin = baselineBounds?.minLimit ?? visibleBounds.minLimit;
    const baseMax = baselineBounds?.maxLimit ?? visibleBounds.maxLimit;

    // Ensure the track accommodates any active user filter
    const effectiveMin =
      minPrice !== undefined ? Math.min(baseMin, minPrice) : baseMin;

    const effectiveMax =
      maxPrice !== undefined ? Math.max(baseMax, maxPrice) : baseMax;

    return {
      minLimit: effectiveMin,
      maxLimit: effectiveMax,
    };
  }, [books, baselineBounds, minPrice, maxPrice]);

  return limits;
}
