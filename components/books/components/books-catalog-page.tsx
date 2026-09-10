"use client";

import React, { useMemo, useState } from "react";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { BooksFilterSidebar } from "./books-filter-sidebar";
import { BooksSearchBar } from "./books-search-bar";
import { BooksCatalogToolbar, type SortOption } from "./books-catalog-toolbar";
import { BooksActiveFilters } from "./books-active-filters";
import { BooksPagination } from "./books-pagination";
import { BooksGrid } from "./books-grid";
import { BooksMobileFiltersDrawer } from "./books-mobile-filters-drawer";
import { useBooks } from "@/features/books/hooks/use-books";
import { useCategories, useCategory } from "@/features/categories";
import { useAuthors } from "@/features/authors";
import { usePublishers } from "@/features/publishers";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
  type CatalogBook,
} from "@/features/books/types/book.types";
import { useBooksCatalogFilters } from "../hooks/use-books-catalog-filters";
import { useBooksLabelLookup } from "../hooks/use-books-label-lookup";

import { buildActiveFiltersList } from "../utils/build-active-filters";

export interface BooksCatalogPageProps {
  title?: string;
  initialCategoryId?: string;
  initialAuthorId?: string;
  initialPublisherId?: string;
  showCategoriesFilter?: boolean;
}

export function BooksCatalogPage({
  title = "BOOKS",
  initialCategoryId,
  initialAuthorId,
  initialPublisherId,
  showCategoriesFilter = true,
}: BooksCatalogPageProps) {
  // Reference queries for label lookup
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: authorsData } = useAuthors({ limit: 100 });
  const { data: publishersData } = usePublishers({ limit: 100 });

  const filterState = useBooksCatalogFilters({
    initialCategoryId,
    initialAuthorId,
    initialPublisherId,
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Single category detail if only 1 category is filtered
  const singleCategoryId =
    filterState.selectedCategoryIds.length === 1 ? filterState.selectedCategoryIds[0] : "";
  const { data: categoryDetail } = useCategory(singleCategoryId);

  // Main Books query with full backend multi-filter and sort support
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useBooks({
    page: filterState.page,
    limit: filterState.limit,
    search: filterState.urlSearch.trim() || undefined,
    author:
      filterState.selectedAuthorIds.length > 0
        ? filterState.selectedAuthorIds.join(",")
        : undefined,
    publisher:
      filterState.selectedPublisherIds.length > 0
        ? filterState.selectedPublisherIds.join(",")
        : undefined,
    category:
      filterState.selectedCategoryIds.length > 0
        ? filterState.selectedCategoryIds.join(",")
        : undefined,
    minPrice: filterState.minPrice,
    maxPrice: filterState.maxPrice,
    sortBy: filterState.currentSortConfig.sortBy,
    sortOrder: filterState.currentSortConfig.sortOrder,
  });

  const apiBooks = apiResponse?.data;
  const meta = apiResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? filterState.page;
  const totalBooks = meta?.total ?? (apiBooks ? apiBooks.length : 0);

  const labelLookupMap = useBooksLabelLookup({
    dynamicLabels: filterState.dynamicLabels,
    categoriesData,
    authorsData,
    publishersData,
    categoryDetail,
    apiBooks,
  });

  // Build active filters list with label lookup map
  const activeFiltersList = useMemo(
    () =>
      buildActiveFiltersList({
        urlSearch: filterState.urlSearch,
        minPrice: filterState.minPrice,
        maxPrice: filterState.maxPrice,
        selectedPublisherIds: filterState.selectedPublisherIds,
        selectedAuthorIds: filterState.selectedAuthorIds,
        selectedCategoryIds: filterState.selectedCategoryIds,
        labelLookupMap,
        onRemoveSearch: () => filterState.updateUrlParams({ search: "", page: 1 }),
        onClearPrice: filterState.handleClearPrice,
        onTogglePublisher: (id) => filterState.handleTogglePublisher(id),
        onToggleAuthor: (id) => filterState.handleToggleAuthor(id),
        onToggleCategory: (id) => filterState.handleToggleCategory(id),
      }),
    [
      filterState,
      labelLookupMap,
    ],
  );

  // Transformed books for UI presentation
  const books: CatalogBook[] = useMemo(() => {
    if (Array.isArray(apiBooks)) {
      return apiBooks.map((b) => transformApiBookToCatalogBook(b, FALLBACK_BOOK_COVER));
    }
    return [];
  }, [apiBooks]);

  const isBusy = isLoading || isFetching;

  const noDataMessage = useMemo(() => {
    if (filterState.urlSearch.trim()) {
      return `No books found for "${filterState.urlSearch.trim()}".`;
    }
    if (activeFiltersList.length > 0) {
      return "No books found matching your filter criteria.";
    }
    return "No books available in the catalog.";
  }, [filterState.urlSearch, activeFiltersList.length]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      filterState.updateUrlParams({ page: newPage });
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const filterSidebarNode = (
    <BooksFilterSidebar
      selectedPublisherIds={filterState.selectedPublisherIds}
      onSelectPublisher={filterState.handleTogglePublisher}
      selectedAuthorIds={filterState.selectedAuthorIds}
      onSelectAuthor={filterState.handleToggleAuthor}
      selectedCategoryIds={filterState.selectedCategoryIds}
      onSelectCategory={filterState.handleToggleCategory}
      minPrice={filterState.minPrice}
      maxPrice={filterState.maxPrice}
      onApplyPrice={filterState.handleApplyPrice}
      onClearPrice={filterState.handleClearPrice}
      onClearAll={filterState.handleClearAll}
      showCategoriesSection={showCategoriesFilter}
      className="w-full pr-0 md:w-full"
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* 3D Animated Hero Banner */}
      <CategoryBanner categoryName={title} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Floating Centered Search Bar */}
        <BooksSearchBar
          value={filterState.searchInput}
          onChange={filterState.setSearchInput}
          onSubmit={(e) => {
            if (e) e.preventDefault();
            filterState.updateUrlParams({ search: filterState.searchInput, page: 1 });
          }}
          onClear={() => filterState.updateUrlParams({ search: "", page: 1 })}
        />

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12 items-start relative">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterSidebarNode}
          </div>

          {/* Right Main Column */}
          <main className="flex-1 w-full min-w-0 py-2">
            {/* Toolbar Action Bar */}
            <BooksCatalogToolbar
              totalBooks={totalBooks}
              currentCount={books.length}
              currentPage={currentPage}
              totalPages={totalPages}
              activeFiltersCount={activeFiltersList.length}
              isBusy={isBusy}
              sortOption={filterState.sortOption}
              onSortChange={(newSort: SortOption) =>
                filterState.updateUrlParams({ sort: newSort, page: 1 })
              }
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            />

            {/* Active Filter Pills Bar */}
            <BooksActiveFilters
              filters={activeFiltersList}
              onClearAll={filterState.handleClearAll}
            />

            {/* Grid / Skeletons / Error / Empty States */}
            <BooksGrid
              books={books}
              isBusy={isBusy}
              isError={isError}
              noDataMessage={noDataMessage}
              onRetry={() => refetch()}
              onClearAll={filterState.handleClearAll}
            />

            {/* Pagination UI */}
            {!isBusy && !isError && (
              <BooksPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalBooks={totalBooks}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      <BooksMobileFiltersDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        appliedCount={books.length}
        onClearAll={filterState.handleClearAll}
      >
        {filterSidebarNode}
      </BooksMobileFiltersDrawer>
    </div>
  );
}

export default BooksCatalogPage;
