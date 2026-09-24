// Table row rendering dynamic seller book listing discount data
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Copy, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveCoverUrl } from "@/lib/image-url";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";

interface DiscountRowProps {
  listing: SellerBookListingItem;
  index: number;
  onOpenEditModal: (listing: SellerBookListingItem) => void;
}

export function DiscountRow({
  listing,
  index,
  onOpenEditModal,
}: DiscountRowProps) {
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  // Normalized book fields with dash fallback
  const titleEn = listing.book?.title || "-";
  const titleBn = listing.book?.titleBn || "-";
  const isbn = listing.book?.isbn || "-";

  const authorNames = listing.book?.authors?.map((a) => a.name).filter(Boolean);
  const author = authorNames && authorNames.length > 0 ? authorNames.join(", ") : "-";

  const categoryNames = listing.book?.categories?.map((c) => c.name).filter(Boolean);
  const category = categoryNames && categoryNames.length > 0 ? categoryNames.join(", ") : "-";

  // Photo
  const coverImage = listing.coverImage || listing.book?.coverImage;
  const photoUrl = resolveCoverUrl(coverImage);

  // Status
  const isActive = listing.isActive ?? true;

  // Prices in Rupees
  const mrpInPaise = listing.mrpInPaise ?? 0;
  const mrp = Math.round(mrpInPaise / 100);

  const sellingPriceInPaise = listing.sellingPriceInPaise ?? mrpInPaise;
  const sellingPrice = Math.round(sellingPriceInPaise / 100);

  // Discount calculation
  const hasDiscount = mrp > 0 && sellingPrice < mrp;
  const discountAmount = mrp - sellingPrice;

  let discountPercent = 0;
  if (hasDiscount && mrp > 0) {
    const rawPercent = (discountAmount / mrp) * 100;
    discountPercent = Math.round(rawPercent);
  }

  const handleCopyIsbn = async () => {
    if (isbn === "-") {
      return;
    }

    try {
      await navigator.clipboard.writeText(isbn);
      setCopiedIsbn(true);
      toast.success("ISBN copied to clipboard");
      setTimeout(() => setCopiedIsbn(false), 2000);
    } catch {
      toast.error("Unable to copy ISBN");
    }
  };

  const serialText = String(index).padStart(2, "0");

  return (
    <tr className="group transition-colors hover:bg-surface-soft/40">
      {/* Serial Number */}
      <td className="px-4 py-4 text-center font-sans text-xs text-muted-foreground tabular-nums">
        {serialText}
      </td>

      {/* Photo */}
      <td className="px-4 py-4">
        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-soft shadow-xs transition-transform group-hover:scale-105">
          <Image
            src={photoUrl}
            alt={`${titleEn} cover`}
            fill
            sizes="48px"
            unoptimized={typeof photoUrl === "string" && !photoUrl.startsWith("/")}
            className="object-cover"
          />
        </div>
      </td>

      {/* ISBN */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <span className="rounded border border-border bg-background px-2 py-1 font-sans text-xs font-medium text-text-secondary tabular-nums">
            {isbn}
          </span>
          {isbn !== "-" && (
            <button
              type="button"
              onClick={handleCopyIsbn}
              title="Copy ISBN"
              className="rounded p-1 text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer transition-colors"
            >
              {copiedIsbn ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          )}
        </div>
      </td>

      {/* Book Info */}
      <td className="px-4 py-4">
        <div className="max-w-[220px] space-y-0.5">
          <p className="truncate text-sm font-semibold text-foreground" title={titleEn}>
            {titleEn}
          </p>
          {titleBn !== "-" && (
            <p className="truncate text-xs text-muted-foreground" title={titleBn}>
              {titleBn}
            </p>
          )}
          <p className="truncate text-xs text-text-secondary" title={author}>
            <span className="text-muted-foreground">Author: </span>
            {author}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {category}
          </p>
        </div>
      </td>

      {/* Pricing */}
      <td className="px-4 py-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Selling:</span>
            <span className="font-sans text-sm font-bold text-foreground tabular-nums">
              {sellingPrice > 0 ? `₹${sellingPrice}` : "-"}
            </span>
          </div>
          {mrp > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">MRP:</span>
              <span className={`font-sans text-xs tabular-nums ${hasDiscount ? "text-muted-foreground line-through" : "text-text-secondary"}`}>
                ₹{mrp}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Discount Badge */}
      <td className="px-4 py-4">
        {hasDiscount ? (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center gap-1 rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 font-sans text-xs font-bold text-accent shadow-2xs">
              <Tag size={11} />
              {discountPercent}% OFF
            </span>
            <span className="font-sans text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Save ₹{discountAmount}
            </span>
          </div>
        ) : (
          <span className="font-sans text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* Validity Dates */}
      <td className="px-4 py-4 text-xs text-muted-foreground">
        -
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Action */}
      <td className="px-4 py-4 text-right pr-6">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onOpenEditModal(listing)}
          className="h-8 gap-1.5 text-xs cursor-pointer hover:border-accent"
        >
          <Tag size={13} />
          {hasDiscount ? "Edit Discount" : "Set Discount"}
        </Button>
      </td>
    </tr>
  );
}
