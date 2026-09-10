"use client";

import React from "react";
import { X } from "lucide-react";

export interface ActiveFilterItem {
  id: string;
  label: string;
  type: "search" | "publisher" | "author" | "category" | "price";
  onRemove: () => void;
}

export interface BooksActiveFiltersProps {
  filters: ActiveFilterItem[];
  onClearAll: () => void;
}

export function BooksActiveFilters({
  filters,
  onClearAll,
}: BooksActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 pb-2">
      <span className="text-xs text-muted-foreground font-medium">Active:</span>

      {filters.map((filter) => {
        if (filter.type === "search") {
          return (
            <span
              key={`search-${filter.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-[#F7F1E3] px-2.5 py-1 text-xs font-medium text-foreground"
            >
              <span>Search: &ldquo;{filter.label}&rdquo;</span>
              <button
                type="button"
                onClick={filter.onRemove}
                aria-label="Clear search filter"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          );
        }

        if (filter.type === "price") {
          return (
            <span
              key={`price-${filter.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
            >
              <span>{filter.label}</span>
              <button
                type="button"
                onClick={filter.onRemove}
                aria-label="Remove price filter"
                className="text-accent hover:text-accent-hover cursor-pointer ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          );
        }

        const typePrefix =
          filter.type === "publisher"
            ? "Publisher:"
            : filter.type === "author"
            ? "Author:"
            : "Category:";

        return (
          <span
            key={`${filter.type}-${filter.id}`}
            className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
          >
            <span className="text-muted-foreground font-normal text-[11px]">
              {typePrefix}
            </span>
            <span>{filter.label}</span>
            <button
              type="button"
              onClick={filter.onRemove}
              aria-label={`Remove ${filter.type} ${filter.label}`}
              className="text-accent hover:text-accent-hover cursor-pointer ml-0.5"
            >
              <X size={12} />
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-destructive hover:underline ml-1 cursor-pointer"
      >
        Reset all
      </button>
    </div>
  );
}
