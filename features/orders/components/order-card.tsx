"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";
import type { Order } from "../types/order.types";
import {
  formatOrderDate,
  formatOrderPrice,
  formatItemsSummary,
  getStatusBadgeConfig,
} from "../utils/order-helpers";
import { CancelOrderDialog } from "./cancel-order-dialog";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const totalItems = order.items?.length || 0;
  const canCancel =
    order.orderStatus !== "DELIVERED" && order.orderStatus !== "CANCELLED";

  // Auto-slide cover image if there are multiple items in the order
  useEffect(() => {
    if (totalItems <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % totalItems);
    }, 2800);

    return () => clearInterval(interval);
  }, [totalItems]);

  const badgeConfig = getStatusBadgeConfig(order.orderStatus);
  const formattedDate = formatOrderDate(order.createdAt);
  const { mainTitles, extraCount } = formatItemsSummary(order.items, 3);
  const formattedPrice = formatOrderPrice(order.totalAmountInPaise);
  const orderIdentifier = order.orderNumber || order._id;

  return (
    <>
      <Link
        href={`/orders/${order._id}`}
        aria-label={`View order ${orderIdentifier}`}
        className="group flex items-stretch overflow-hidden rounded-2xl border border-border/80 bg-surface transition-all duration-200 hover:border-accent/40 hover:shadow-md"
      >
        {/* Left: Full-bleed book cover with smooth auto-sliding carousel */}
        <div className="relative min-h-[105px] w-[76px] shrink-0 self-stretch overflow-hidden border-r border-border/70 bg-surface-soft sm:w-[90px]">
          {totalItems > 0 ? (
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${activeIdx * 100}%)`,
              }}
            >
              {order.items.map((item, idx) => {
                const hasErr = imgErrorMap[idx];
                const rawCover = item.coverImage
                  ? resolveCoverUrl(item.coverImage)
                  : FALLBACK_BOOK_COVER;
                const src = hasErr ? FALLBACK_BOOK_COVER : rawCover;

                return (
                  <div
                    key={item.bookListing || idx}
                    className="relative h-full w-full shrink-0"
                  >
                    <Image
                      src={src}
                      alt={item.title || "Book thumbnail"}
                      fill
                      sizes="(max-width: 640px) 76px, 90px"
                      className="object-cover object-center"
                      unoptimized={
                        typeof src === "string" && !src.startsWith("/")
                      }
                      onError={() =>
                        setImgErrorMap((prev) => ({ ...prev, [idx]: true }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <BookOpen size={20} />
            </div>
          )}

          {/* Multiple items overlay badge */}
          {totalItems > 1 && (
            <span className="absolute right-1.5 bottom-1.5 z-10 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-xs">
              +{totalItems - 1}
            </span>
          )}
        </div>

        {/* Right Content Area */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3.5 sm:p-5">
          {/* Top Header: Order ID on Left, Status Badge & Date on Right */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate text-xs font-bold tracking-tight text-accent sm:text-sm">
              Order ID: {orderIdentifier}
            </h3>

            {/* Right Top Status & Date */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs ${badgeConfig.pillClass}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${badgeConfig.dotBg}`}
                />
                {badgeConfig.label}
              </span>

              <span className="text-border" aria-hidden="true">
                |
              </span>

              <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Middle: Items Summary on Left, Arrow on Middle-Right */}
          <div className="flex items-center justify-between gap-3">
            <p className="line-clamp-1 text-xs text-muted-foreground sm:line-clamp-2">
              <span className="font-medium text-foreground/90">
                {mainTitles.join(" | ")}
              </span>
              {extraCount > 0 && (
                <span className="font-semibold text-accent">
                  {" "}
                  & {extraCount} more item{extraCount > 1 ? "s" : ""}
                </span>
              )}
            </p>

            {/* Right Middle Side Arrow */}
            <div className="shrink-0 text-accent/80 transition-colors group-hover:text-accent">
              <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 sm:h-6 sm:w-6" />
            </div>
          </div>

          {/* Bottom: Price & Cancel Option */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <p className="text-sm font-bold text-foreground tabular-nums sm:text-base">
              {formattedPrice}
            </p>

            {canCancel && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCancelOpen(true);
                }}
                className="cursor-pointer rounded-lg border border-rose-200/80 bg-rose-50/60 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Cancel Order Confirmation Modal */}
      {canCancel && (
        <CancelOrderDialog
          orderId={order._id}
          orderNumber={order.orderNumber}
          open={isCancelOpen}
          onOpenChange={setIsCancelOpen}
        />
      )}
    </>
  );
}
