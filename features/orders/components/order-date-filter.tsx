"use client";

import React from "react";
import { ChevronDown, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DateRangeFilterOption } from "../types/order.types";

interface DateRangeOption {
  label: string;
  value: DateRangeFilterOption;
}

const DATE_OPTIONS: DateRangeOption[] = [
  { label: "All Time", value: "ALL_TIME" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "Last 3 Months", value: "last3months" },
  { label: "This Year", value: "thisYear" },
];

interface OrderDateFilterProps {
  selectedRange: DateRangeFilterOption;
  onSelectRange: (range: DateRangeFilterOption) => void;
}

export function OrderDateFilter({
  selectedRange,
  onSelectRange,
}: OrderDateFilterProps) {
  const currentOption = DATE_OPTIONS.find((opt) => opt.value === selectedRange);
  const displayLabel =
    selectedRange === "ALL_TIME"
      ? "Select date range"
      : currentOption?.label || "Select date range";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Filter by date range"
          className="inline-flex cursor-pointer items-center justify-between gap-2 rounded-full border border-border/80 bg-surface px-4 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-muted-foreground" />
            <span>{displayLabel}</span>
          </span>
          <ChevronDown size={14} className="text-muted-foreground transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border border-border bg-surface p-1 shadow-md"
      >
        {DATE_OPTIONS.map((opt) => {
          const isSelected = selectedRange === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onSelectRange(opt.value)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-accent text-white font-bold hover:bg-accent-hover hover:text-white"
                  : "text-foreground hover:bg-surface-soft"
              }`}
            >
              {opt.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
