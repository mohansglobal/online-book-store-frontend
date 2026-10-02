// Table row rendering dynamic seller book listing discount data using backend authoritative pricing
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Copy, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { resolveCoverUrl } from "@/lib/image-url";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";

interface DiscountRowProps {
  listing: SellerBookListingItem;

  index: number;

  isSelected?: boolean;

  selectionMode?: "checkbox" | "radio";

  onToggleSelect?: (listingId: string) => void;

  onOpenEditModal: (listing: SellerBookListingItem) => void;
}

function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function DiscountRow({
  listing,
  index,
  isSelected = false,
  selectionMode = "checkbox",
  onToggleSelect,
  onOpenEditModal,
}: DiscountRowProps) {
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  const titleEn = listing.book?.title || "-";

  const titleBn = listing.book?.titleBn || "-";

  const isbn = listing.book?.isbn || "-";

  const authorNames = listing.book?.authors?.map((a) => a.name).filter(Boolean);

  const author = authorNames && authorNames.length > 0 ? authorNames.join(", ") : "-";

  const categoryNames = listing.book?.categories?.map((c) => c.name).filter(Boolean);

  const category = categoryNames && categoryNames.length > 0 ? categoryNames.join(", ") : "-";

  const coverImage = listing.coverImage || listing.book?.coverImage;

  const photoUrl = resolveCoverUrl(coverImage);

  const isActive = listing.isActive ?? true;

  const mrpInPaise = listing.mrpInPaise ?? 0;

  const mrp = listing.mrp ?? (mrpInPaise > 0 ? Math.round(mrpInPaise / 100) : 0);

  const effectiveSellingPriceInPaise =
    listing.priceInPaise ??
    (listing.price !== undefined
      ? listing.price * 100
      : listing.sellingPriceInPaise ?? mrpInPaise);

  const sellingPrice = listing.price ?? Math.round(effectiveSellingPriceInPaise / 100);

  const hasDiscount = Boolean(
    listing.isDiscountActive ||
    (listing.discountPercentage && listing.discountPercentage > 0) ||
    (mrp > 0 && sellingPrice < mrp),
  );

  const discountAmount = mrp > sellingPrice ? mrp - sellingPrice : 0;

  let discountPercent = listing.discountPercentage ?? 0;

  if (!discountPercent && hasDiscount && mrp > 0) {
    const rawPercent = (discountAmount / mrp) * 100;

    discountPercent = Math.round(rawPercent);
  }

  const activeDiscount = listing.activeDiscount;

  const discountSchedule = listing.discountSchedule;

  const startDate = activeDiscount?.startDate || discountSchedule?.startDate;

  const endDate = activeDiscount?.endDate || discountSchedule?.endDate;

  const campaignName = discountSchedule?.campaignName;

  const hasScheduleDates = Boolean(startDate && endDate);

  let windowStatus: "ACTIVE" | "UPCOMING" | "EXPIRED" = "ACTIVE";

  if (hasScheduleDates && startDate && endDate) {
    const now = new Date();

    const start = new Date(startDate);

    const end = new Date(endDate);

    if (now < start) {
      windowStatus = "UPCOMING";
    } else if (now > end) {
      windowStatus = "EXPIRED";
    }
  }

  const handleCopyIsbn = async () => {
    if (isbn === "-") return;

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
    <tr className={`group transition-colors hover:bg-surface-soft/40 ${isSelected ? "bg-accent/5" : ""}`}>
      {/* Selection Control (Radio or Checkbox) */}
      <td className="w-10 px-3 py-4 text-center">
        {selectionMode === "radio" ? (
          <div className="flex justify-center">
            <RadioGroupItem
              value={listing._id}
              id={`select-listing-${listing._id}`}
              aria-label={`Select ${titleEn}`}
              className="cursor-pointer"
            />
          </div>
        ) : (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect?.(listing._id)}
            aria-label={`Select ${titleEn}`}
            className="cursor-pointer"
          />
        )}
      </td>

      {/* Serial Number */}
      <td className="px-3 py-4 text-center font-sans text-xs text-muted-foreground tabular-nums">
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopyIsbn}
              title="Copy ISBN"
              className="h-6 w-6 rounded text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer transition-colors"
            >
              {copiedIsbn ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </Button>
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
            <Badge
              variant="outline"
              className="w-max gap-1 bg-accent/15 border-accent/30 text-accent font-bold text-xs"
            >
              <Tag size={11} />
              {discountPercent}% OFF
            </Badge>

            {discountAmount > 0 && (
              <span className="font-sans text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Save ₹{discountAmount}
              </span>
            )}
          </div>
        ) : (
          <span className="font-sans text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* Validity Dates */}
      <td className="px-4 py-4 text-xs">
        {hasScheduleDates && startDate && endDate ? (
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold border-transparent ${
                windowStatus === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : windowStatus === "UPCOMING"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {windowStatus}
            </Badge>

            <p className="text-[11px] text-text-secondary whitespace-nowrap">
              {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
            </p>

            {campaignName && (
              <p className="text-[10px] text-muted-foreground truncate max-w-[130px]" title={campaignName}>
                {campaignName}
              </p>
            )}
          </div>
        ) : hasDiscount ? (
          <span className="text-xs text-muted-foreground">Permanent</span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <Badge
          variant="outline"
          className={`border-transparent text-xs font-semibold ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
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
