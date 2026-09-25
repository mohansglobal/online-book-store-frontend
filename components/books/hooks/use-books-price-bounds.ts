"use client";

import { useMemo } from "react";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  calculatePriceBounds,
  DEFAULT_PRICE_MAX,
  DEFAULT_PRICE_MIN,
} from "../utils/price-bounds";

export interface UseBooksPriceBoundsProps {
  search?: string;
  author?: string;
  publisher?: string;
  category?: string;
  activeMinPrice?: number;
  activeMaxPrice?: number;
  fallbackBooks?: unknown[];
}

export function useBooksPriceBounds({
  search,
  author,
  publisher,
  category,
  activeMinPrice,
  activeMaxPrice,
  fallbackBooks,
}: UseBooksPriceBoundsProps) {
  const cleanSearch = search?.trim() || undefined;

  // Query books matching the non-price filter criteria
  // This query intentionally omits minPrice and maxPrice so the range limits
  // remain stable and do not shrink when the user adjusts the price slider
  const { data: contextResponse, isLoading } = useBooks({
    search: cleanSearch,
    author: author || undefined,
    publisher: publisher || undefined,
    category: category || undefined,
    limit: 100,
  });

  const bounds = useMemo(() => {
    const contextBooks = contextResponse?.data;

    // Use context query results for accurate catalog bounds
    if (Array.isArray(contextBooks) && contextBooks.length > 0) {
      return calculatePriceBounds(contextBooks);
    }

    // Fall back to current page books if context query is not yet available
    if (Array.isArray(fallbackBooks) && fallbackBooks.length > 0) {
      return calculatePriceBounds(fallbackBooks);
    }

    return {
      minLimit: DEFAULT_PRICE_MIN,
      maxLimit: DEFAULT_PRICE_MAX,
      hasBooks: false,
    };
  }, [contextResponse?.data, fallbackBooks]);

  // Ensure any active filter value in the URL stays within the track range
  const minLimit = useMemo(() => {
    if (activeMinPrice !== undefined) {
      return Math.min(bounds.minLimit, activeMinPrice);
    }

    return bounds.minLimit;
  }, [bounds.minLimit, activeMinPrice]);

  const maxLimit = useMemo(() => {
    if (activeMaxPrice !== undefined) {
      return Math.max(bounds.maxLimit, activeMaxPrice);
    }

    return bounds.maxLimit;
  }, [bounds.maxLimit, activeMaxPrice]);

  return {
    minLimit,
    maxLimit,
    hasBooks: bounds.hasBooks,
    isLoading,
  };
}
