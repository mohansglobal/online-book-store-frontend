"use client";

import React from "react";
import type { OrderTabFilter } from "../types/order.types";

interface StatusTabOption {
  label: string;
  value: OrderTabFilter;
}

const TABS: StatusTabOption[] = [
  { label: "All", value: "ALL" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

interface OrderStatusTabsProps {
  selectedTab: OrderTabFilter;
  onSelectTab: (tab: OrderTabFilter) => void;
}

export function OrderStatusTabs({
  selectedTab,
  onSelectTab,
}: OrderStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter orders by status"
      className="flex flex-wrap items-center gap-2"
    >
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onSelectTab(tab.value)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${isActive
                ? "bg-accent text-white border border-accent shadow-xs hover:bg-accent-hover hover:border-accent-hover"
                : "border border-border/80 bg-surface text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
