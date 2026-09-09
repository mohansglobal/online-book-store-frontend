"use client";

import React, { useMemo, useState } from "react";
import { Check, Loader2, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePublishers, type Publisher } from "@/features/publishers";
import { useAuthors, type Author } from "@/features/authors";
import { useCategories, type Category } from "@/features/categories";

export interface FilterItem {
  _id: string;
  name: string;
  nameBn?: string;
  slug?: string;
}

export interface BooksFilterSidebarProps {
  selectedPublisherId?: string;
  onSelectPublisher: (publisherId: string) => void;
  selectedAuthorId?: string;
  onSelectAuthor: (authorId: string) => void;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  onClearAll: () => void;
  showCategoriesSection?: boolean;
  className?: string;
}

export function BooksFilterSidebar({
  selectedPublisherId,
  onSelectPublisher,
  selectedAuthorId,
  onSelectAuthor,
  selectedCategoryId,
  onSelectCategory,
  onClearAll,
  showCategoriesSection = true,
  className = "",
}: BooksFilterSidebarProps) {
  // Local search inputs for each filter category
  const [publisherSearch, setPublisherSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Debounce search terms (300ms) before querying the backend
  const debouncedPublisherSearch = useDebounce(publisherSearch.trim(), 300);
  const debouncedAuthorSearch = useDebounce(authorSearch.trim(), 300);
  const debouncedCategorySearch = useDebounce(categorySearch.trim(), 300);

  // Backend queries with default limit of 10 items
  const { data: publishersData, isFetching: isFetchingPublishers } = usePublishers({
    limit: 10,
    search: debouncedPublisherSearch || undefined,
  });

  const { data: authorsData, isFetching: isFetchingAuthors } = useAuthors({
    limit: 10,
    search: debouncedAuthorSearch || undefined,
  });

  const { data: categoriesData, isFetching: isFetchingCategories } = useCategories({
    limit: 10,
    search: debouncedCategorySearch || undefined,
  });

  const rawPublishers: FilterItem[] = useMemo(() => {
    return (publishersData?.data ?? []) as FilterItem[];
  }, [publishersData]);

  const rawAuthors: FilterItem[] = useMemo(() => {
    return (authorsData?.data ?? []) as FilterItem[];
  }, [authorsData]);

  const rawCategories: FilterItem[] = useMemo(() => {
    return (categoriesData?.data ?? []) as FilterItem[];
  }, [categoriesData]);

  // Keep a reference of selected items so they remain visible when filtering/searching
  const [savedSelectedPublisher, setSavedSelectedPublisher] = useState<FilterItem | null>(null);
  const [savedSelectedAuthor, setSavedSelectedAuthor] = useState<FilterItem | null>(null);
  const [savedSelectedCategory, setSavedSelectedCategory] = useState<FilterItem | null>(null);

  // Save selected item info whenever found in returned data
  React.useEffect(() => {
    if (selectedPublisherId) {
      const found = rawPublishers.find(
        (p) => p._id === selectedPublisherId || p.slug === selectedPublisherId,
      );
      if (found) setSavedSelectedPublisher(found);
    } else {
      setSavedSelectedPublisher(null);
    }
  }, [selectedPublisherId, rawPublishers]);

  React.useEffect(() => {
    if (selectedAuthorId) {
      const found = rawAuthors.find(
        (a) => a._id === selectedAuthorId || a.slug === selectedAuthorId,
      );
      if (found) setSavedSelectedAuthor(found);
    } else {
      setSavedSelectedAuthor(null);
    }
  }, [selectedAuthorId, rawAuthors]);

  React.useEffect(() => {
    if (selectedCategoryId) {
      const found = rawCategories.find(
        (c) => c._id === selectedCategoryId || c.slug === selectedCategoryId,
      );
      if (found) setSavedSelectedCategory(found);
    } else {
      setSavedSelectedCategory(null);
    }
  }, [selectedCategoryId, rawCategories]);

  // Merge selected item into list if not already present among the 10 results
  const displayedPublishers = useMemo(() => {
    if (
      selectedPublisherId &&
      savedSelectedPublisher &&
      !rawPublishers.some(
        (p) => p._id === selectedPublisherId || p.slug === selectedPublisherId,
      )
    ) {
      return [savedSelectedPublisher, ...rawPublishers];
    }
    return rawPublishers;
  }, [rawPublishers, selectedPublisherId, savedSelectedPublisher]);

  const displayedAuthors = useMemo(() => {
    if (
      selectedAuthorId &&
      savedSelectedAuthor &&
      !rawAuthors.some(
        (a) => a._id === selectedAuthorId || a.slug === selectedAuthorId,
      )
    ) {
      return [savedSelectedAuthor, ...rawAuthors];
    }
    return rawAuthors;
  }, [rawAuthors, selectedAuthorId, savedSelectedAuthor]);

  const displayedCategories = useMemo(() => {
    if (
      selectedCategoryId &&
      savedSelectedCategory &&
      !rawCategories.some(
        (c) => c._id === selectedCategoryId || c.slug === selectedCategoryId,
      )
    ) {
      return [savedSelectedCategory, ...rawCategories];
    }
    return rawCategories;
  }, [rawCategories, selectedCategoryId, savedSelectedCategory]);

  const activeFiltersCount =
    (selectedPublisherId ? 1 : 0) +
    (selectedAuthorId ? 1 : 0) +
    (selectedCategoryId ? 1 : 0);

  return (
    <aside
      className={`w-full md:w-64 shrink-0 space-y-8 pr-2 md:pr-4 py-6 md:py-8 ${className}`}
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

      {/* 1. PUBLISHERS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
          <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Publisher
          </h3>
          {selectedPublisherId && (
            <span className="text-[11px] font-medium text-accent">
              1 selected
            </span>
          )}
        </div>

        {/* Backend search input */}
        <div className="relative mb-3">
          {isFetchingPublishers ? (
            <Loader2
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent animate-spin"
            />
          ) : (
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          )}
          <input
            type="text"
            placeholder="Search publishers..."
            value={publisherSearch}
            onChange={(e) => setPublisherSearch(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-muted/30 py-1.5 pl-8 pr-7 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
          {publisherSearch && (
            <button
              type="button"
              onClick={() => setPublisherSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear publisher search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayedPublishers.map((pub) => {
            const isSelected = Boolean(
              selectedPublisherId &&
                (selectedPublisherId === pub._id ||
                  (pub.slug && selectedPublisherId === pub.slug)),
            );
            return (
              <label
                key={pub._id}
                className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => {
                    if (!isSelected) setSavedSelectedPublisher(pub);
                    onSelectPublisher(pub._id);
                  }}
                />
                <div
                  className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${isSelected
                    ? "bg-accent border-accent text-white shadow-xs"
                    : "border-border bg-transparent group-hover:border-accent/70"
                    }`}
                >
                  {isSelected && <Check size={12} strokeWidth={4} />}
                </div>
                <span
                  className={`text-[13px] transition-colors leading-tight ${isSelected
                    ? "text-foreground font-semibold"
                    : "text-foreground/80 group-hover:text-foreground"
                    }`}
                >
                  {pub.name}
                </span>
              </label>
            );
          })}
          {displayedPublishers.length === 0 && (
            <p className="text-[12px] text-muted-foreground italic py-1">
              {isFetchingPublishers ? "Searching publishers..." : "No publisher found"}
            </p>
          )}
        </div>
      </div>

      {/* 2. AUTHORS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
          <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Author
          </h3>
          {selectedAuthorId && (
            <span className="text-[11px] font-medium text-accent">
              1 selected
            </span>
          )}
        </div>

        {/* Backend search input */}
        <div className="relative mb-3">
          {isFetchingAuthors ? (
            <Loader2
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent animate-spin"
            />
          ) : (
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          )}
          <input
            type="text"
            placeholder="Search authors..."
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            className="w-full rounded-md border border-border/70 bg-muted/30 py-1.5 pl-8 pr-7 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
          {authorSearch && (
            <button
              type="button"
              onClick={() => setAuthorSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear author search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayedAuthors.map((author) => {
            const isSelected = Boolean(
              selectedAuthorId &&
                (selectedAuthorId === author._id ||
                  (author.slug && selectedAuthorId === author.slug)),
            );
            return (
              <label
                key={author._id}
                className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => {
                    if (!isSelected) setSavedSelectedAuthor(author);
                    onSelectAuthor(author._id);
                  }}
                />
                <div
                  className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${isSelected
                    ? "bg-accent border-accent text-white shadow-xs"
                    : "border-border bg-transparent group-hover:border-accent/70"
                    }`}
                >
                  {isSelected && <Check size={12} strokeWidth={4} />}
                </div>
                <span
                  className={`text-[13px] transition-colors leading-tight ${isSelected
                    ? "text-foreground font-semibold"
                    : "text-foreground/80 group-hover:text-foreground"
                    }`}
                >
                  {author.name}
                </span>
              </label>
            );
          })}
          {displayedAuthors.length === 0 && (
            <p className="text-[12px] text-muted-foreground italic py-1">
              {isFetchingAuthors ? "Searching authors..." : "No author found"}
            </p>
          )}
        </div>
      </div>

      {/* 3. CATEGORIES SECTION */}
      {showCategoriesSection && (
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/80">
            <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Category
            </h3>
            {selectedCategoryId && (
              <span className="text-[11px] font-medium text-accent">
                1 selected
              </span>
            )}
          </div>

          {/* Backend search input */}
          <div className="relative mb-3">
            {isFetchingCategories ? (
              <Loader2
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-accent animate-spin"
              />
            ) : (
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            )}
            <input
              type="text"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full rounded-md border border-border/70 bg-muted/30 py-1.5 pl-8 pr-7 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
            />
            {categorySearch && (
              <button
                type="button"
                onClick={() => setCategorySearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear category search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {displayedCategories.map((cat) => {
              const isSelected = Boolean(
                selectedCategoryId &&
                  (selectedCategoryId === cat._id ||
                    (cat.slug && selectedCategoryId === cat.slug)),
              );
              return (
                <label
                  key={cat._id}
                  className="flex items-center gap-3 cursor-pointer group select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => {
                      if (!isSelected) setSavedSelectedCategory(cat);
                      onSelectCategory(cat._id);
                    }}
                  />
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${isSelected
                      ? "bg-accent border-accent text-white shadow-xs"
                      : "border-border bg-transparent group-hover:border-accent/70"
                      }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={4} />}
                  </div>
                  <span
                    className={`text-[13px] transition-colors leading-tight ${isSelected
                      ? "text-foreground font-semibold"
                      : "text-foreground/80 group-hover:text-foreground"
                      }`}
                  >
                    {cat.name}
                  </span>
                </label>
              );
            })}
            {displayedCategories.length === 0 && (
              <p className="text-[12px] text-muted-foreground italic py-1">
                {isFetchingCategories ? "Searching categories..." : "No category found"}
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

export default BooksFilterSidebar;
