"use client";

import React, { useMemo, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePublishers } from "@/features/publishers";
import { useAuthors } from "@/features/authors";
import { useCategories } from "@/features/categories";
import { FilterSection } from "./filter-section";
import { PriceFilterSection } from "./price-filter-section";
import { useRetainedFilterItems } from "../hooks/use-retained-filter-items";

export interface FilterItem {
  _id: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

export interface BooksFilterSidebarProps {
  selectedPublisherIds?: string[] | string;
  selectedPublisherId?: string[] | string;
  onSelectPublisher: (publisherId: string, item?: FilterItem) => void;
  selectedAuthorIds?: string[] | string;
  selectedAuthorId?: string[] | string;
  onSelectAuthor: (authorId: string, item?: FilterItem) => void;
  selectedCategoryIds?: string[] | string;
  selectedCategoryId?: string[] | string;
  onSelectCategory: (categoryId: string, item?: FilterItem) => void;
  minPrice?: number;
  maxPrice?: number;
  onApplyPrice?: (min?: number, max?: number) => void;
  onClearPrice?: () => void;
  onClearAll: () => void;
  showCategoriesSection?: boolean;
  className?: string;
}

function normalizeIds(val?: string[] | string): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function deduplicateFilterItems(items: FilterItem[]): FilterItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = (item.name || item._id || item.slug || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function BooksFilterSidebar({
  selectedPublisherIds,
  selectedPublisherId,
  onSelectPublisher,
  selectedAuthorIds,
  selectedAuthorId,
  onSelectAuthor,
  selectedCategoryIds,
  selectedCategoryId,
  onSelectCategory,
  minPrice,
  maxPrice,
  onApplyPrice,
  onClearPrice,
  onClearAll,
  showCategoriesSection = true,
  className = "",
}: BooksFilterSidebarProps) {
  const publisherIds = useMemo(
    () => normalizeIds(selectedPublisherIds ?? selectedPublisherId),
    [selectedPublisherIds, selectedPublisherId],
  );

  const authorIds = useMemo(
    () => normalizeIds(selectedAuthorIds ?? selectedAuthorId),
    [selectedAuthorIds, selectedAuthorId],
  );

  const categoryIds = useMemo(
    () => normalizeIds(selectedCategoryIds ?? selectedCategoryId),
    [selectedCategoryIds, selectedCategoryId],
  );

  // Search input state per filter type
  const [publisherSearch, setPublisherSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const debouncedPublisherSearch = useDebounce(publisherSearch.trim(), 300);
  const debouncedAuthorSearch = useDebounce(authorSearch.trim(), 300);
  const debouncedCategorySearch = useDebounce(categorySearch.trim(), 300);

  // Queries
  const { data: publishersData, isFetching: isFetchingPublishers } = usePublishers({
    limit: 100,
    search: debouncedPublisherSearch || undefined,
  });

  const { data: authorsData, isFetching: isFetchingAuthors } = useAuthors({
    limit: 100,
    search: debouncedAuthorSearch || undefined,
  });

  const { data: categoriesData, isFetching: isFetchingCategories } = useCategories({
    limit: 100,
    search: debouncedCategorySearch || undefined,
  });

  const rawPublishers: FilterItem[] = useMemo(
    () => deduplicateFilterItems((publishersData?.data ?? []) as FilterItem[]),
    [publishersData],
  );

  const rawAuthors: FilterItem[] = useMemo(
    () => deduplicateFilterItems((authorsData?.data ?? []) as FilterItem[]),
    [authorsData],
  );

  const rawCategories: FilterItem[] = useMemo(
    () => deduplicateFilterItems((categoriesData?.data ?? []) as FilterItem[]),
    [categoriesData],
  );

  // Retain selected items
  const { displayedItems: displayedPublishers, saveItem: savePublisher } =
    useRetainedFilterItems(rawPublishers, publisherIds);
  const { displayedItems: displayedAuthors, saveItem: saveAuthor } =
    useRetainedFilterItems(rawAuthors, authorIds);
  const { displayedItems: displayedCategories, saveItem: saveCategory } =
    useRetainedFilterItems(rawCategories, categoryIds);

  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;
  const activeFiltersCount =
    publisherIds.length + authorIds.length + categoryIds.length + (hasPriceFilter ? 1 : 0);

  const handleTogglePublisher = (id: string, item: FilterItem) => {
    savePublisher(id, item);
    onSelectPublisher(id, item);
  };

  const handleToggleAuthor = (id: string, item: FilterItem) => {
    saveAuthor(id, item);
    onSelectAuthor(id, item);
  };

  const handleToggleCategory = (id: string, item: FilterItem) => {
    saveCategory(id, item);
    onSelectCategory(id, item);
  };

  return (
    <aside
      className={`w-full md:w-64 shrink-0 space-y-6 pr-2 md:pr-4 py-4 md:py-6 ${className}`}
      aria-label="Book Catalog Filters"
    >
      {/* Top Header & Reset action */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-accent" />
          <span className="text-[13px] font-semibold text-foreground tracking-wide uppercase">
            Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
          >
            <RotateCcw size={11} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* 1. Price Range Section */}
      {onApplyPrice && onClearPrice && (
        <PriceFilterSection
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApplyPrice={onApplyPrice}
          onClearPrice={onClearPrice}
        />
      )}

      {/* 2. Publishers */}
      <FilterSection
        title="Publisher"
        items={displayedPublishers}
        selectedIds={publisherIds}
        onToggle={handleTogglePublisher}
        searchValue={publisherSearch}
        onSearchChange={setPublisherSearch}
        isLoading={isFetchingPublishers}
        searchPlaceholder="Search publishers..."
        emptyText="No publisher found"
      />

      {/* 3. Authors */}
      <FilterSection
        title="Author"
        items={displayedAuthors}
        selectedIds={authorIds}
        onToggle={handleToggleAuthor}
        searchValue={authorSearch}
        onSearchChange={setAuthorSearch}
        isLoading={isFetchingAuthors}
        searchPlaceholder="Search authors..."
        emptyText="No author found"
      />

      {/* 4. Categories */}
      {showCategoriesSection && (
        <FilterSection
          title="Category"
          items={displayedCategories}
          selectedIds={categoryIds}
          onToggle={handleToggleCategory}
          searchValue={categorySearch}
          onSearchChange={setCategorySearch}
          isLoading={isFetchingCategories}
          searchPlaceholder="Search categories..."
          emptyText="No category found"
        />
      )}
    </aside>
  );
}

export default BooksFilterSidebar;
