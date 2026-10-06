"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { useSellerTopBooks } from "../queries/use-seller-top-books";
import type {
  TopSellingBooksTimeframe,
  TopSellingBookItem,
} from "../types/seller.types";
import { TopSellingShelfBook } from "./top-selling-shelf-book";
import { TopSellingShelfSkeleton } from "./top-selling-shelf-skeleton";

export interface TopSellingBooksCardProps {
  className?: string;
}

const TIMEFRAMES: readonly {
  label: string;
  value: TopSellingBooksTimeframe;
}[] = [
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "1Y", value: "1y" },
  { label: "All", value: "all" },
];

export function TopSellingBooksCard({
  className = "",
}: TopSellingBooksCardProps) {
  const [timeframe, setTimeframe] = useState<TopSellingBooksTimeframe>("all");

  const { data, isLoading, isError, refetch, isRefetching } =
    useSellerTopBooks({
      timeframe,
    });

  const { books, hasItems, maxUnits } = useMemo(() => {
    const items: TopSellingBookItem[] = data?.data?.items || [];
    const topFive = items.slice(0, 5);

    return {
      books: topFive,
      hasItems: topFive.length > 0,
      maxUnits:
        topFive.length > 0
          ? Math.max(...topFive.map((book) => book.unitsSold))
          : 0,
    };
  }, [data]);

  return (
    <div
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface p-5 shadow-sm ${className}`}
    >
      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-accent/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 size-40 rounded-full bg-accent/[0.025] blur-3xl" />

      {/* Header */}
      <header className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5">
            <Award className="size-3.5 text-accent" strokeWidth={2.4} />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
              Bestseller Ranking
            </span>
          </div>

          <h2 className="text-lg font-black tracking-tight text-foreground">
            Top Selling Books
          </h2>

          {isLoading && (
            <div className="mt-1 h-3 w-32 animate-pulse rounded bg-surface-soft" />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center rounded-lg border border-border/50 bg-surface-soft/70 p-0.5">
            {TIMEFRAMES.map((item) => {
              const active = timeframe === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTimeframe(item.value)}
                  className={`cursor-pointer select-none rounded-md px-2 py-1 text-[9px] font-bold transition-all duration-200 active:scale-[0.96] ${
                    active
                      ? "bg-surface text-accent shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Refresh button */}
          <button
            type="button"
            disabled={isRefetching}
            onClick={() => refetch()}
            aria-label="Refresh top selling books"
            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border/50 bg-surface-soft/70 text-muted-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-3.5 ${
                isRefetching ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {/* Error State */}
        {isError && (
          <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-6 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>

            <p className="text-sm font-bold text-foreground">
              Unable to load rankings
            </p>

            <p className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-muted-foreground">
              Something went wrong while fetching your top selling books.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 cursor-pointer text-[10px] font-bold text-destructive transition-all duration-150 hover:underline active:scale-[0.98]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !isError && <TopSellingShelfSkeleton />}

        {/* Empty State */}
        {!isLoading && !isError && !hasItems && (
          <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-soft/25 text-center">
            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-surface-soft">
              <BookOpen className="size-5 text-muted-foreground/60" />
            </div>

            <p className="text-sm font-bold text-foreground">
              No sales data yet
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Your best sellers will appear here.
            </p>
          </div>
        )}

        {/* Bestseller Books Shelf */}
        {!isLoading && !isError && hasItems && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative flex min-h-[260px] flex-1 items-end">
              {/* Background guide lines */}
              <div className="pointer-events-none absolute inset-x-0 bottom-[72px] top-2">
                <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-border/30" />
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/30" />
                <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-border/30" />
              </div>

              {/* Shelf books */}
              <div className="relative z-10 flex w-full items-end gap-2 sm:gap-4">
                {books.map((book, index) => (
                  <TopSellingShelfBook
                    key={book.bookId}
                    book={book}
                    index={index}
                    maxUnits={maxUnits}
                  />
                ))}
              </div>
            </div>

            {/* Shelf board */}
            <div className="relative mt-2">
              <div className="h-[5px] rounded-full bg-foreground/10 shadow-[0_2px_5px_rgba(0,0,0,0.08)]" />
              <div className="mx-3 h-[3px] rounded-b-full bg-foreground/[0.035]" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TopSellingBooksCard;