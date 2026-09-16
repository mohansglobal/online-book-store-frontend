"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { FALLBACK_BOOK_COVER, type CatalogBook } from "@/features/books/types/book.types";
import { canPurchaseBook } from "@/features/books/utils/stock.utils";
import { useWishlist } from "@/features/wishlist";
import { useCart } from "@/features/cart";

interface BookCardProps {
  book: CatalogBook;
  priority?: boolean;
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    typeof book.cover === "string" && book.cover ? book.cover : FALLBACK_BOOK_COVER,
  );

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const bookId = book.id || book.slug || "";
  const isSaved = isInWishlist(bookId);

  const rawPrice =
    book.rawPrice ||
    (typeof book.price === "number"
      ? book.price
      : parseFloat(String(book.price || 0).replace(/[^0-9.]/g, "")) || 0);

  const rawOriginalPrice =
    book.rawPriceIn ||
    (typeof book.originalPrice === "number"
      ? book.originalPrice
      : parseFloat(String(book.originalPrice || 0).replace(/[^0-9.]/g, "")) || 0);

  const origPrice = rawOriginalPrice > 0 ? rawOriginalPrice : rawPrice;

  const hasDiscount = origPrice > rawPrice && rawPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((origPrice - rawPrice) / origPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: bookId,
      bookId: bookId,
      slug: book.slug || bookId,
      title: book.title || "-",
      author: book.author || "-",
      coverImage: typeof imgSrc === "string" ? imgSrc : FALLBACK_BOOK_COVER,
      format: book.format || "Paperback",
      price: rawPrice,
      originalPrice: origPrice,
      inStock: book.inStock,
      rating: book.rating && book.rating !== "-" ? book.rating : undefined,
      category: book.category && book.category !== "-" ? book.category : undefined,
    });
  };

  const isPurchasable = canPurchaseBook(book.stock, book.inStock);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isPurchasable) {
      toast.error("This book is currently out of stock.");
      return;
    }

    void addToCart({
      listingId: bookId,
      bookId: bookId,
      slug: book.slug || bookId,
      title: book.title || "-",
      coverImage: typeof imgSrc === "string" ? imgSrc : FALLBACK_BOOK_COVER,
      author: book.author || "-",
      format: book.format || "Paperback",
      price: rawPrice,
      originalPrice: origPrice,
      quantity: 1,
    });
  };

  return (
    <article className="group relative flex flex-col min-w-0 h-full">
      <Link
        href={`/books/${bookId}`}
        aria-label={`View details for ${book.title || "-"} by ${book.author || "-"}`}
        className="block shrink-0"
      >
        {/* Book Cover Container (Fixed 2:3 Aspect Ratio) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-muted/40 shadow-xs border border-border/60 transition-all duration-500 ease-out group-hover:border-primary/40 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
          <Image
            src={imgSrc}
            alt={`${book.title || "-"} book cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            priority={priority}
            unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
            onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />

          {/* Top-Left Discount Badge */}
          {/* {hasDiscount && discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )} */}

          {/* Bottom Blackish Gradient Overlay on Hover */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/90 via-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Bottom Circle Action Buttons on Hover */}
          <div className="absolute inset-x-0 bottom-3.5 z-20 flex items-center justify-center gap-2.5 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            {/* Wishlist Circle Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              title={isSaved ? "In wishlist" : "Add to wishlist"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${isSaved
                ? "bg-accent text-white border border-accent"
                : "bg-white/95 text-neutral-800 hover:bg-accent hover:text-white border border-white/20"
                }`}
            >
              <Heart size={15} className={isSaved ? "fill-current" : ""} />
            </button>

            {/* Add to Cart Circle Button */}
            <button
              type="button"
              onClick={handleCartClick}
              aria-label={isPurchasable ? "Add to cart" : "Out of stock"}
              title={isPurchasable ? "Add to cart" : "Out of stock"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 shadow-md backdrop-blur-md transition-all duration-200 active:scale-95 ${
                isPurchasable
                  ? "bg-white/95 text-neutral-800 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
                  : "bg-white/70 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <ShoppingBag size={15} />
            </button>

            {/* View Details Circle Button */}
            <div
              title="View book details"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-white/20 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-neutral-900 hover:text-white active:scale-95"
            >
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </div>
          </div>
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="pt-3 flex flex-col flex-1 justify-between min-h-[84px]">
        <div>
          {/* 1-line Title with ellipsis if longer than first line */}
          <Link href={`/books/${bookId}`} className="block">
            <h3
              title={book.title || "-"}
              className="truncate font-display text-[15px] sm:text-[16px] font-semibold leading-snug tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-primary"
            >
              {book.title || "-"}
            </h3>
          </Link>

          {/* Rating between Title and Author */}
          {book.rating && book.rating !== "-" && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-foreground">
              <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-semibold text-foreground">{book.rating}</span>
              <span className="text-[10px] text-muted-foreground">
                ({book.totalRatings ?? book.ratingCount ?? 0})
              </span>
            </div>
          )}

          {/* Fixed 1-line Author container */}
          <p className="mt-1 h-5 truncate text-[13px] leading-5 text-muted-foreground">
            {book.author || "-"}
          </p>

          {/* Seller line */}
          {book.seller && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80" title={`Seller: ${book.seller}`}>
              Seller: <span className="font-medium text-foreground/90">{book.seller}</span>
            </p>
          )}
        </div>

        {/* Pinned Bottom Price */}
        <div className="mt-auto pt-2.5 flex items-baseline gap-1.5 flex-nowrap">
          <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-foreground shrink-0">
            {book.price || "-"}
          </span>

          {hasDiscount && book.originalPrice && (
            <span className="text-[12px] text-muted-foreground/70 line-through shrink-0">
              {book.originalPrice}
            </span>
          )}

          {hasDiscount && discountPercent > 0 && (
            <span className="text-[11px] sm:text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              {discountPercent}% off
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default BookCard;
