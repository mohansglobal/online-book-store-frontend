"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, RotateCcw, ShoppingBag } from "lucide-react";
import emptyOrderIllustration from "@/assets/emptyorder.png";
import type { DateRangeFilterOption, OrderTabFilter } from "../types/order.types";

interface OrderEmptyStateProps {
  selectedTab: OrderTabFilter;
  hasAnyOrders?: boolean;
  selectedRange?: DateRangeFilterOption;
  onResetFilter?: () => void;
}

export function OrderEmptyState({
  selectedTab,
  selectedRange = "ALL_TIME",
  onResetFilter,
}: OrderEmptyStateProps) {
  const getEmptyMessage = () => {
    switch (selectedTab) {
      case "DELIVERED":
        return {
          title: "No Delivered Orders Placed Yet",
          description:
            "You don't have any delivered orders yet. Once your orders are fulfilled and delivered, they will appear here.",
        };
      case "IN_PROGRESS":
        return {
          title: "No In-Progress Orders Placed Yet",
          description:
            "You have no active orders currently being processed or shipped.",
        };
      case "CANCELLED":
        return {
          title: "No Cancelled Orders Placed Yet",
          description:
            "You have no cancelled orders in your account.",
        };
      case "ALL":
      default:
        if (selectedRange !== "ALL_TIME") {
          return {
            title: "No Orders Placed in This Timeframe",
            description:
              "No orders were found for the selected date range. Try choosing a different timeframe or browse our catalog.",
          };
        }
        return {
          title: "No Orders Placed Yet",
          description:
            "You haven't placed any book orders yet. Explore our extensive catalog of rare editions, literature, and bestsellers!",
        };
    }
  };

  const { title, description } = getEmptyMessage();
  const isFiltered = selectedTab !== "ALL" || selectedRange !== "ALL_TIME";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-surface p-8 text-center shadow-xs sm:p-12">
      {/* Decorative Empty Order Illustration */}
      <div className="relative mb-5 w-44 sm:w-52">
        <Image
          src={emptyOrderIllustration}
          alt="Illustration of empty orders"
          width={220}
          height={220}
          className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-xs"
          priority
        />
      </div>

      <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground sm:text-sm">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isFiltered && onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-accent-hover sm:text-sm"
          >
            <RotateCcw size={15} />
            <span>View All Orders</span>
          </button>
        )}

        <Link
          href="/books"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors sm:text-sm ${isFiltered && onResetFilter
              ? "border border-border bg-surface-soft text-foreground hover:bg-muted"
              : "bg-accent text-white shadow-xs hover:bg-accent-hover"
            }`}
        >
          <BookOpen size={15} />
          <span>Explore Catalog</span>
        </Link>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-soft px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted sm:text-sm"
        >
          <ShoppingBag size={15} />
          <span>View Cart</span>
        </Link>
      </div>
    </div>
  );
}

