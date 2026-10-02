"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useInfiniteSellerOrders } from "../../queries/use-seller-orders";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const queryParams: Omit<SellerOrdersQueryParams, "page"> = useMemo(() => {
    return {
      limit: 20,
      status: filters.status !== "ALL" ? filters.status : undefined,
      dateRange: filters.dateRange !== "ALL_TIME" ? filters.dateRange : undefined,
    };
  }, [filters.status, filters.dateRange]);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteSellerOrders(queryParams);

  // Flatten accumulated pages from infinite query
  const rawOrders: SellerOrder[] = useMemo(() => {
    if (data?.pages) {
      return data.pages.flatMap((page) => page.data ?? []);
    }
    return [];
  }, [data]);

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
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== "ALL" ||
    filters.dateRange !== "ALL_TIME" ||
    filters.paymentMethod !== "ALL";

  const dialogOrder = selectedOrder ? toSellerRecentOrder(selectedOrder) : null;
  const totalCount = data?.pages?.[0]?.meta?.total ?? filteredOrders.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SellerOrdersHeader
        totalCount={totalCount}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onOpenMobileFilters={() => setMobileFilterOpen(true)}
      />

      {/* Main Layout: Filters on left, Order Cards on right */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-20 lg:shrink-0 lg:self-start">
          <SellerOrdersFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalOrdersCount={totalCount}
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
                totalOrdersCount={totalCount}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Content Area: Orders List */}
        <main className="flex-1 min-w-0">
          <SellerOrdersList
            orders={filteredOrders}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={Boolean(hasNextPage)}
            onFetchNextPage={() => fetchNextPage()}
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onOpenStatusDialog={(order) => setSelectedOrder(order)}
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
