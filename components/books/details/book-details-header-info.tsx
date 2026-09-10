"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCheck,
  Heart,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import type { ApiBook } from "@/features/books/types/book.types";

export interface BookDetailsHeaderInfoProps {
  book: ApiBook;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export function BookDetailsHeaderInfo({
  book,
  quantity,
  onQuantityChange,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}: BookDetailsHeaderInfoProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const authorName =
    book.authors && book.authors.length > 0
      ? book.authors.map((a) => a.name?.trim()).filter(Boolean).join(", ")
      : "-";
  const authorSlug = book.authors?.[0]?.slug || "";
  const publisherName = book.publisher?.name?.trim() || "-";
  const publisherSlug = book.publisher?.slug || "";

  const rawPrice =
    book.price !== undefined && book.price !== null && book.price !== ""
      ? typeof book.price === "number"
        ? book.price
        : parseFloat(String(book.price).replace(/[^0-9.]/g, ""))
      : undefined;

  const rawOriginalPrice =
    book.originalPrice !== undefined &&
      book.originalPrice !== null &&
      book.originalPrice !== ""
      ? typeof book.originalPrice === "number"
        ? book.originalPrice
        : parseFloat(String(book.originalPrice).replace(/[^0-9.]/g, ""))
      : undefined;

  const priceText =
    rawPrice !== undefined && !isNaN(rawPrice)
      ? rawPrice === 0
        ? "Free"
        : `₹${rawPrice}`
      : "-";

  const originalPriceText =
    rawOriginalPrice !== undefined && !isNaN(rawOriginalPrice) && rawOriginalPrice > (rawPrice ?? 0)
      ? `₹${rawOriginalPrice}`
      : null;

  const savingsAmount =
    rawOriginalPrice && rawPrice && rawOriginalPrice > rawPrice
      ? Math.round(rawOriginalPrice - rawPrice)
      : null;

  const discountPercent =
    rawOriginalPrice && rawPrice && rawOriginalPrice > rawPrice
      ? Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100)
      : null;

  const ratingValue = book.rating ? String(book.rating) : "-";

  const quickSpecs = [
    { label: "Author", value: authorName },
    { label: "Publisher", value: publisherName },
    { label: "Edition", value: book.edition || "-" },

    { label: "Pages", value: book.pages ? `${book.pages} Pages` : "-" },
    { label: "Language", value: book.language || "-" },
    { label: "ISBN Code", value: book.isbn || "-" },
    {
      label: "Genre",
      value:
        book.categories && book.categories.length > 0
          ? book.categories.map((c) => c.name).join(", ")
          : "-",
    },

    {
      label: "Seller",
      value:
        typeof book.createdBy === "object" && book.createdBy !== null
          ? (book.createdBy as { name?: string }).name || "-"
          : (book.createdBy as string) || "-",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Link copied!");
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Unable to copy link");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Title & Share */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-1 font-display text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
            {book.title || "-"}
          </h1>
          {book.titleBn && (
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {book.titleBn}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="mx-2 flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:bg-surface hover:text-foreground active:scale-95 sm:mx-4"
          title="Share this book"
        >
          {copiedLink ? <CheckCheck size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          {copiedLink ? "Copied" : "Share"}
        </button>
      </div>

      {/* Author & Publisher & Rating */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {authorSlug ? (
          <Link
            href={`/authors?author=${authorSlug}`}
            className="cursor-pointer font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {authorName}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{authorName}</span>
        )}

        <span className="h-1 w-1 rounded-full bg-border" />

        {publisherSlug ? (
          <Link
            href={`/publishers?publisher=${publisherSlug}`}
            className="cursor-pointer underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {publisherName}
          </Link>
        ) : (
          <span>{publisherName}</span>
        )}

        <span className="h-1 w-1 rounded-full bg-border" />

        <div className="flex items-center gap-1 text-amber-500">
          <Star size={14} className="fill-current" />
          <span className="font-medium text-foreground">{ratingValue}</span>
          <span className="text-xs text-muted-foreground">(-)</span>
        </div>
      </div>

      {/* Price Container */}
      <div className="mb-6 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-border/60 pb-3.5 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl leading-none font-bold text-primary sm:text-4xl">
              {priceText}
            </span>
            {originalPriceText && (
              <span className="text-sm text-muted-foreground line-through sm:text-base">
                {originalPriceText}
              </span>
            )}
            {savingsAmount && discountPercent ? (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Save ₹{savingsAmount} ({discountPercent}% OFF)
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {book.status === "ACTIVE" ? "In Stock" : book.status || "In Stock"}
            </span>
            <span className="font-medium text-muted-foreground">• {book.format || "-"}</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground sm:text-xs">
          <div className="flex items-center gap-1.5"><Truck size={14} className="text-accent" /> Free Express Delivery</div>
          <div className="flex items-center gap-1.5"><Banknote size={14} className="text-accent" /> COD Available</div>
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-accent" /> 100% Genuine</div>
          <div className="flex items-center gap-1.5"><RotateCcw size={14} className="text-accent" /> 7 Days Replacement</div>
        </div>
      </div>

      {/* Purchase Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex h-11 w-28 shrink-0 items-center justify-between rounded-full border border-border bg-surface px-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="flex h-full w-8 cursor-pointer items-center justify-center text-lg text-muted-foreground hover:text-foreground"
          >
            −
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label="Increase quantity"
            className="flex h-full w-8 cursor-pointer items-center justify-center text-lg text-muted-foreground hover:text-foreground"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex h-11 min-w-[130px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-primary text-xs font-semibold text-primary shadow-sm transition-all hover:bg-primary/5 sm:text-sm"
        >
          <ShoppingBag size={16} />
          ADD TO CART
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="flex h-11 min-w-[130px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow sm:text-sm"
        >
          <Zap size={16} className="fill-current" />
          BUY NOW
        </button>

        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title="Wishlist"
          className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${isWishlisted ? "border-accent bg-accent text-white" : "border-border text-foreground hover:bg-background"
            }`}
        >
          <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
        </button>
      </div>

      {/* Quick Details List */}
      <div className="border-t border-border pt-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Quick Details</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
          {quickSpecs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="text-right font-medium text-foreground truncate max-w-[140px]" title={spec.value}>
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
