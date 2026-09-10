"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Trash2 } from "lucide-react";
import type { WishlistItem } from "@/features/wishlist";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";

type WishlistItemRowProps = {
  item: WishlistItem;
  onMoveToCart: (item: WishlistItem) => void;
  onRemove: (item: WishlistItem) => void;
};

export function WishlistItemRow({
  item,
  onMoveToCart,
  onRemove,
}: WishlistItemRowProps) {
  const [imgSrc, setImgSrc] = useState(item.coverImage || FALLBACK_BOOK_COVER);

  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

  const isOutOfStock = item.inStock === false;

  return (
    <article className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3.5 sm:p-4 transition-all duration-200 hover:border-border-hover hover:shadow-sm">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        <div className="relative h-20 w-14 sm:h-24 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-surface-soft border border-border/50">
          <Link href={`/books/${item.slug}`} className="block h-full w-full">
            <Image
              src={imgSrc}
              alt={`${item.title} cover`}
              fill
              sizes="64px"
              onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
              unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isOutOfStock ? "grayscale opacity-75" : ""
              }`}
            />
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {item.category && (
              <span className="rounded bg-surface-soft px-1.5 py-0.5 text-[10px] font-medium text-text-secondary uppercase">
                {item.category}
              </span>
            )}
            {item.format && (
              <span className="text-[11px] text-muted-foreground">
                • {item.format}
              </span>
            )}
            {isOutOfStock ? (
              <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive uppercase">
                Out of Stock
              </span>
            ) : (
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                In Stock
              </span>
            )}
          </div>

          <Link
            href={`/books/${item.slug}`}
            className="mt-1 line-clamp-1 font-display text-base sm:text-lg font-bold text-foreground transition-colors hover:text-accent"
          >
            {item.title}
          </Link>

          <p className="line-clamp-1 text-xs text-muted-foreground">
            {item.author}
          </p>

          {item.rating && (
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-foreground">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Pricing & Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border/40 pt-3 sm:border-0 sm:pt-0 shrink-0">
        <div className="text-left sm:text-right">
          <div className="flex items-baseline sm:justify-end gap-1.5">
            <span className="text-lg font-bold tracking-tight text-foreground">
              ₹{item.price.toFixed(2)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMoveToCart(item)}
            disabled={isOutOfStock}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
                : "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]"
            }`}
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Move to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item.title}`}
            title="Remove item"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
