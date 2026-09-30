"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  MapPin,
  Book,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Settings,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusBadgeConfig } from "@/features/orders/utils/order-helpers";
import type { SellerOrder } from "../../types/seller.types";

interface SellerOrderCardProps {
  order: SellerOrder;
  onOpenStatusDialog: (order: SellerOrder) => void;
}

export function SellerOrderCard({
  order,
  onOpenStatusDialog,
}: SellerOrderCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isTerminal =
    order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

  const statusConfig = getStatusBadgeConfig(order.orderStatus);

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const sellerEarnings = order.sellerSubtotalInPaise
    ? order.sellerSubtotalInPaise / 100
    : order.items.reduce((acc, it) => acc + (it.subtotalInPaise ?? 0), 0) / 100;

  const earningsFormatted = sellerEarnings.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const customerName =
    order.buyer?.name || order.shippingAddress?.fullName || "Customer";

  const customerAvatar = order.buyer?.profilePicture;

  const customerInitials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const shippingCity = order.shippingAddress?.city;
  const shippingState = order.shippingAddress?.state;

  const shippingLocation = shippingCity
    ? `${shippingCity}${shippingState ? `, ${shippingState}` : ""}`
    : "Standard Delivery";

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const primaryItem = order.items[0];
  const primaryItemImage =
    primaryItem?.coverImage ||
    (primaryItem as { image?: string })?.image ||
    (primaryItem?.book as { coverImage?: string })?.coverImage;

  const extraItemsCount = order.items.length - 1;

  const paymentLabel =
    order.paymentMethod === "ONLINE_PAY"
      ? order.paymentStatus === "PAID"
        ? "Online Paid"
        : "Online Pay"
      : order.paymentStatus === "PAID"
        ? "COD • Paid"
        : "COD • Pending";

  const isMultiSellerPartial =
    order.overallOrderStatus &&
    order.overallOrderStatus !== order.orderStatus &&
    order.overallOrderStatus === "PARTIALLY_SHIPPED";

  return (
    <article className="group rounded-xl border border-border/80 bg-surface/80 p-3 shadow-xs transition-all duration-200 hover:border-border hover:bg-surface hover:shadow-sm sm:p-3.5">
      {/* Top Header Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Order Number & Copy */}
          <div className="flex items-center gap-1 font-bold text-foreground">
            <span>#{order.orderNumber}</span>

            <button
              type="button"
              title="Copy Order Number"
              onClick={handleCopyOrderNumber}
              className="cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Copy size={12} />
              )}
            </button>
          </div>

          <span className="text-muted-foreground/60">•</span>

          {/* Date */}
          <span className="text-muted-foreground">{orderDate}</span>

          <span className="text-muted-foreground/60">•</span>

          {/* Customer Avatar & Name */}
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <div className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/15 text-[9px] font-bold text-accent">
              {customerAvatar ? (
                <Image
                  src={customerAvatar}
                  alt={customerName}
                  fill
                  sizes="18px"
                  className="object-cover"
                />
              ) : (
                <span>{customerInitials || "U"}</span>
              )}
            </div>

            <span className="truncate max-w-[130px]">{customerName}</span>
          </div>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-1.5">
          {isMultiSellerPartial && (
            <span className="hidden rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600 sm:inline dark:text-sky-400">
              Partially Shipped
            </span>
          )}

          <span className="rounded-md border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
            {paymentLabel}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusConfig.pillClass}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotBg}`}
              aria-hidden="true"
            />
            <span>{statusConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Main Content Row: Compact Left Item & Right Actions */}
      <div className="mt-2.5 flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
        {/* Left Side: Primary Book details */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative flex h-11 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted">
            {primaryItemImage ? (
              <Image
                src={primaryItemImage}
                alt={primaryItem?.title || "Book"}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <Book size={13} className="text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs font-semibold text-foreground">
                {primaryItem?.title || "Book item"}
              </p>

              {primaryItem?.status && primaryItem.status !== order.orderStatus && (
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  {primaryItem.status}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>Qty: {primaryItem?.quantity || 1}</span>

              <span>•</span>

              <span className="flex items-center gap-0.5">
                <MapPin size={11} aria-hidden="true" />
                <span className="truncate max-w-[130px]">{shippingLocation}</span>
              </span>

              {order.cancellationReason && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-rose-500 text-[10px] font-medium">
                    <AlertCircle size={10} />
                    <span className="truncate max-w-[140px]">{order.cancellationReason}</span>
                  </span>
                </>
              )}

              {extraItemsCount > 0 && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex cursor-pointer items-center gap-0.5 font-semibold text-accent hover:underline"
                  >
                    <span>+{extraItemsCount} more book{extraItemsCount > 1 ? "s" : ""}</span>
                    {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Earnings & Action Button */}
        <div className="flex shrink-0 items-center justify-between gap-3.5 sm:justify-end">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
              Earnings
            </span>
            <div className="flex items-center justify-end font-bold text-accent text-sm sm:text-base">
              <IndianRupee size={13} />
              <span>{earningsFormatted}</span>
            </div>
          </div>

          <div>
            {isTerminal ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenStatusDialog(order)}
                className="h-7.5 cursor-pointer gap-1 rounded-lg px-2.5 text-xs font-semibold text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <Eye size={12} />
                <span>View Details</span>
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenStatusDialog(order)}
                className="h-7.5 cursor-pointer gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-hover active:scale-95"
              >
                <Settings size={12} />
                <span>Update Status</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Extra Items Section */}
      {isExpanded && extraItemsCount > 0 && (
        <div className="mt-2.5 divide-y divide-border/40 rounded-lg border border-border/40 bg-surface-soft/40 p-2">
          {order.items.slice(1).map((item, idx) => {
            const itemKey = item._id || item.id || `extra-item-${idx}`;
            const itemImg =
              item.coverImage ||
              (item as { image?: string })?.image ||
              (item.book as { coverImage?: string })?.coverImage;

            return (
              <div
                key={itemKey}
                className="flex items-center justify-between gap-2 py-1.5 text-xs first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex h-7 w-5.5 shrink-0 items-center justify-center overflow-hidden rounded border border-border/60 bg-muted">
                    {itemImg ? (
                      <Image
                        src={itemImg}
                        alt={item.title}
                        fill
                        sizes="22px"
                        className="object-cover"
                      />
                    ) : (
                      <Book size={10} className="text-muted-foreground" />
                    )}
                  </div>

                  <p className="truncate font-medium text-foreground">
                    {item.title}
                  </p>

                  <span className="text-[11px] text-muted-foreground">
                    ×{item.quantity}
                  </span>

                  {item.status && (
                    <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-semibold uppercase text-muted-foreground">
                      {item.status}
                    </span>
                  )}
                </div>

                <span className="font-semibold text-foreground">
                  ₹{((item.subtotalInPaise ?? 0) / 100).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
