"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";

import { NoData } from "../ui/no-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteAuthors, type Author } from "@/features/authors";
import { useDebounce } from "@/hooks/use-debounce";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { AuthorCard } from "./components/author-card";

const ALPHABET = [
  "All",
  ...Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(65 + index),
  ),
];

function AuthorCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-[#F7F1E3] p-6 shadow-xs md:p-8">
      <div>
        <div className="mb-6 flex items-start justify-between">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="mb-4 h-8 w-3/4 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
      <div className="mt-8 border-t border-border/60 pt-4">
        <Skeleton className="h-5 w-28 rounded" />
      </div>
    </div>
  );
}

export default function AuthorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

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
      if (filteredAuthors.length > 0) {
        e.preventDefault();
        const firstEl = document.getElementById("author-result-0");
        if (firstEl) {
          firstEl.focus();
          firstEl.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
        }
      }
    }
  };

  // Paginated infinite query fetching 20 authors per batch sorted A to Z
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteAuthors({
    limit: 20,
    search: debouncedSearch.trim() || undefined,
    sortOrder: "asce",
  });

  // Flatten accumulated pages from infinite query
  const authorsList: Author[] = useMemo(() => {
    if (data?.pages) {
      return data.pages.flatMap((page) => page.data ?? []);
    }

    const legacyData = (data as unknown as { data?: Author[] })?.data;
    if (Array.isArray(legacyData)) {
      return legacyData;
    }

    return [];
  }, [data]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Filter and sort authors alphabetically A to Z
  const filteredAuthors = useMemo(() => {
    const list = authorsList.filter((author) => {
      const matchesSearch =
        !normalizedSearch ||
        author.name?.toLowerCase().includes(normalizedSearch) ||
        author.nameBn?.toLowerCase().includes(normalizedSearch) ||
        author.slug?.toLowerCase().includes(normalizedSearch);
        
        const matchesLetter =
        activeLetter === "All" ||
        author.name?.trim().toUpperCase().startsWith(activeLetter);

      return matchesSearch && matchesLetter;
    });

    return [...list].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }),
    );
  }, [authorsList, normalizedSearch, activeLetter]);

  // Automatically fetch remaining pages when a specific letter is chosen
  useEffect(() => {
    if (activeLetter !== "All" && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [activeLetter, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Infinite scroll trigger via IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleLetterChange = (letter: string) => {
    setActiveLetter(letter);
  };

  return (
    <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
      {/* 3D Carousel Banner */}
      <CategoryBanner categoryName="Authors" />

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
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search author by name..."
              aria-label="Search author by name"
              className="w-full bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
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
                onClick={() => handleLetterChange(letter)}
                aria-pressed={isActive}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
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
            <h3 className="font-semibold text-foreground">Failed to load authors</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while fetching authors."}
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

        {/* Initial Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <AuthorCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Authors Grid */}
        {!isLoading && !error && filteredAuthors.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredAuthors.map((author, index) => (
                <AuthorCard
                  key={author._id || author.slug || index}
                  author={author}
                  index={index}
                  isFirst={index === 0}
                />
              ))}
            </div>

            {/* Skeletons while loading the next page batch on scroll */}
            {isFetchingNextPage && (
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <AuthorCardSkeleton key={`loading-more-${idx}`} />
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger Sentinel */}
            <div ref={loadMoreRef} className="h-6 w-full" />
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAuthors.length === 0 && (
          <NoData
            size={350}
            text={
              searchTerm || activeLetter !== "All"
                ? "No authors found matching your criteria."
                : "No authors available at the moment."
            }
            className="w-full"
          />
        )}
      </div>
    </main>
  );
}