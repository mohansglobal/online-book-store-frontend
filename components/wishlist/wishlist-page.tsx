"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { NoData } from "@/components/ui/no-data";
import {
  useWishlist,
  type WishlistFilterOption,
  type WishlistSortOption,
  type WishlistViewMode,
} from "@/features/wishlist";
import { WishlistHeader } from "./wishlist-header";
import { WishlistToolbar } from "./wishlist-toolbar";
import { WishlistGrid } from "./wishlist-grid";
import { WishlistListView } from "./wishlist-list-view";
import { WishlistEmptyState } from "./wishlist-empty-state";
import { WishlistRecommendations } from "./wishlist-recommendations";
import { WishlistClearDialog } from "./wishlist-clear-dialog";

export function WishlistPage() {
  const {
    items,
    isHydrated,
    moveToCart,
    moveAllToCart,
    removeItem,
    clearWishlist,
  } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<WishlistFilterOption>("all");
  const [sortOption, setSortOption] =
    useState<WishlistSortOption>("recently_added");
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Derive unique categories from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category && item.category !== "-") {
        set.add(item.category);
      }
    });
    return Array.from(set);
  }, [items]);

  // Filter items based on search and selected filter chip
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title.toLowerCase().includes(q);
        const authorMatch = item.author.toLowerCase().includes(q);
        if (!titleMatch && !authorMatch) return false;
      }

      // Filter chip
      if (selectedFilter === "all") return true;
      if (selectedFilter === "in_stock") return item.inStock !== false;
      if (selectedFilter === "discounted") {
        return Boolean(item.originalPrice && item.originalPrice > item.price);
      }
      return item.category?.toLowerCase() === selectedFilter.toLowerCase();
    });
  }, [items, searchQuery, selectedFilter]);

  // Sort filtered items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    switch (sortOption) {
      case "price_asc":
        return list.sort((a, b) => a.price - b.price);
      case "price_desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort(
          (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
        );
      case "title_asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "in_stock":
        return list.sort(
          (a, b) => (b.inStock !== false ? 1 : 0) - (a.inStock !== false ? 1 : 0),
        );
      case "recently_added":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
        );
    }
  }, [filteredItems, sortOption]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <CategoryBanner categoryName="" compact />
        <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {items.length > 0 ? (
            <>
              {/* Header */}
              <WishlistHeader
                items={items}
                onMoveAllToCart={moveAllToCart}
                onOpenClearDialog={() => setClearDialogOpen(true)}
              />

              {/* Toolbar */}
              <WishlistToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                categories={categories}
                sortOption={sortOption}
                onSortChange={setSortOption}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResultsCount={sortedItems.length}
              />

              {/* Wishlist Items List / Grid */}
              {sortedItems.length > 0 ? (
                viewMode === "grid" ? (
                  <WishlistGrid
                    items={sortedItems}
                    onMoveToCart={moveToCart}
                    onRemove={removeItem}
                  />
                ) : (
                  <WishlistListView
                    items={sortedItems}
                    onMoveToCart={moveToCart}
                    onRemove={removeItem}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center">
                  <NoData
                    size={180}
                    text="No saved books matched your search or active filter."
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter("all");
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2 text-xs font-semibold text-foreground hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Reset filters</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <WishlistEmptyState />
          )}

          {/* Recommendations at bottom */}
          {/* <WishlistRecommendations /> */}

          {/* Clear dialog */}
          <WishlistClearDialog
            open={clearDialogOpen}
            onOpenChange={setClearDialogOpen}
            onConfirmClear={() => {
              clearWishlist();
              setClearDialogOpen(false);
            }}
            itemCount={items.length}
          />
        </div>
      </main>
    </div>
  );
}
