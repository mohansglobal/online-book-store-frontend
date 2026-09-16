"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";
import type { OrderItem } from "../types/order.types";
import { formatOrderPrice } from "../utils/order-helpers";

function ListItemThumbnail({
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

interface OrderItemsListProps {
  items?: OrderItem[];
}

export function OrderItemsList({ items = [] }: OrderItemsListProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 px-1">
        <Package size={14} className="text-accent" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Items in Order ({items.length})
        </h2>
      </div>

      <div className="divide-y divide-border/50 rounded-2xl border border-border/70 bg-surface/90 p-4 sm:p-5 shadow-xs">
        {items.map((item, idx) => {
          return (
            <div
              key={item.bookListing || idx}
              className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
            >
              {/* Book Cover */}
              <ListItemThumbnail
                coverImage={item.coverImage}
                title={item.title}
              />

              {/* Title & Quantity */}
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-1 text-xs sm:text-sm font-semibold text-foreground">
                  {item.title}
                </h4>
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
    </div>
  );
}
