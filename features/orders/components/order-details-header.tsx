"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, ChevronRight, Package } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";
import type { Order } from "../types/order.types";
import {
  formatOrderDate,
  formatOrderPrice,
  formatItemsSummary,
  getStatusBadgeConfig,
} from "../utils/order-helpers";
import { OrderItemsDialog } from "./order-items-dialog";

function OrderItemThumbnail({
  coverImage,
  title,
}: {
  coverImage?: string;
  title?: string;
}) {
  const resolved = resolveCoverUrl(coverImage);
  const [src, setSrc] = useState(resolved);

  return (
    <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-md border-2 border-surface bg-surface-soft shadow-xs">
      <Image
        src={src}
        alt={title || "Book cover"}
        fill
        sizes="32px"
        className="object-cover"
        unoptimized={typeof src === "string" && !src.startsWith("/")}
        onError={() => setSrc(FALLBACK_BOOK_COVER)}
      />
    </div>
  );
}

interface OrderDetailsHeaderProps {
  order: Order;
}

export function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  const [isItemsOpen, setIsItemsOpen] = useState(false);
  const badgeConfig = getStatusBadgeConfig(order.orderStatus);
  const items = order.items || [];
  const { mainTitles, extraCount } = formatItemsSummary(items, 2);
  const totalBooksCount = items.reduce(
    (acc, it) => acc + (it.quantity || 1),
    0,
  );

  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:gap-3.5">
        {/* Top: Order #, Placed Date, Status Badge & Price */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {order.orderNumber && (
              <>
                <span className="font-semibold text-foreground">
                  {order.orderNumber}
                </span>
                <span className="text-border">•</span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-accent shrink-0" />
              <span>Placed on {formatOrderDate(order.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeConfig.pillClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${badgeConfig.dotBg}`} />
              {badgeConfig.label}
            </span>
            <span className="text-base font-bold tracking-tight text-foreground tabular-nums">
              {formatOrderPrice(order.totalAmountInPaise)}
            </span>
          </div>
        </div>

        {/* Bottom: Clickable Items preview which opens Modal */}
        <button
          type="button"
          onClick={() => setIsItemsOpen(true)}
          className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface-soft p-2.5 text-left transition-all duration-200 hover:border-accent hover:bg-muted"
          aria-label="View all items in this order"
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Book cover thumbnails */}
            {items.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                {items.slice(0, 3).map((item, idx) => (
                  <OrderItemThumbnail
                    key={item.bookListing || idx}
                    coverImage={item.coverImage}
                    title={item.title}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-11 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
                <Package size={14} />
              </div>
            )}

            {/* Item titles and total book count */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground transition-colors group-hover:text-accent">
                {mainTitles.join(" | ")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {totalBooksCount} book{totalBooksCount !== 1 ? "s" : ""}
                {extraCount > 0 && ` (+${extraCount} more)`}
                <span className="ml-1.5 font-semibold text-accent underline-offset-2 group-hover:underline">
                  • View all items
                </span>
              </p>
            </div>
          </div>

          <ChevronRight
            size={16}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </button>
      </div>

      {/* Items Details Modal */}
      <OrderItemsDialog
        items={items}
        open={isItemsOpen}
        onOpenChange={setIsItemsOpen}
        orderNumber={order.orderNumber}
      />
    </>
  );
}
