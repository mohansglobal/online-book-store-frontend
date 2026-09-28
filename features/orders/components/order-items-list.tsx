"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, ExternalLink, Calendar, XCircle, Store } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";
import type { OrderItem, OrderStatus } from "../types/order.types";
import {
  formatOrderPrice,
  formatOrderDate,
  getOrderItemStatusBadgeConfig,
  canCancelOrderItem,
} from "../utils/order-helpers";
import { CancelOrderDialog } from "./cancel-order-dialog";

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
    <div className="relative h-18 w-12 shrink-0 overflow-hidden rounded-md border border-border/70 bg-surface-soft shadow-2xs">
      <Image
        src={src}
        alt={title || "Book cover"}
        fill
        sizes="48px"
        className="object-cover"
        unoptimized={typeof src === "string" && !src.startsWith("/")}
        onError={() => setSrc(FALLBACK_BOOK_COVER)}
      />
    </div>
  );
}

interface OrderItemsListProps {
  items?: OrderItem[];
  orderId?: string;
  orderNumber?: string;
  orderStatus?: OrderStatus;
  allowItemCancellation?: boolean;
}

export function OrderItemsList({
  items = [],
  orderId,
  orderNumber,
  orderStatus,
  allowItemCancellation = false,
}: OrderItemsListProps) {
  const [cancellingItem, setCancellingItem] = useState<{
    id: string;
    title: string;
  } | null>(null);

  return (
    <>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <Package size={14} className="text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Packages & Items in Order ({items.length})
          </h2>
        </div>

        <div className="divide-y divide-border/50 rounded-2xl border border-border/70 bg-surface/90 p-4 sm:p-5 shadow-xs">
          {items.map((item, idx) => {
            const itemId = item._id || item.id || item.bookListing || `item-${idx}`;
            const statusConfig = getOrderItemStatusBadgeConfig(item.status);
            const sellerName =
              typeof item.seller === "object" ? item.seller?.name : undefined;
            const isEligibleForCancel =
              allowItemCancellation &&
              orderId &&
              canCancelOrderItem(item, orderStatus) &&
              Boolean(item._id || item.id);

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
                key={itemId}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Book Details & Cover */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <Link
                    href={bookHref}
                    className="block shrink-0 transition-opacity hover:opacity-85"
                    aria-label={`View details for ${item.title}`}
                  >
                    <ListItemThumbnail
                      coverImage={item.coverImage}
                      title={item.title}
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={bookHref}
                        className="line-clamp-1 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:text-accent hover:underline"
                      >
                        {item.title}
                      </Link>

                      {/* Item Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusConfig.pillClass}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusConfig.dotBg}`} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
                      <span>
                        Qty:{" "}
                        <strong className="text-foreground">{item.quantity}</strong>
                      </span>
                      <span>•</span>
                      <span>{formatOrderPrice(item.priceInPaise)} each</span>

                      {sellerName && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Store size={11} />
                            {sellerName}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Tracking & Delivery Details */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] pt-0.5">
                      {item.estimatedDeliveryDate && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Calendar size={11} className="text-accent" />
                          Est: {formatOrderDate(item.estimatedDeliveryDate)}
                        </span>
                      )}

                      {item.tracking?.courier && (
                        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                          <Truck size={11} />
                          {item.tracking.courier}
                          {item.tracking.trackingNumber && ` (#${item.tracking.trackingNumber})`}
                          {item.tracking.trackingUrl && (
                            <a
                              href={item.tracking.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center hover:underline ml-0.5"
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </span>
                      )}

                      {item.cancellation?.cancelledAt && (
                        <span className="text-rose-600 dark:text-rose-400">
                          Cancelled on {formatOrderDate(item.cancellation.cancelledAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtotal & Action */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-foreground tabular-nums">
                    {formatOrderPrice(
                      item.subtotalInPaise || item.priceInPaise * item.quantity,
                    )}
                  </div>

                  {isEligibleForCancel && (
                    <button
                      type="button"
                      onClick={() =>
                        setCancellingItem({
                          id: (item._id || item.id) as string,
                          title: item.title,
                        })
                      }
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200/80 bg-rose-50/60 px-2.5 py-1 text-[11px] font-semibold text-rose-700 transition-colors hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60"
                    >
                      <XCircle size={12} />
                      Cancel Item
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {orderId && (
        <CancelOrderDialog
          orderId={orderId}
          orderNumber={orderNumber}
          open={Boolean(cancellingItem)}
          onOpenChange={(open) => {
            if (!open) setCancellingItem(null);
          }}
          targetItem={cancellingItem || undefined}
        />
      )}
    </>
  );
}
