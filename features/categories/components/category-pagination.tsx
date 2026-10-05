// Pagination component for Categories list
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CategoryPaginationProps) {
  if (total === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  // Generate page numbers window
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 py-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold">{startRecord}</span> to{" "}
        <span className="font-semibold">{endRecord}</span> of{" "}
        <span className="font-semibold">{total}</span> categories
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 rounded-lg px-2.5 text-xs shadow-none"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} className="mr-1" />
          Previous
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-muted-foreground"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === page;

            return (
              <Button
                key={p}
                type="button"
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-lg p-0 text-xs shadow-none ${isCurrent
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {p}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 rounded-lg px-2.5 text-xs shadow-none"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
