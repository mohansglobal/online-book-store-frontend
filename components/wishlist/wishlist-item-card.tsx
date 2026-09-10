"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Trash2 } from "lucide-react";
import type { WishlistItem } from "@/features/wishlist";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";

type WishlistItemCardProps = {
  item: WishlistItem;
  onMoveToCart: (item: WishlistItem) => void;
  onRemove: (item: WishlistItem) => void;
};

export function WishlistItemCard({
  item,
  onMoveToCart,
  onRemove,
}: WishlistItemCardProps) {
  const [imgSrc, setImgSrc] = useState(item.coverImage || FALLBACK_BOOK_COVER);

  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

  const isOutOfStock = item.inStock === false;

  return (
    <article className="group relative flex flex-col min-w-0 h-full rounded-2xl border border-border bg-surface p-3 transition-all duration-300 hover:border-border-hover hover:shadow-md">
      {/* Cover Container (2:3 Aspect Ratio) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-soft shadow-xs border border-border/40">
        <Link href={`/books/${item.slug}`} className="block h-full w-full">
          <Image
            src={imgSrc}
            alt={`${item.title} cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
            unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
            className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              isOutOfStock ? "grayscale opacity-75" : ""
            }`}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && !isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            Out of Stock
          </span>
        ) : null}

        {/* Quick Remove Floating Button */}
        <button
          type="button"
          onClick={() => onRemove(item)}
          aria-label={`Remove ${item.title} from wishlist`}
          title="Remove from wishlist"
          className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background/90 text-destructive shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-destructive hover:text-white"
        >
          <Trash2 size={14} />
        </button>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>
        )}

        {/* Format Tag */}
        {item.format && (
          <span className="absolute bottom-2 right-2 rounded-md border border-border/50 bg-background/85 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-muted-foreground backdrop-blur-md uppercase">
            {item.format}
          </span>
        )}
      </div>

      {/* Book Metadata */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/books/${item.slug}`}
            className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground transition-colors hover:text-accent"
          >
            {item.title}
          </Link>

          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {item.author}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-border/60">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold tracking-tight text-foreground">
              ₹{item.price.toFixed(2)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onMoveToCart(item)}
            disabled={isOutOfStock}
            className={`mt-2.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold shadow-xs transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
                : "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98]"
            }`}
          >
            <ShoppingBag size={14} />
            <span>{isOutOfStock ? "Out of Stock" : "Move to Cart"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
