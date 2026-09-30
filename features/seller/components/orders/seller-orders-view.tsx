"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSellerOrders } from "../../queries/use-seller-orders";
import { SellerOrderStatusDialog } from "../seller-order-status-dialog";
import type { SellerOrder, SellerOrdersQueryParams } from "../../types/seller.types";
import {
  SellerOrdersFilterSidebar,
  type SellerOrdersFiltersState,
} from "./seller-orders-filter-sidebar";
import { SellerOrdersHeader } from "./seller-orders-header";
import { SellerOrdersList } from "./seller-orders-list";
import { toSellerRecentOrder } from "./seller-order-adapter";

const INITIAL_FILTERS: SellerOrdersFiltersState = {
  search: "",
  status: "ALL",
  dateRange: "ALL_TIME",
  paymentMethod: "ALL",
};

export function SellerOrdersView() {
  const [filters, setFilters] = useState<SellerOrdersFiltersState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const queryParams: SellerOrdersQueryParams = useMemo(() => {
    return {
      page,
      limit: 20,
      status: filters.status !== "ALL" ? filters.status : undefined,
      dateRange: filters.dateRange !== "ALL_TIME" ? filters.dateRange : undefined,
    };
  }, [page, filters.status, filters.dateRange]);

  const { data: response, isLoading, isFetching, refetch } = useSellerOrders(queryParams);

  const rawOrders: SellerOrder[] = useMemo(() => {
    return response?.data || [];
  }, [response]);

  // Client-side filtering for search & payment method
  const filteredOrders = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    return rawOrders.filter((order) => {
      // Payment method filter
      if (
        filters.paymentMethod !== "ALL" &&
        order.paymentMethod !== filters.paymentMethod
      ) {
        return false;
      }

      // Search filter matching Order #, MongoDB ID, buyer name, email, item titles
      if (searchLower) {
        const matchesNumber = order.orderNumber.toLowerCase().includes(searchLower);
        const matchesId = order._id.toLowerCase().includes(searchLower);
        const matchesBuyerName = order.buyer?.name?.toLowerCase().includes(searchLower) ?? false;
        const matchesBuyerEmail = order.buyer?.email?.toLowerCase().includes(searchLower) ?? false;
        const matchesAddressName = order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ?? false;
        const matchesItemTitle = order.items.some((it) =>
          it.title.toLowerCase().includes(searchLower),
        );

        if (
          !matchesNumber &&
          !matchesId &&
          !matchesBuyerName &&
          !matchesBuyerEmail &&
          !matchesAddressName &&
          !matchesItemTitle
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rawOrders, filters.search, filters.paymentMethod]);

  const handleFilterChange = (nextFilters: SellerOrdersFiltersState) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== "ALL" ||
    filters.dateRange !== "ALL_TIME" ||
    filters.paymentMethod !== "ALL";

  const dialogOrder = selectedOrder ? toSellerRecentOrder(selectedOrder) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SellerOrdersHeader
        totalCount={filteredOrders.length}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onOpenMobileFilters={() => setMobileFilterOpen(true)}
      />

      {/* Main Layout: Filters on left, Order Cards on right */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SellerOrdersFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalOrdersCount={filteredOrders.length}
          />
        </div>

        {/* Mobile Drawer */}
        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
          <SheetContent side="left" className="w-80 p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border/40 p-4">
              <SheetTitle className="text-base font-bold">Filters</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <SellerOrdersFilterSidebar
                filters={filters}
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  setMobileFilterOpen(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                totalOrdersCount={filteredOrders.length}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Content Area: Orders List */}
        <main className="flex-1 min-w-0">
          <SellerOrdersList
            orders={filteredOrders}
            isLoading={isLoading}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onOpenStatusDialog={(order) => setSelectedOrder(order)}
            meta={response?.meta}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </main>
      </div>

      {/* Status Update Modal */}
      <SellerOrderStatusDialog
        order={dialogOrder}
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      />
    </div>
  );
}
