"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { BookCardProps } from "../types";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { useWishlist } from "@/features/wishlist";
import { useCart } from "@/features/cart";
import { Rating } from "./rating";

export function BookCard({
  book,
  compact = false,
  size = "md",
  className = "",
  onWish,
  onCart,
}: BookCardProps) {
  const [imgSrc, setImgSrc] = useState(
    typeof book.cover === "string" && book.cover ? book.cover : FALLBACK_BOOK_COVER,
  );

  useEffect(() => {
    if (typeof book.cover === "string" && book.cover) {
      setImgSrc(book.cover);
    }
  }, [book.cover]);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const isSmall = size === "sm";
  const bookId = book.id || book.slug || book.title;
  const isSaved = isInWishlist(bookId);

  const rawPrice =
    book.rawPrice ??
    (typeof book.price === "number"
      ? book.price
      : parseFloat(String(book.price || 0).replace(/[^0-9.]/g, "")) || 0);

  const origPrice =
    typeof book.originalPrice === "number"
      ? book.originalPrice
      : parseFloat(String(book.originalPrice || 0).replace(/[^0-9.]/g, "")) || rawPrice;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onWish) {
      onWish();
      return;
    }

    toggleWishlist({
      id: bookId,
      bookId: book.id || bookId,
      slug: book.slug || "",
      title: book.title,
      author: book.author,
      coverImage: typeof imgSrc === "string" ? imgSrc : FALLBACK_BOOK_COVER,
      format: "Paperback",
      price: rawPrice,
      originalPrice: origPrice,
      rating: book.rating && book.rating !== "-" ? book.rating : undefined,
      category: book.category && book.category !== "-" ? book.category : undefined,
    });
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCart) {
      onCart();
      return;
    }

    void addToCart({
      listingId: bookId,
      bookId: book.id || bookId,
      slug: book.slug || "",
      title: book.title,
      coverImage: typeof imgSrc === "string" ? imgSrc : FALLBACK_BOOK_COVER,
      author: book.author || "-",
      format: "Paperback",
      price: rawPrice,
      originalPrice: origPrice,
      quantity: 1,
    });
  };

  const titleSizeClassName = isSmall
    ? "text-[13px] font-medium sm:text-[14px]"
    : compact
      ? "text-[16px] sm:text-[17px]"
      : "text-[18px] sm:text-[19px]";

  const circleButtonSize = isSmall ? "h-7.5 w-7.5" : "h-8.5 w-8.5";
  const iconSize = isSmall ? 13 : 15;

  const cardContent = (
    <article
      className={`group min-w-0 cursor-pointer [scroll-snap-align:start] flex flex-col justify-between ${
        isSmall ? "mx-auto w-full max-w-[190px]" : ""
      } ${className}`}
    >
      {/* Book Cover Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-muted/40 shadow-xs border border-border/60 transition-all duration-500 ease-out group-hover:border-primary/40 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
        <Image
          src={imgSrc}
          alt={`${book.title} book cover`}
          fill
          sizes={
            isSmall
              ? "(max-width: 640px) 190px, 190px"
              : "(max-width: 768px) 50vw, 25vw"
          }
          onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />

        {/* Top-Left Category Badge */}
        {book.category && book.category !== "-" && (
          <span
            className={`absolute top-2 left-2 z-10 rounded-md border border-border/60 bg-background/85 font-semibold tracking-wider text-foreground uppercase backdrop-blur-md shadow-xs ${
              isSmall ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[9px]"
            }`}
          >
            {book.category}
          </span>
        )}

        {/* Bottom Blackish Gradient Overlay on Hover */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/90 via-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Bottom Circle Action Buttons on Hover */}
        <div
          className={`absolute inset-x-0 z-20 flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 ${
            isSmall ? "bottom-2" : "bottom-3"
          }`}
        >
          {/* Wishlist Circle Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            title={isSaved ? "In wishlist" : "Add to wishlist"}
            className={`flex ${circleButtonSize} cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
              isSaved
                ? "bg-accent text-white border border-accent"
                : "bg-white/95 text-neutral-800 hover:bg-accent hover:text-white border border-white/20"
            }`}
          >
            <Heart size={iconSize} className={isSaved ? "fill-current" : ""} />
          </button>

          {/* Add to Cart Circle Button */}
          <button
            type="button"
            onClick={handleCartClick}
            aria-label="Add to cart"
            title="Add to cart"
            className={`flex ${circleButtonSize} cursor-pointer items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-white/20 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-95`}
          >
            <ShoppingBag size={iconSize} />
          </button>

          {/* View Details Circle Button */}
          <div
            title="View book details"
            className={`flex ${circleButtonSize} items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-white/20 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-neutral-900 hover:text-white active:scale-95`}
          >
            <ArrowUpRight size={iconSize} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* Book Information */}
      <div className={`transition-transform duration-300 ${isSmall ? "pt-2" : "pt-3.5"}`}>
        <h3
          title={book.title}
          className={`m-0 mb-0.5 line-clamp-1 font-display font-semibold leading-[1.25] text-foreground transition-colors group-hover:text-primary ${titleSizeClassName}`}
        >
          {book.title}
        </h3>

        <p
          className={`m-0 line-clamp-1 text-muted-foreground ${
            isSmall ? "text-[11px]" : "text-[13px]"
          }`}
        >
          {book.author}
        </p>

        <div
          className={`flex items-center justify-between font-medium text-foreground ${
            isSmall ? "mt-1.5 text-[11px]" : "mt-2.5 text-[13px]"
          }`}
        >
          <Rating value={book.rating} />

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[14px]">
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
      </div>
    </article>
  );

  if (book.slug) {
    return (
      <Link href={`/books/${book.slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default BookCard;