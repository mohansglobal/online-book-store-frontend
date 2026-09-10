"use client";

import { LayoutGrid, List, Search, X } from "lucide-react";
import type {
  WishlistFilterOption,
  WishlistSortOption,
  WishlistViewMode,
} from "@/features/wishlist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WishlistToolbarProps = {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedFilter: WishlistFilterOption;
  onFilterChange: (val: WishlistFilterOption) => void;
  categories: string[];
  sortOption: WishlistSortOption;
  onSortChange: (val: WishlistSortOption) => void;
  viewMode: WishlistViewMode;
  onViewModeChange: (val: WishlistViewMode) => void;
  totalResultsCount: number;
};

export function WishlistToolbar({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  categories,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResultsCount,
}: WishlistToolbarProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-3.5 sm:p-4">
      {/* Top row: Search & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search saved books or authors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-8 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort & View Mode controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-44 sm:w-48">
            <Select
              value={sortOption}
              onValueChange={(val) => onSortChange(val as WishlistSortOption)}
            >
              <SelectTrigger className="h-10 rounded-xl border-border bg-background text-xs font-medium text-foreground">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                <SelectItem value="recently_added">Recently Added</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="title_asc">Title: A-Z</SelectItem>
                <SelectItem value="in_stock">In Stock First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View toggle */}
          <div className="flex h-10 items-center rounded-xl border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid View"
              title="Grid View"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List View"
              title="List View"
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Pills row */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selectedFilter === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-surface-soft text-text-secondary hover:bg-surface-hover hover:text-foreground border border-border/50"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("in_stock")}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selectedFilter === "in_stock"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-surface-soft text-text-secondary hover:bg-surface-hover hover:text-foreground border border-border/50"
          }`}
        >
          In Stock Only
        </button>

        <button
          type="button"
          onClick={() => onFilterChange("discounted")}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all ${
            selectedFilter === "discounted"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-surface-soft text-text-secondary hover:bg-surface-hover hover:text-foreground border border-border/50"
          }`}
        >
          On Sale
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onFilterChange(cat)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
              selectedFilter === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-surface-soft text-text-secondary hover:bg-surface-hover hover:text-foreground border border-border/50"
            }`}
          >
            {cat}
          </button>
        ))}

        <span className="ml-auto text-[11px] text-muted-foreground">
          Showing {totalResultsCount} items
        </span>
      </div>
    </div>
  );
}
