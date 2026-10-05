// Admin Category Dashboard Page combining metrics, filters, categories list, and edit dialog
"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminTopNav } from "@/components/books/components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import { Button } from "@/components/ui/button";
import { useCategories } from "../hooks/use-categories";
import type { Category } from "../types/category.types";
import { CategoryFilters } from "./category-filters";
import { CategoryCardGrid } from "./category-card-grid";
import { CategoryPagination } from "./category-pagination";
import { CategoryEditModal } from "./category-edit-modal";

export function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm.trim(), 300);

  // Compute active parameter for query
  let isActiveParam: boolean | undefined = undefined;
  if (statusFilter === "active") isActiveParam = true;
  if (statusFilter === "inactive") isActiveParam = false;

  // Query for paginated categories table
  const {
    data: categoriesResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useCategories({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
    sortBy: "name",
    sortOrder: "asc",
  });

  const categories = categoriesResponse?.data ?? [];
  const meta = categoriesResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm) || statusFilter !== "all";

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="category" />

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className=" text-2xl font-semibold tracking-tight text-foreground">
                Category Management
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage bookstore taxonomy, active visibility, and catalog classifications.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="h-9 cursor-pointer gap-2 rounded-xl text-xs font-medium shadow-none hover:bg-surface"
              >
                <RotateCcw
                  size={14}
                  className={isRefetching ? "animate-spin" : ""}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Summary Cards */}
          {/* <CategoryStatsCards
            totalCategories={stats.totalCategories}
            activeCategories={stats.activeCategories}
            inactiveCategories={stats.inactiveCategories}
            totalBookListings={stats.totalBookListings}
            isLoading={isAllLoading}
          /> */}

          {/* Commented out previous block as requested: */}
          {/*
          <CategoryFilters
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            onEditCategory={handleEditCategory}
          />

          <CategoryPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
          */}

          {/* Search & Filter Controls */}
          <CategoryFilters
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Category Cards Grid with Background Images & Edit Icon */}
          <CategoryCardGrid
            categories={categories}
            isLoading={isLoading}
            onEditCategory={handleEditCategory}
          />

          {/* Pagination */}
          <CategoryPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      </main>

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <CategoryEditModal
          key={selectedCategory?._id}
          category={selectedCategory}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
}
