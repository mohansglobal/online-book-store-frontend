"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { FALLBACK_BOOK_COVER, type CatalogBook } from "@/features/books/types/book.types";
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

  const bookSlugOrId = book.slug || book.id || "";
  const isSaved = isInWishlist(book.id || book.slug || book.title);

  const rawPrice =
    book.rawPrice ||
    (typeof book.price === "number"
      ? book.price
      : parseFloat(String(book.price || 0).replace(/[^0-9.]/g, "")) || 0);

  const origPrice =
    book.rawPriceIn ||
    (typeof book.originalPrice === "number"
      ? book.originalPrice
      : parseFloat(String(book.originalPrice || 0).replace(/[^0-9.]/g, "")) || rawPrice);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: book.id || book.slug || book.title,
      bookId: book.id || book.slug || book.title,
      slug: book.slug || "",
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

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void addToCart({
      listingId: book.id || book.slug || book.title,
      bookId: book.id || book.slug || book.title,
      slug: book.slug || "",
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
        href={`/books/${bookSlugOrId}`}
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

          {/* Top-Left Rating or Category Badge */}
          {book.rating && book.rating !== "-" && (
            <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-md shadow-xs border border-border/40">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
            </div>
          )}

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
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
                isSaved
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
              aria-label="Add to cart"
              title="Add to cart"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-white/20 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-95"
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
      <div className="pt-3.5 flex flex-col flex-1 justify-between min-h-[96px]">
        <div>
          {/* Fixed 2-line Title container */}
          <div className="h-11 overflow-hidden">
            <Link href={`/books/${bookSlugOrId}`} className="block">
              <h3
                title={book.title || "-"}
                className="line-clamp-2 font-display text-[15px] sm:text-[16px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-primary"
              >
                {book.title || "-"}
              </h3>
            </Link>
          </div>

          {/* Fixed 1-line Author container */}
          <p className="mt-1 h-5 truncate text-[13px] leading-5 text-muted-foreground">
            {book.author || "-"}
          </p>
        </div>

        {/* Pinned Bottom Price & Optional Category Tag */}
        <div className="mt-auto pt-2.5 flex items-center justify-between border-border/30">
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
