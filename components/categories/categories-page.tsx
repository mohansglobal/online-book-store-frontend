"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  RefreshCw,
  Search,
  Loader2,
} from "lucide-react";

import { CategoryBanner } from "./components/CategoryBanner";
import { CategoryCard } from "./components/category-card";
import { NoData } from "@/components/ui/no-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInfiniteCategories } from "@/features/categories";
import { useDebounce } from "@/hooks/use-debounce";

const ALPHABET = [
  "All",
  ...Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(65 + index),
  ),
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Auto-focus search input on page visit
  useEffect(() => {
    searchInputRef.current?.focus();
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" && !e.shiftKey) || e.key === "ArrowDown") {
      if (filteredCategories.length > 0) {
        e.preventDefault();
        const firstEl = document.getElementById("category-result-0");
        if (firstEl) {
          firstEl.focus();
          firstEl.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  };

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCategories({
    limit: 20,
    search: debouncedSearch.trim() || undefined,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const categoriesList = useMemo(() => {
    return data?.pages.flatMap((page) => page.data ?? []) ?? [];
  }, [data?.pages]);

  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return categoriesList.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name?.toLowerCase().includes(normalizedSearch) ||
        category.nameBn?.toLowerCase().includes(normalizedSearch) ||
        category.slug?.toLowerCase().includes(normalizedSearch);

      const matchesLetter =
        activeLetter === "All" ||
        category.name?.trim().toUpperCase().startsWith(activeLetter) ||
        category.slug?.trim().toUpperCase().startsWith(activeLetter);

      return matchesSearch && matchesLetter;
    });
  }, [categoriesList, normalizedSearch, activeLetter]);

  return (
    <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
      {/* 3D Carousel Banner */}
      <CategoryBanner categoryName="Categories" />

      <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-border/70 bg-[#F7F1E3] shadow-xs">
            <Search
              size={20}
              aria-hidden="true"
              className="ml-4 shrink-0 text-muted-foreground"
            />

            <input
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search category by name or Bangla title..."
              aria-label="Search categories"
              className="w-full bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="cursor-pointer bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Search
            </button>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {ALPHABET.map((letter) => {
            const isActive = activeLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                onClick={() => setActiveLetter(letter)}
                aria-pressed={isActive}
                className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors ${isActive
                    ? "border-accent bg-accent text-white shadow-xs"
                    : "border-border/70 bg-[#F7F1E3] text-foreground/80 hover:border-accent hover:text-accent"
                  }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-auto mb-10 flex max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h3 className="font-semibold text-foreground">Failed to load categories</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while fetching categories."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`relative h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-6 ${idx === 0 ? "lg:col-span-2 lg:row-span-2" : "col-span-1 row-span-1"
                  }`}
              >
                <div className="flex h-full flex-col justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Categories Grid */}
        {!isLoading && !error && filteredCategories.length > 0 && (
          <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category._id || category.slug}
                category={category}
                index={index}
                isFirst={index === 0}
              />
            ))}
          </div>
        )}

        {/* Infinite Scroll Target */}
        {hasNextPage && !error && (
          <div ref={observerTarget} className="mt-8 flex justify-center p-4">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more categories...</span>
              </div>
            ) : (
              <div className="h-10" />
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="mt-8 flex justify-center">
            <NoData
              size={320}
              text={
                searchTerm || activeLetter !== "All"
                  ? `No categories found matching ${searchTerm ? `"${searchTerm}"` : ""
                  }${searchTerm && activeLetter !== "All" ? " under " : ""}${activeLetter !== "All" ? `letter "${activeLetter}"` : ""
                  }.`
                  : "No categories available at the moment."
              }
              className="w-full"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export { CategoriesPage };
