"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BooksPaginationProps {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  onPageChange: (page: number) => void;
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function BooksPagination({
  currentPage,
  totalPages,
  totalBooks,
  onPageChange,
}: BooksPaginationProps) {
  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-10 pb-6 border-t border-border/60 mt-8">
      <nav
        aria-label="Books catalog pagination"
        className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
      >
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Go to previous page"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-border/80 bg-card text-foreground shadow-2xs hover:bg-accent hover:text-white hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Number Circles */}
        {pages.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-xs text-muted-foreground select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = item === currentPage;
          return (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                isCurrent
                  ? "bg-accent text-white border border-accent shadow-md shadow-accent/25 font-bold scale-105"
                  : "border border-border/70 bg-card text-foreground/80 hover:bg-accent/15 hover:text-accent hover:border-accent/40",
              )}
            >
              {item}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Go to next page"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-border/80 bg-card text-foreground shadow-2xs hover:bg-accent hover:text-white hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </nav>

      {/* Page Summary Info */}
      <span className="text-xs text-muted-foreground font-medium">
        Page {currentPage} of {totalPages} ({totalBooks} total books)
      </span>
    </div>
  );
}
