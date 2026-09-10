"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { BookCard } from "./book-card";
import { NoData } from "@/components/ui/no-data";
import { Button } from "@/components/ui/button";
import type { CatalogBook } from "@/features/books/types/book.types";

export interface BooksGridProps {
  books: CatalogBook[];
  isBusy: boolean;
  isError: boolean;
  noDataMessage: string;
  onRetry: () => void;
  onClearAll: () => void;
}

function BookCardSkeleton() {
  return (
    <div className="flex flex-col min-w-0 h-full animate-pulse" aria-hidden="true">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-muted/60 border border-border/40 shadow-xs" />
      <div className="pt-3.5 flex flex-col flex-1 justify-between min-h-[96px]">
        <div>
          <div className="h-11 space-y-1.5 overflow-hidden">
            <div className="h-4 bg-muted/70 rounded-md w-[90%]" />
            <div className="h-4 bg-muted/60 rounded-md w-[65%]" />
          </div>
          <div className="mt-1 h-5 flex items-center">
            <div className="h-3.5 bg-muted/50 rounded-md w-[50%]" />
          </div>
        </div>
        <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-border/30">
          <div className="h-4 bg-muted/60 rounded-md w-16" />
          <div className="h-3 bg-muted/40 rounded-md w-14" />
        </div>
      </div>
    </div>
  );
}

export function BooksGrid({
  books,
  isBusy,
  isError,
  noDataMessage,
  onRetry,
  onClearAll,
}: BooksGridProps) {
  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-destructive/20 rounded-xl bg-destructive/5 my-6 p-8">
        <AlertCircle className="text-destructive mb-3" size={32} />
        <h3 className="text-base font-semibold text-foreground mb-1">
          Unable to load books from server
        </h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-sm">
          There was a problem connecting to the books service. Please try again.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw size={14} />
          Retry
        </Button>
      </div>
    );
  }

  // Loading State
  if (isBusy) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 py-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <BookCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // Empty State
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <NoData size={200} text={noDataMessage} className="w-full" />
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="mt-6 gap-2 hover:bg-accent hover:text-white hover:border-accent cursor-pointer transition-colors"
        >
          <RotateCcw size={14} />
          Reset all filters
        </Button>
      </div>
    );
  }

  // Grid with Books & Staggered Entrance Animation (matching Wishlist page)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 py-6">
      {books.map((book, idx) => (
        <motion.div
          key={book.id || `${book.title}-${idx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(idx * 0.035, 0.35) }}
          className="h-full"
        >
          <BookCard
            book={book}
            priority={idx < 5}
          />
        </motion.div>
      ))}
    </div>
  );
}
