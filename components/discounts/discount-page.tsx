// Seller Discount Management Page
"use client";

import React, { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminTopNav } from "@/components/books/components/AdminTopNav";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { Footer, Navbar } from "@/components/home/components";
import {
  useMyBookListings,
  type SellerBookListingItem,
} from "@/features/books";
import { DiscountControls } from "./discount-controls";
import { DiscountTable } from "./discount-table";
import { DiscountModal } from "./discount-modal";
import { InventoryPagination } from "@/components/books/inventory/inventory-pagination";
import type { DiscountStatusFilter } from "./discount-types";

export default function DiscountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiscountStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [selectedListing, setSelectedListing] =
    useState<SellerBookListingItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const trimmedSearch = searchTerm.trim();
  const debouncedSearch = useDebounce(trimmedSearch, 350);

  // Determine active status parameter for backend query
  let isActiveParam: boolean | undefined = undefined;

  if (statusFilter === "active") {
    isActiveParam = true;
  }

  if (statusFilter === "inactive") {
    isActiveParam = false;
  }

  // Fetch seller listings from inventory API
  const { data: response, isLoading } = useMyBookListings({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
  });

  const rawListings = Array.isArray(response?.data) ? response.data : [];

  // Filter for discounted items if selected
  const isDiscountedItem = (item: SellerBookListingItem) => {
    const mrpInPaise = item.mrpInPaise ?? 0;
    const sellingPriceInPaise = item.sellingPriceInPaise ?? mrpInPaise;

    const hasDiscount = mrpInPaise > 0 && sellingPriceInPaise < mrpInPaise;

    return hasDiscount;
  };

  let listings = rawListings;

  if (statusFilter === "discounted") {
    listings = rawListings.filter(isDiscountedItem);
  }

  const meta = response?.meta;
  const total = meta?.total ?? rawListings.length;
  const calculatedPages = Math.ceil(total / limit);
  const totalPages = meta?.totalPages ?? Math.max(1, calculatedPages);

  const handleOpenEditModal = (listing: SellerBookListingItem) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: DiscountStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="discounts" />

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            {/* Controls: Search, Filters, Reset, Total */}
            <DiscountControls
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              onReset={handleReset}
              totalCount={listings.length}
            />

            {/* Table */}
            <DiscountTable
              listings={listings}
              isLoading={isLoading}
              page={page}
              limit={limit}
              onOpenEditModal={handleOpenEditModal}
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

      {/* Edit Discount Modal */}
      <DiscountModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
}