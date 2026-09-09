"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { BookCard } from "./book-card";
import { BooksFilterSidebar } from "./books-filter-sidebar";
import { NoData } from "@/components/ui/no-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useBooks } from "@/features/books/hooks/use-books";
import { useCategory } from "@/features/categories/hooks/use-categories";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
  type CatalogBook,
  type BookSortBy,
  type BookSortOrder,
} from "@/features/books/types/book.types";

export type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "publicationDate";

export const SORT_MAP: Record<
  SortOption,
  { sortBy: BookSortBy; sortOrder: BookSortOrder; label: string }
> = {
  newest: { sortBy: "createdAt", sortOrder: "desc", label: "Newest Arrivals" },
  oldest: { sortBy: "createdAt", sortOrder: "asc", label: "Oldest Arrivals" },
  "title-asc": { sortBy: "title", sortOrder: "asc", label: "Title: A to Z" },
  "title-desc": { sortBy: "title", sortOrder: "desc", label: "Title: Z to A" },
  publicationDate: {
    sortBy: "publicationDate",
    sortOrder: "desc",
    label: "Publication Date",
  },
};

const VALID_SORTS: SortOption[] = [
  "newest",
  "oldest",
  "title-asc",
  "title-desc",
  "publicationDate",
];

export interface BooksCatalogPageProps {
  title?: string;
  initialCategoryId?: string;
  initialAuthorId?: string;
  initialPublisherId?: string;
  showCategoriesFilter?: boolean;
}

function BookCardSkeleton() {
  return (
    <div className="flex flex-col min-w-0 animate-pulse" aria-hidden="true">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-muted/60 border border-border/40 shadow-xs" />
      <div className="pt-3.5 space-y-2">
        <div className="h-4.5 bg-muted/70 rounded-md w-[85%]" />
        <div className="h-3.5 bg-muted/50 rounded-md w-[60%]" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-muted/60 rounded-md w-14" />
          <div className="h-3 bg-muted/40 rounded-md w-16" />
        </div>
      </div>
    </div>
  );
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function BooksCatalogPage({
  title = "BOOKS",
  initialCategoryId,
  initialAuthorId,
  initialPublisherId,
  showCategoriesFilter = true,
}: BooksCatalogPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL search params
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;
  const limit = 10;

  const urlSearch = searchParams.get("search") || "";
  const rawSort = searchParams.get("sort") as SortOption;
  const sortOption: SortOption = VALID_SORTS.includes(rawSort)
    ? rawSort
    : "newest";

  const selectedAuthorId =
    searchParams.get("author") || initialAuthorId || undefined;
  const selectedPublisherId =
    searchParams.get("publisher") || initialPublisherId || undefined;
  const selectedCategoryId =
    searchParams.get("category") || initialCategoryId || undefined;

  // Local state for search input
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Map sort option to backend parameters
  const currentSortConfig = SORT_MAP[sortOption];

  // Helper to push updated search params to URL and keep other params
  const updateUrlParams = useCallback(
    (updates: {
      page?: number;
      search?: string;
      publisher?: string;
      author?: string;
      category?: string;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update page
      const nextPage = updates.page !== undefined ? updates.page : page;
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      } else {
        params.delete("page");
      }

      // Update search
      const nextSearch =
        updates.search !== undefined ? updates.search : urlSearch;
      if (nextSearch.trim()) {
        params.set("search", nextSearch.trim());
      } else {
        params.delete("search");
      }

      // Update publisher
      const nextPublisher =
        updates.publisher !== undefined ? updates.publisher : selectedPublisherId;
      if (nextPublisher) {
        params.set("publisher", nextPublisher);
      } else {
        params.delete("publisher");
      }

      // Update author
      const nextAuthor =
        updates.author !== undefined ? updates.author : selectedAuthorId;
      if (nextAuthor) {
        params.set("author", nextAuthor);
      } else {
        params.delete("author");
      }

      // Update category
      const nextCategory =
        updates.category !== undefined ? updates.category : selectedCategoryId;
      if (nextCategory) {
        params.set("category", nextCategory);
      } else {
        params.delete("category");
      }

      // Update sort
      const nextSort = updates.sort !== undefined ? updates.sort : sortOption;
      if (nextSort && nextSort !== "newest") {
        params.set("sort", nextSort);
      } else {
        params.delete("sort");
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [
      searchParams,
      pathname,
      router,
      page,
      urlSearch,
      selectedPublisherId,
      selectedAuthorId,
      selectedCategoryId,
      sortOption,
    ],
  );

  // Debounce search input for real-time live search
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to URL params and reset page to 1
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch.trim()) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, urlSearch, updateUrlParams]);

  // Fetch directly from TanStack Query Books API with all backend-supported parameters
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useBooks({
    page,
    limit,
    search: urlSearch.trim() || undefined,
    author: selectedAuthorId,
    publisher: selectedPublisherId,
    category: selectedCategoryId,
    sortBy: currentSortConfig.sortBy,
    sortOrder: currentSortConfig.sortOrder,
  });

  const apiBooks = apiResponse?.data;
  const meta = apiResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? page;
  const totalBooks = meta?.total ?? (apiBooks ? apiBooks.length : 0);

  // Fetch category details directly to ensure we have human-readable title and name even if books list is loading/empty
  const { data: categoryDetailResponse } = useCategory(selectedCategoryId || "");

  // Derive human-readable names for active filter pills from returned book payload or category query
  const activeCategoryName = useMemo(() => {
    if (!selectedCategoryId) return undefined;
    if (categoryDetailResponse?.data?.name) {
      return categoryDetailResponse.data.name;
    }
    const fromBook = apiBooks
      ?.flatMap((b) => b.categories ?? [])
      .find((c) => c?._id === selectedCategoryId || c?.slug === selectedCategoryId);
    return fromBook?.name || "Category Filter";
  }, [selectedCategoryId, categoryDetailResponse, apiBooks]);

  const activeAuthorName = useMemo(() => {
    if (!selectedAuthorId) return undefined;
    const fromBook = apiBooks
      ?.flatMap((b) => b.authors ?? [])
      .find((a) => a?._id === selectedAuthorId || a?.slug === selectedAuthorId);
    return fromBook?.name || "Author Filter";
  }, [selectedAuthorId, apiBooks]);

  const activePublisherName = useMemo(() => {
    if (!selectedPublisherId) return undefined;
    const fromBook = apiBooks
      ?.map((b) => b.publisher)
      .find((p) => p?._id === selectedPublisherId || p?.slug === selectedPublisherId);
    return fromBook?.name || "Publisher Filter";
  }, [selectedPublisherId, apiBooks]);

  // Directly transform backend API books without frontend filtering/sorting
  const books: CatalogBook[] = useMemo(() => {
    if (Array.isArray(apiBooks)) {
      return apiBooks.map((apiBook) =>
        transformApiBookToCatalogBook(apiBook, FALLBACK_BOOK_COVER),
      );
    }
    return [];
  }, [apiBooks]);

  // Handlers resetting page to 1 on filter/search/sort change
  const handleSelectPublisher = (pubId: string) => {
    const next = selectedPublisherId === pubId ? "" : pubId;
    updateUrlParams({ publisher: next, page: 1 });
  };

  const handleSelectAuthor = (authId: string) => {
    const next = selectedAuthorId === authId ? "" : authId;
    updateUrlParams({ author: next, page: 1 });
  };

  const handleSelectCategory = (catId: string) => {
    const isAlreadySelected =
      selectedCategoryId === catId ||
      (categoryDetailResponse?.data?.slug &&
        selectedCategoryId === categoryDetailResponse.data.slug) ||
      (categoryDetailResponse?.data?._id &&
        selectedCategoryId === categoryDetailResponse.data._id);

    const next = isAlreadySelected ? "" : catId;
    updateUrlParams({ category: next, page: 1 });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUrlParams({ search: searchInput, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateUrlParams({ search: "", page: 1 });
  };

  const handleSortChange = (newSort: SortOption) => {
    updateUrlParams({ sort: newSort, page: 1 });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      updateUrlParams({ page: newPage });
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const activeFiltersCount =
    (selectedPublisherId ? 1 : 0) +
    (selectedAuthorId ? 1 : 0) +
    (selectedCategoryId ? 1 : 0) +
    (urlSearch ? 1 : 0);

  const paginationPages = useMemo(
    () => getPaginationPages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const isBusy = isLoading || isFetching;

  const noDataMessage = useMemo(() => {
    if (urlSearch.trim()) {
      return `No books found for "${urlSearch.trim()}".`;
    }
    if (activeFiltersCount > 0) {
      return "No books found matching your filter criteria.";
    }
    return "No books available in the catalog.";
  }, [urlSearch, activeFiltersCount]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* 3D Animated Hero Banner */}
      <CategoryBanner categoryName={title} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Floating Centered Search Bar */}
        <div className="flex justify-center mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-2xl flex items-center shadow-xs rounded-full overflow-hidden bg-[#F7F1E3] border border-border/70"
          >
            <div className="pl-4 text-muted-foreground">
              <Search size={20} aria-hidden="true" />
            </div>

            <input
              type="search"
              placeholder="Search books by title, Bangla title, tags, description..."
              aria-label="Search books"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full py-3 px-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
            />
{/* 
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search text"
                className="pr-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            )} */}

            <button
              type="submit"
              className="bg-accent text-white px-6 sm:px-8 py-3 font-semibold hover:bg-accent-hover transition-colors text-sm sm:text-base shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12 items-start relative">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <BooksFilterSidebar
              selectedPublisherId={selectedPublisherId}
              onSelectPublisher={handleSelectPublisher}
              selectedAuthorId={selectedAuthorId}
              onSelectAuthor={handleSelectAuthor}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              onClearAll={handleClearAll}
              showCategoriesSection={showCategoriesFilter}
              className="w-full py-2 pr-0 md:py-2 md:w-full"
            />
          </div>

          {/* Right Main Column */}
          <main className="flex-1 w-full min-w-0 py-2">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
              {/* Count & Status */}
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-foreground">
                  {isBusy ? (
                    "Searching books..."
                  ) : (
                    <>
                      Showing {books.length} of {totalBooks} books
                      {totalPages > 1 && (
                        <span className="text-muted-foreground font-normal ml-1.5 hidden sm:inline">
                          (Page {currentPage} of {totalPages})
                        </span>
                      )}
                    </>
                  )}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="hidden sm:inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    {activeFiltersCount} active filter
                    {activeFiltersCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="md:hidden flex items-center gap-1.5 rounded-full border border-border/70 bg-[#F7F1E3] px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-accent"
                >
                  <Filter size={13} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowUpDown size={13} className="hidden sm:inline" />
                  <span className="hidden sm:inline font-medium">Sort:</span>
                  <Select
                    value={sortOption}
                    onValueChange={(value) =>
                      handleSortChange(value as SortOption)
                    }
                  >
                    <SelectTrigger
                      aria-label="Sort books"
                      className="h-8 min-w-[140px] sm:min-w-[160px] rounded-lg border-border/70 bg-[#F7F1E3] px-2.5 py-1 text-xs font-medium text-foreground hover:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    >
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent
                      align="end"
                      className="bg-[#F7F1E3] border-border/70 shadow-md"
                    >
                      {VALID_SORTS.map((opt) => (
                        <SelectItem
                          key={opt}
                          value={opt}
                          className="text-xs cursor-pointer focus:bg-accent/10 focus:text-accent"
                        >
                          {SORT_MAP[opt].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filter Pills Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 pb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Active:
                </span>

                {urlSearch && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-[#F7F1E3] px-2.5 py-1 text-xs font-medium text-foreground">
                    &ldquo;{urlSearch}&rdquo;
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedPublisherId && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {activePublisherName}
                    <button
                      type="button"
                      onClick={() => handleSelectPublisher(selectedPublisherId)}
                      className="text-accent hover:text-accent-hover cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedAuthorId && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {activeAuthorName}
                    <button
                      type="button"
                      onClick={() => handleSelectAuthor(selectedAuthorId)}
                      className="text-accent hover:text-accent-hover cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedCategoryId && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {activeCategoryName}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(selectedCategoryId)}
                      className="text-accent hover:text-accent-hover cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-destructive hover:underline ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Error Message State */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-destructive/20 rounded-xl bg-destructive/5 my-6 p-8">
                <AlertCircle className="text-destructive mb-3" size={32} />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Unable to load books from server
                </h3>
                <p className="text-xs text-muted-foreground mb-4 max-w-sm">
                  There was a problem connecting to the books service. Please try
                  again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RotateCcw size={14} />
                  Retry
                </Button>
              </div>
            )}

            {/* Loading / Searching Skeleton Grid */}
            {isBusy && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 py-6">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <BookCardSkeleton key={`skeleton-${idx}`} />
                ))}
              </div>
            )}

            {/* Loaded Books Grid */}
            {!isBusy && !isError && books.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 py-6">
                {books.map((book, idx) => (
                  <BookCard
                    key={book.id || `${book.title}-${idx}`}
                    book={book}
                    priority={idx < 5}
                  />
                ))}
              </div>
            )}

            {/* Clean NoData Component State */}
            {!isBusy && !isError && books.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <NoData size={200} text={noDataMessage} className="w-full" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="mt-6 gap-2 hover:bg-accent hover:text-white hover:border-accent cursor-pointer transition-colors"
                >
                  <RotateCcw size={14} />
                  Reset all filters
                </Button>
              </div>
            )}

            {/* Orange Theme Round Circle Pagination UI */}
            {!isBusy && !isError && totalPages > 1 && (
              <div className="flex flex-col items-center justify-center gap-3 pt-10 pb-6 border-t border-border/60 mt-8">
                <nav
                  aria-label="Books catalog pagination"
                  className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
                >
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label="Go to previous page"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-border/80 bg-card text-foreground shadow-2xs hover:bg-accent hover:text-white hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Number Circles */}
                  {paginationPages.map((item, idx) => {
                    if (item === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-xs text-muted-foreground select-none"
                        >
                          ...
                        </span>
                      );
                    }

                    const isCurrent = item === currentPage;
                    return (
                      <button
                        key={`page-${item}`}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        aria-current={isCurrent ? "page" : undefined}
                        aria-label={`Page ${item}`}
                        className={cn(
                          "h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                          isCurrent
                            ? "bg-accent text-white border border-accent shadow-md shadow-accent/25 font-bold scale-105"
                            : "border border-border/70 bg-card text-foreground/80 hover:bg-accent/15 hover:text-accent hover:border-accent/40",
                        )}
                      >
                        {item}
                      </button>
                    );
                  })}

                  {/* Next Page Button */}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label="Go to next page"
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center border border-border/80 bg-card text-foreground shadow-2xs hover:bg-accent hover:text-white hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>

                {/* Page Summary Info */}
                <span className="text-xs text-muted-foreground font-medium">
                  Page {currentPage} of {totalPages} ({totalBooks} total books)
                </span>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-background p-6 shadow-2xl overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                <SlidersHorizontal size={18} className="text-accent" />
                <span>Filter Books</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <BooksFilterSidebar
              selectedPublisherId={selectedPublisherId}
              onSelectPublisher={handleSelectPublisher}
              selectedAuthorId={selectedAuthorId}
              onSelectAuthor={handleSelectAuthor}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              onClearAll={handleClearAll}
              showCategoriesSection={showCategoriesFilter}
              className="w-full py-4 pr-0"
            />

            <div className="mt-auto pt-4 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClearAll}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-accent text-white hover:bg-accent-hover"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply ({books.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksCatalogPage;
