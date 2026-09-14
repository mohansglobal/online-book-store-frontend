"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { useOrdersQuery } from "../queries/use-orders-query";
import { OrderStatusTabs } from "./order-status-tabs";
import { OrderDateFilter } from "./order-date-filter";
import { OrderCard } from "./order-card";
import { OrderEmptyState } from "./order-empty-state";
import { OrderSkeletonList } from "./order-skeleton";
import type {
  OrderTabFilter,
  DateRangeFilterOption,
  OrdersQueryParams,
} from "../types/order.types";
import {
  matchesTabFilter,
  filterOrdersByDateRange,
} from "../utils/order-helpers";

export function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<OrderTabFilter>("ALL");
  const [selectedRange, setSelectedRange] =
    useState<DateRangeFilterOption>("ALL_TIME");

  const queryParams = useMemo(() => {
    const params: OrdersQueryParams = {
      page: 1,
      limit: 50,
    };
    if (selectedRange !== "ALL_TIME") {
      params.dateRange = selectedRange;
    }
    if (selectedTab === "DELIVERED") {
      params.status = "DELIVERED";
    } else if (selectedTab === "CANCELLED") {
      params.status = "CANCELLED";
    }
    return params;
  }, [selectedRange, selectedTab]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useOrdersQuery(queryParams);

  const allOrders = response?.data || [];

  // Filter orders by active status tab and date range
  const filteredOrders = useMemo(() => {
    const statusFiltered = allOrders.filter((order) =>
      matchesTabFilter(order.orderStatus, selectedTab),
    );
    return filterOrdersByDateRange(statusFiltered, selectedRange);
  }, [allOrders, selectedTab, selectedRange]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      {/* 3D Carousel Category Banner */}
      <CategoryBanner categoryName="My Orders" compact />

      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Top Filter Navigation Bar (Pills on left, Date range on right) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <OrderStatusTabs
              selectedTab={selectedTab}
              onSelectTab={setSelectedTab}
            />

            <OrderDateFilter
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />
          </div>

          {/* Loading Skeletons */}
          {isLoading && <OrderSkeletonList />}

          {/* Error State */}
          {isError && !isLoading && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                Unable to Load Orders
              </h2>
              <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                We encountered an issue fetching your orders. Please check your
                connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={isRefetching ? "animate-spin" : ""}
                />
                <span>{isRefetching ? "Retrying..." : "Retry"}</span>
              </button>
            </div>
          )}

          {/* Empty Orders State */}
          {!isLoading && !isError && filteredOrders.length === 0 && (
            <OrderEmptyState
              selectedTab={selectedTab}
              selectedRange={selectedRange}
              hasAnyOrders={allOrders.length > 0}
              onResetFilter={() => {
                setSelectedTab("ALL");
                setSelectedRange("ALL_TIME");
              }}
            />
          )}


          {/* Orders Cards List */}
          {!isLoading && !isError && filteredOrders.length > 0 && (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
