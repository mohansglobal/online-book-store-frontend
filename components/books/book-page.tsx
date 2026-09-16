// Seller Inventory / Products Management Page
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminTopNav } from "./components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import {
  useMyBookListings,
  useToggleListingStatusMutation,
  useUpdateListingStockMutation,
} from "@/features/books";
import { InventoryControls } from "./inventory/inventory-controls";
import { InventoryTable } from "./inventory/inventory-table";
import { InventoryPagination } from "./inventory/inventory-pagination";
import type { StatusFilter } from "./inventory/inventory-types";
import type { StockOperation } from "@/features/books/types/listing.types";

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [updatingListingId, setUpdatingListingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm.trim(), 350);

  // Fetch real seller listings from /api/v1/book-listings/my-listings
  const isActiveParam =
    statusFilter === "all" ? undefined : statusFilter === "active";

  const { data: response, isLoading } = useMyBookListings({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
  });

  const listings = Array.isArray(response?.data) ? response.data : [];
  const meta = response?.meta;

  const total = meta?.total ?? listings.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  // Atomic stock mutation with optimistic update
  const updateStockMutation = useUpdateListingStockMutation({
    onSuccess: (result) => {
      setUpdatingListingId(null);
      const updatedStock = result.data?.stock ?? 0;
      toast.success(`Stock updated to ${updatedStock}`);
    },
    onError: (error) => {
      setUpdatingListingId(null);
      toast.error(error.message || "Failed to update stock");
    },
  });

  // Active/inactive status toggle mutation with optimistic update
  const toggleStatusMutation = useToggleListingStatusMutation({
    onSuccess: (result) => {
      const isNowActive = result.data?.isActive;
      toast.success(
        isNowActive
          ? "Product activated successfully"
          : "Product deactivated successfully",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const handleUpdateStock = (
    listingId: string,
    operation: StockOperation,
    quantity: number,
    bookTitle: string,
  ) => {
    setUpdatingListingId(listingId);
    updateStockMutation.mutate({
      listingId,
      operation,
      quantity,
    });
  };

  const handleToggleStatus = (
    listingId: string,
    currentStatus: boolean,
    bookTitle: string,
  ) => {
    toggleStatusMutation.mutate({
      listingId,
      isActive: !currentStatus,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="inventory" />

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {/* Controls: Search, Filters, Add Product */}
            <InventoryControls
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
            />

            {/* Table */}
            <InventoryTable
              listings={listings}
              isLoading={isLoading}
              page={page}
              limit={limit}
              onUpdateStock={handleUpdateStock}
              onToggleStatus={handleToggleStatus}
              updatingListingId={updatingListingId}
            />

            {/* Pagination */}
            <InventoryPagination
              page={page}
              totalPages={totalPages}
              total={total}
              itemCount={listings.length}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}