"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { FALLBACK_BOOK_COVER, type CatalogBook } from "@/features/books/types/book.types";

interface BookCardProps {
  book: CatalogBook;
  priority?: boolean;
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    typeof book.cover === "string" && book.cover ? book.cover : FALLBACK_BOOK_COVER,
  );

  return (
    <article className="group relative flex flex-col min-w-0">
      <Link
        href={`/books/${book.id || book.slug}`}
        aria-label={`View details for ${book.title || "-"} by ${book.author || "-"}`}
        className="block"
      >
        {/* Book Cover Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-muted/40 shadow-xs border border-border/60 transition-all duration-500 ease-out group-hover:border-primary/40 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          <Image
            src={imgSrc}
            alt={`${book.title || "-"} book cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            priority={priority}
            unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
            onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />

          {/* Subtle hover gradient wash */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Floating Action Button */}
          <div
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-md opacity-0 translate-y-1 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:bg-primary group-hover:text-primary-foreground"
            aria-hidden="true"
          >
            <ArrowUpRight size={15} strokeWidth={2} />
          </div>

          {/* Rating Badge if present */}
          {book.rating && book.rating !== "-" && (
            <div className="absolute left-2.5 bottom-2.5 flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-xs">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="pt-3.5 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/books/${book.id || book.slug}`} className="block">
          <h3
            title={book.title || "-"}
            className="line-clamp-2 font-display text-[15px] sm:text-[16px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-primary"
          >
            {book.title || "-"}
          </h3>
        </Link>

        {/* Author */}
        <p className="mt-1 truncate text-[13px] leading-5 text-muted-foreground">
          {book.author || "-"}
        </p>

        {/* Price & Optional Category Tag */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[14px] font-bold tracking-tight text-foreground">
              {book.price || "-"}
            </span>
            {book.originalPrice && (
              <span className="text-[12px] text-muted-foreground/70 line-through">
                {book.originalPrice}
              </span>
            )}
            {book.priceIn && book.priceIn !== book.price && book.priceIn !== "-" && (
              <span
                className="inline-flex items-center rounded bg-muted/80 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                title={`India Price: ${book.priceIn}`}
              >
                IN: {book.priceIn}
              </span>
            )}
          </div>

          <span className="hidden xl:inline-block text-[10px] text-muted-foreground/80 font-medium truncate max-w-[90px]">
            {book.category || "-"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
