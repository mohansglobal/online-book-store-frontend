"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";
import type { OrderItem } from "../types/order.types";
import { formatOrderPrice } from "../utils/order-helpers";

interface OrderItemsDialogProps {
  items?: OrderItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber?: string;
}

function DialogItemThumbnail({
  coverImage,
  title,
}: {
  coverImage?: string;
  title?: string;
}) {
  const resolved = resolveCoverUrl(coverImage);
  const [src, setSrc] = useState(resolved);

  return (
    <div className="relative h-15 w-10.5 shrink-0 overflow-hidden rounded-md border border-border/70 bg-surface-soft shadow-2xs">
      <Image
        src={src}
        alt={title || "Book cover"}
        fill
        sizes="42px"
        className="object-cover"
        unoptimized={typeof src === "string" && !src.startsWith("/")}
        onError={() => setSrc(FALLBACK_BOOK_COVER)}
      />
    </div>
  );
}

export function OrderItemsDialog({
  items = [],
  open,
  onOpenChange,
  orderNumber,
}: OrderItemsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:max-w-lg">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-accent" />
            <DialogTitle className="text-base font-bold text-foreground">
              Items in Order {orderNumber ? `#${orderNumber}` : `(${items.length})`}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""} included in this order
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] divide-y divide-border/50 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const rawTarget = item.bookListing || item.book;
            const bookTarget =
              typeof rawTarget === "object" && rawTarget !== null
                ? (rawTarget as { _id?: string })._id || ""
                : rawTarget;

            const bookHref = bookTarget
              ? `/books/${encodeURIComponent(bookTarget)}`
              : "/books";

            return (
              <div
                key={item.bookListing || idx}
                className="flex items-center gap-3.5 py-3 first:pt-1 last:pb-1"
              >
                {/* Book Cover */}
                <Link
                  href={bookHref}
                  onClick={() => onOpenChange(false)}
                  className="block shrink-0 transition-opacity hover:opacity-85"
                  aria-label={`View details for ${item.title}`}
                >
                  <DialogItemThumbnail
                    coverImage={item.coverImage}
                    title={item.title}
                  />
                </Link>

                {/* Title & Quantity */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={bookHref}
                    onClick={() => onOpenChange(false)}
                    className="line-clamp-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:text-accent hover:underline block"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Qty:{" "}
                    <span className="font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <span className="mx-1.5 text-muted-foreground/40">•</span>
                    <span>{formatOrderPrice(item.priceInPaise)} each</span>
                  </p>
                </div>

                {/* Line item subtotal */}
                <div className="text-right text-xs sm:text-sm font-bold text-foreground tabular-nums">
                  {formatOrderPrice(
                    item.subtotalInPaise ||
                    item.priceInPaise * item.quantity,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
