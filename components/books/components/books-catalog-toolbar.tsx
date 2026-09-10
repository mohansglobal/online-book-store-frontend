"use client";

import React from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookSortBy, BookSortOrder } from "@/features/books/types/book.types";

export type SortOption =
  | "newest"
  | "oldest"
  | "price_low_to_high"
  | "price_high_to_low"
  | "title-asc"
  | "title-desc"
  | "publicationDate";

export const SORT_MAP: Record<
  SortOption,
  { sortBy: BookSortBy; sortOrder?: BookSortOrder; label: string }
> = {
  newest: { sortBy: "createdAt", sortOrder: "desc", label: "Newest Arrivals" },
  oldest: { sortBy: "createdAt", sortOrder: "asc", label: "Oldest Arrivals" },
  price_low_to_high: {
    sortBy: "price_low_to_high",
    sortOrder: "asc",
    label: "Price: Low to High",
  },
  price_high_to_low: {
    sortBy: "price_high_to_low",
    sortOrder: "desc",
    label: "Price: High to Low",
  },
  "title-asc": { sortBy: "title", sortOrder: "asc", label: "Title: A to Z" },
  "title-desc": { sortBy: "title", sortOrder: "desc", label: "Title: Z to A" },
  publicationDate: {
    sortBy: "publicationDate",
    sortOrder: "desc",
    label: "Publication Date",
  },
};

export const VALID_SORTS: SortOption[] = [
  "newest",
  "oldest",
  "price_low_to_high",
  "price_high_to_low",
  "title-asc",
  "title-desc",
  "publicationDate",
];

export interface BooksCatalogToolbarProps {
  totalBooks: number;
  currentCount: number;
  currentPage: number;
  totalPages: number;
  activeFiltersCount: number;
  isBusy: boolean;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenMobileFilters: () => void;
}

export function BooksCatalogToolbar({
  totalBooks,
  currentCount,
  currentPage,
  totalPages,
  activeFiltersCount,
  isBusy,
  sortOption,
  onSortChange,
  onOpenMobileFilters,
}: BooksCatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
      {/* Count & Status */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-foreground">
          {isBusy ? (
            "Searching books..."
          ) : (
            <>
              Showing {currentCount} of {totalBooks} books
              {totalPages > 1 && (
                <span className="text-muted-foreground font-normal ml-1.5 hidden sm:inline">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </>
          )}
        </span>
        {activeFiltersCount > 0 && (
          <span className="hidden sm:inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {activeFiltersCount} active filter
            {activeFiltersCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="md:hidden flex items-center gap-1.5 rounded-full border border-border/70 bg-[#F7F1E3] px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-accent"
        >
          <Filter size={13} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowUpDown size={13} className="hidden sm:inline" />
          <span className="hidden sm:inline font-medium">Sort:</span>
          <Select
            value={sortOption}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger
              aria-label="Sort books"
              className="h-8 min-w-[140px] sm:min-w-[160px] rounded-lg border-border/70 bg-[#F7F1E3] px-2.5 py-1 text-xs font-medium text-foreground hover:border-accent focus:ring-1 focus:ring-accent shadow-xs"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="bg-[#F7F1E3] border-border/70 shadow-md"
            >
              {VALID_SORTS.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-xs cursor-pointer focus:bg-accent/10 focus:text-accent"
                >
                  {SORT_MAP[opt].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
