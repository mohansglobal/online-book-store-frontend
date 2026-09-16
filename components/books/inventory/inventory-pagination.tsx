// Pagination footer for inventory table
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemCount: number;
  onPageChange: (newPage: number) => void;
}

export function InventoryPagination({
  page,
  totalPages,
  total,
  itemCount,
  onPageChange,
}: InventoryPaginationProps) {
  if (total === 0) {
    return null;
  }

  // Calculate visible page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-surface-soft/20 p-4 text-xs text-text-secondary sm:flex-row">
      <div>
        Showing <span className="font-semibold text-foreground">{itemCount}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span> products
      </div>

      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="h-8 cursor-pointer rounded-md border-border bg-background px-2.5 text-muted-foreground disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </Button>

        {/* Page Buttons */}
        {pages.map((p) => {
          const isCurrent = p === page;

          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md font-semibold transition-colors ${
                isCurrent
                  ? "bg-accent text-white shadow-xs"
                  : "border border-border bg-background text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="h-8 cursor-pointer rounded-md border-border bg-background px-2.5 text-muted-foreground disabled:cursor-not-allowed"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
