"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, TrendingUp } from "lucide-react";
import { resolveCoverUrl } from "@/lib/image-url";
import type { TopSellingBookItem } from "../types/seller.types";

interface BookCoverProps {
  coverImage?: string;
  title: string;
}

function BookCover({ coverImage, title }: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const initial = title?.trim()?.charAt(0)?.toUpperCase() || "B";
  const resolvedCover = coverImage ? resolveCoverUrl(coverImage) : null;

  if (!resolvedCover || hasError) {
    return (
      <div className="relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br from-accent/25 via-accent/10 to-surface-soft">
        <div className="absolute inset-y-0 left-0 w-[5px] bg-black/10 shadow-[inset_1px_0_2px_rgba(255,255,255,0.25)]" />
        <span className="text-2xl font-black text-accent drop-shadow-sm">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden bg-surface-soft">
      <div className="absolute inset-y-0 left-0 z-10 w-[5px] bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
      <div className="absolute inset-y-0 left-0 z-10 w-px bg-white/30" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedCover}
        alt={title}
        loading="lazy"
        onError={() => setHasError(true)}
        className="size-full object-cover transition-transform duration-500 ease-out group-hover/book:scale-[1.04]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10" />
    </div>
  );
}

export interface TopSellingShelfBookProps {
  book: TopSellingBookItem;
  maxUnits: number;
  index: number;
}

export function TopSellingShelfBook({
  book,
  maxUnits,
  index,
}: TopSellingShelfBookProps) {
  const ratio = maxUnits > 0 ? Math.min(book.unitsSold / maxUnits, 1) : 0;

  // Strict 2:3 book cover ratio (width / height = 2 / 3)
  const height = Math.round(105 + ratio * 55);
  const width = Math.round(height * (2 / 3));

  const isWinner = index === 0;

  const targetIdentifier = book.slug || book.bookId;
  const bookHref = `/books/${encodeURIComponent(targetIdentifier)}`;

  return (
    <Link
      href={bookHref}
      title={`View details for ${book.title}`}
      className="group/book flex min-w-0 flex-1 cursor-pointer select-none flex-col items-center transition-transform duration-200 active:scale-[0.98]"
    >
      {/* Sales count */}
      <div className="mb-2 text-center">
        <div className="flex items-center justify-center gap-1">
          {isWinner && (
            <TrendingUp className="size-3 text-accent" strokeWidth={2.5} />
          )}

          <span
            className={`tabular-nums tracking-tight ${
              isWinner
                ? "text-sm font-black text-foreground"
                : "text-xs font-bold text-foreground"
            }`}
          >
            {book.unitsSold.toLocaleString("en-IN")}
          </span>
        </div>

        <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          sold
        </span>
      </div>

      {/* Book cover visual graph */}
      <div className="relative flex w-full items-end justify-center">
        {isWinner && (
          <div className="absolute -top-6 left-1/2 z-30 -translate-x-1/2">
            <div className="flex size-6 rotate-[-7deg] items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md ring-[3px] ring-surface">
              <Crown className="size-3" strokeWidth={2.5} />
            </div>
          </div>
        )}

        <div
          className={`relative aspect-[2/3] overflow-hidden rounded-t-[5px] border transition-all duration-300 ease-out group-hover/book:-translate-y-2 ${
            isWinner
              ? "border-accent/40 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)] group-hover/book:border-accent group-hover/book:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.55)]"
              : "border-border/70 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.4)] group-hover/book:border-foreground/30 group-hover/book:shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)]"
          }`}
          style={{
            height: `${height}px`,
            width: `${width}px`,
          }}
        >
          <BookCover coverImage={book.coverImage} title={book.title} />

          {/* Rank pill */}
          <div
            className={`absolute left-1.5 top-1.5 z-20 flex h-[20px] min-w-[20px] items-center justify-center rounded-md px-1 text-[8px] font-black shadow-sm backdrop-blur-md ${
              isWinner
                ? "bg-accent text-accent-foreground"
                : "bg-background/85 text-foreground"
            }`}
          >
            #{book.rank}
          </div>

          {/* Bottom gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/45 to-transparent" />

          {/* Percentage badge */}
          <div className="absolute bottom-1.5 left-0 right-0 z-20 text-center">
            <span className="rounded bg-black/25 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
              {book.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-2.5 w-full min-w-0 text-center">
        <p
          title={book.title}
          className={`truncate transition-colors group-hover/book:text-accent ${
            isWinner
              ? "text-[11px] font-black"
              : "text-[10px] font-bold"
          } text-foreground`}
        >
          {book.title}
        </p>

        <p className="mt-0.5 truncate text-[9px] font-medium text-muted-foreground">
          {book.formattedRevenue}
        </p>
      </div>
    </Link>
  );
}

export default TopSellingShelfBook;
