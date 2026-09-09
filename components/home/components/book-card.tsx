"use client";

import Image from "next/image";
import { Eye, Heart, Plus } from "lucide-react";

import type { BookCardProps } from "../types";
import { IconButton } from "./icon-button";
import { Rating } from "./rating";

export function BookCard({
  book,
  compact = false,
  size = "md",
  className = "",
  onWish,
  onCart,
}: BookCardProps) {
  const isSmall = size === "sm";

  const actionButtonClassName = isSmall
    ? "h-7 w-7 border-0 bg-black/50 text-white shadow-sm backdrop-blur-md hover:bg-black/80"
    : "";

  const titleSizeClassName = isSmall
    ? "text-[13px] font-medium sm:text-[14px]"
    : compact
      ? "text-[18px] sm:text-[19px]"
      : "text-[20px]";

  return (
    <article
      className={`group min-w-0 cursor-pointer [scroll-snap-align:start] ${isSmall ? "mx-auto w-full max-w-[190px]" : ""
        } ${className}`}
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] [perspective:900px]">
        <Image
          src={book.cover}
          alt={`${book.title} book cover`}
          fill
          sizes={
            isSmall
              ? "(max-width: 640px) 190px, 190px"
              : "(max-width: 768px) 50vw, 25vw"
          }
          className="rounded-md object-cover shadow-book transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:brightness-105"
        />

        {/* Quick Actions */}
        <div
          className={`absolute top-1.5 right-1.5 z-10 flex translate-x-2 flex-col opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ${isSmall ? "gap-1" : "gap-1.5"
            }`}
        >
          <IconButton
            label="Add to wishlist"
            onClick={onWish}
            className={actionButtonClassName}
          >
            <Heart size={isSmall ? 13 : 17} />
          </IconButton>

          <IconButton
            label="Quick view"
            className={actionButtonClassName}
          >
            <Eye size={isSmall ? 13 : 17} />
          </IconButton>

          <IconButton
            label="Add to cart"
            onClick={onCart}
            className={actionButtonClassName}
          >
            <Plus size={isSmall ? 13 : 17} />
          </IconButton>
        </div>

        {/* Category Badge */}
        <span
          className={`absolute bottom-1.5 left-1.5 rounded border border-border bg-overlay font-semibold tracking-wider text-foreground uppercase backdrop-blur-md ${isSmall
              ? "px-1.5 py-0.5 text-[8px]"
              : "px-2 py-1 text-[9px]"
            }`}
        >
          {book.category}
        </span>
      </div>

      {/* Book Information */}
      <div
        className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${isSmall ? "pt-2" : "pt-4"
          }`}
      >
        <h3
          title={book.title}
          className={`m-0 mb-0.5 line-clamp-1 font-display font-normal leading-[1.2] text-foreground transition-colors group-hover:text-accent ${titleSizeClassName}`}
        >
          {book.title}
        </h3>

        <p
          className={`m-0 line-clamp-1 text-muted-foreground ${isSmall ? "text-[10px] sm:text-[11px]" : "text-xs"
            }`}
        >
          {book.author}
        </p>

        <div
          className={`flex items-center justify-between font-medium text-foreground ${isSmall
              ? "mt-1.5 text-[11px] sm:text-xs"
              : "mt-3 text-[13px]"
            }`}
        >
          <Rating value={book.rating} />

          <div className="flex items-center gap-1.5">
            <span className="font-semibold">
              {book.price}
            </span>
            {book.originalPrice && (
              <span className="text-[11px] text-muted-foreground/70 line-through">
                {book.originalPrice}
              </span>
            )}
            {book.priceIn && book.priceIn !== book.price && (
              <span className="text-[10px] text-muted-foreground/80 font-normal">
                ({book.priceIn})
              </span>
            )}
          </div>
        </div>

        {book.detail && !isSmall && (
          <small className="mt-3 block border-t border-border pt-2.5 text-[10px] text-muted-foreground">
            {book.detail}
          </small>
        )}
      </div>
    </article>
  );
}