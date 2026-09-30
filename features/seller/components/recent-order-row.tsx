"use client";

import { useState } from "react";
import Image from "next/image";
import { User, ChevronRight, Lock } from "lucide-react";
import type { SellerRecentOrder } from "../types/seller.types";
import { SellerOrderStatusDialog } from "./seller-order-status-dialog";

function formatOrderTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.max(1, Math.floor(diffInMs / (1000 * 60)));
    return `${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function getStatusClasses(status: string): string {
  const normalized = status.toUpperCase();

  if (normalized === "DELIVERED" || normalized === "CONFIRMED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (normalized === "PROCESSING" || normalized === "SHIPPED") {
    return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400";
  }

  if (normalized === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400";
}

export function RecentOrderRow({ order }: { order: SellerRecentOrder }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const firstItemTitle = order.items[0]?.title || "Book item";
  const extraCount = order.sellerItemCount - 1;
  const itemSubtitle =
    extraCount > 0 ? `${firstItemTitle} +${extraCount} more` : firstItemTitle;

  const earningsFormatted = `₹${(
    order.sellerTotalInPaise / 100
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const isTerminal =
    order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDialogOpen(true);
          }
        }}
        aria-label={`View and manage order ${order.orderNumber}`}
        className="group flex w-full cursor-pointer items-center justify-between gap-3.5 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-surface-soft/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {order.customer.profilePicture ? (
              <Image
                src={order.customer.profilePicture}
                alt={order.customer.name || "Customer"}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <User
                size={18}
                className="text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              {order.customer.name || "Customer"}
            </h3>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {itemSubtitle}
            </p>

            <span className="mt-1 block text-xs font-medium text-text-secondary">
              {earningsFormatted}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end text-right">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-all group-hover:border-accent/40 ${getStatusClasses(
              order.orderStatus,
            )}`}
          >
            <span>{order.orderStatus.toLowerCase()}</span>
            {isTerminal ? (
              <Lock size={10} className="opacity-50" />
            ) : (
              <ChevronRight
                size={11}
                className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            )}
          </span>

          <span className="mt-1 text-xs text-muted-foreground">
            {formatOrderTime(order.createdAt)}
          </span>
        </div>
      </div>

      <SellerOrderStatusDialog
        order={order}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

