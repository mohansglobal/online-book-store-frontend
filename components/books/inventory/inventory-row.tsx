// Table row for a seller book listing
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { resolveCoverUrl } from "@/lib/image-url";
import type { SellerBookListingItem, StockOperation } from "@/features/books/types/listing.types";

interface InventoryRowProps {
  listing: SellerBookListingItem;
  index: number;
  onUpdateStock: (listingId: string, operation: StockOperation, quantity: number, bookTitle: string) => void;
  onToggleStatus?: (listingId: string, currentStatus: boolean, bookTitle: string) => void;
  onDeleteListing?: (listingId: string, bookTitle: string) => void;
  isUpdatingStock?: boolean;
}

export function InventoryRow({
  listing,
  index,
  onUpdateStock,
  onToggleStatus,
  onDeleteListing,
  isUpdatingStock = false,
}: InventoryRowProps) {
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  const titleEn = listing.book?.title || "-";
  const titleBn = listing.book?.titleBn || "-";
  const isbn = listing.book?.isbn || "-";
  const author = listing.book?.authors?.map((a) => a.name).filter(Boolean).join(", ") || "-";
  const category = listing.book?.categories?.map((c) => c.name).filter(Boolean).join(", ") || "-";

  const coverImage = listing.coverImage || listing.book?.coverImage;
  const photoUrl = resolveCoverUrl(coverImage);

  const stock = listing.stock ?? 0;
  const isActive = listing.isActive ?? true;

  const sellingPrice =
    typeof listing.sellingPriceInPaise === "number"
      ? `₹${listing.sellingPriceInPaise / 100}`
      : typeof listing.book?.price === "number"
        ? `₹${listing.book.price}`
        : "-";

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

  const handleDecreaseStock = () => {
    if (stock <= 0 || isUpdatingStock) return;
    onUpdateStock(listing._id, "decrease", 1, titleEn);
  };

  const handleIncreaseStock = () => {
    if (isUpdatingStock) return;
    onUpdateStock(listing._id, "increase", 1, titleEn);
  };

  return (
    <tr className="group transition-colors hover:bg-surface-soft/40">
      {/* SL */}
      <td className="px-4 py-4 text-center font-sans text-xs text-muted-foreground tabular-nums">
        {String(index).padStart(2, "0")}
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
              aria-label={`Copy ISBN ${isbn}`}
              className="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-background hover:text-accent"
            >
              {copiedIsbn ? (
                <Check size={13} aria-hidden="true" className="text-emerald-600" />
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </td>

      {/* Book Info */}
      <td className="px-4 py-4">
        <div className="space-y-0.5">
          <div className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
            {titleEn}
          </div>

          <div className="line-clamp-1 text-xs text-muted-foreground">
            {titleBn} &bull; <span className="text-text-secondary">{author}</span>
          </div>

          <div className="text-[10px] text-muted-foreground">
            <span className="mt-1 inline-block rounded border border-border bg-background px-1.5 py-0.5">
              {category}
            </span>

            <span className="ml-2 font-sans font-semibold text-text-secondary tabular-nums">
              {sellingPrice}
            </span>
          </div>
        </div>
      </td>

      {/* Stock */}
      <td className="px-4 py-4 text-center">
        <div className="inline-flex flex-col items-center gap-1.5">
          <div className="flex items-center overflow-hidden rounded-md border border-border bg-background shadow-2xs">
            <button
              type="button"
              onClick={handleDecreaseStock}
              disabled={stock <= 0 || isUpdatingStock}
              title="Decrease stock"
              aria-label={`Decrease stock of ${titleEn}`}
              className="flex h-7 w-6 cursor-pointer items-center justify-center text-xs text-text-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>

            <span className="w-10 text-center font-sans text-xs font-bold text-foreground tabular-nums">
              {stock}
            </span>

            <button
              type="button"
              onClick={handleIncreaseStock}
              disabled={isUpdatingStock}
              title="Increase stock"
              aria-label={`Increase stock of ${titleEn}`}
              className="flex h-7 w-6 cursor-pointer items-center justify-center text-xs text-text-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              +
            </button>
          </div>

          {stock === 0 ? (
            <span className="text-[10px] font-bold tracking-tight text-rose-500 uppercase">
              Out of stock
            </span>
          ) : stock <= 5 ? (
            <span className="text-[10px] font-semibold tracking-tight text-amber-500">
              Low ({stock} left)
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              In stock
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 text-center">
        <div className="inline-flex flex-col items-center gap-1.5">
          <Switch
            checked={isActive}
            onCheckedChange={() => onToggleStatus?.(listing._id, isActive, titleEn)}
            aria-label={`Toggle status for ${titleEn}`}
            className="cursor-pointer data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-border"
          />

          <span
            className={`text-[10px] font-bold tracking-wider uppercase ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {isActive ? "Active" : "Deactive"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 pr-6 text-right">
        <div className="inline-flex items-center gap-1.5">
          <Link
            href={`/add-book?id=${listing._id}`}
            title="Edit product"
            aria-label={`Edit ${titleEn}`}
            className="cursor-pointer rounded-md border border-border bg-background p-1.5 text-text-secondary transition-colors hover:border-accent hover:bg-surface-hover hover:text-accent"
          >
            <Edit2 size={14} aria-hidden="true" />
          </Link>

          {onDeleteListing && (
            <button
              type="button"
              onClick={() => onDeleteListing(listing._id, titleEn)}
              title="Delete product"
              aria-label={`Delete ${titleEn}`}
              className="cursor-pointer rounded-md border border-border bg-background p-1.5 text-text-secondary transition-colors hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
