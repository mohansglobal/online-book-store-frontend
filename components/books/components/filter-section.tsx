"use client";

import React from "react";
import { Check, Loader2, Search, X } from "lucide-react";
import type { FilterItem } from "./books-filter-sidebar";

export interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedIds: string[];
  onToggle: (id: string, item: FilterItem) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  searchPlaceholder: string;
  emptyText: string;
}

export function FilterSection({
  title,
  items,
  selectedIds,
  onToggle,
  searchValue,
  onSearchChange,
  isLoading = false,
  searchPlaceholder,
  emptyText,
}: FilterSectionProps) {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
        <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {title}
        </h3>
        {selectedIds.length > 0 && (
          <span className="text-[11px] font-medium text-accent">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative mb-3">
        {isLoading ? (
          <Loader2
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border/70 bg-muted/30 py-1.5 pl-8 pr-7 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={`Clear ${title} search`}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Item List with Checkboxes */}
      <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isSelected =
            selectedIds.includes(item._id) ||
            Boolean(item.slug && selectedIds.includes(item.slug));

          return (
            <label
              key={item._id}
              className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => onToggle(item._id, item)}
              />
              <div
                className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? "bg-accent border-accent text-white shadow-xs"
                    : "border-border bg-transparent group-hover:border-accent/70"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={4} />}
              </div>
              <span
                className={`text-[13px] transition-colors leading-tight ${
                  isSelected
                    ? "text-foreground font-semibold"
                    : "text-foreground/80 group-hover:text-foreground"
                }`}
              >
                {item.name}
              </span>
            </label>
          );
        })}

        {items.length === 0 && (
          <p className="text-[12px] text-muted-foreground italic py-1">
            {isLoading ? `Searching ${title.toLowerCase()}s...` : emptyText}
          </p>
        )}
      </div>
    </div>
  );
}
