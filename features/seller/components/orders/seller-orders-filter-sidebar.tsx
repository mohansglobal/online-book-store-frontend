"use client";

import { Search, X, Filter, RotateCcw, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SellerOrdersFiltersState {
  search: string;
  status: string;
  dateRange: string;
  paymentMethod: string;
}

interface SellerOrdersFilterSidebarProps {
  filters: SellerOrdersFiltersState;
  onFilterChange: (filters: SellerOrdersFiltersState) => void;
  onReset: () => void;
  totalOrdersCount?: number;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses", color: "bg-muted-foreground" },
  { value: "PENDING", label: "Pending", color: "bg-amber-500" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-teal-500" },
  { value: "PROCESSING", label: "Processing", color: "bg-indigo-500" },
  { value: "SHIPPED", label: "Shipped", color: "bg-blue-500" },
  { value: "DELIVERED", label: "Delivered", color: "bg-emerald-500" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-rose-500" },
] as const;

const DATE_RANGE_OPTIONS = [
  { value: "ALL_TIME", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "last3months", label: "Last 3 Months" },
] as const;

const PAYMENT_OPTIONS = [
  { value: "ALL", label: "All Methods" },
  { value: "ONLINE_PAY", label: "Online Pay" },
  { value: "CASH_ON_DELIVERY", label: "Cash On Delivery" },
] as const;

export function SellerOrdersFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  totalOrdersCount,
}: SellerOrdersFilterSidebarProps) {
  const isSearchActive = filters.search.trim().length > 0;
  const isStatusActive = filters.status !== "ALL";
  const isDateActive = filters.dateRange !== "ALL_TIME";
  const isPaymentActive = filters.paymentMethod !== "ALL";

  const activeFiltersCount =
    (isSearchActive ? 1 : 0) +
    (isStatusActive ? 1 : 0) +
    (isDateActive ? 1 : 0) +
    (isPaymentActive ? 1 : 0);

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      search: value,
    });
  };

  const handleStatusChange = (statusValue: string) => {
    onFilterChange({
      ...filters,
      status: statusValue,
    });
  };

  const handleDateChange = (dateValue: string) => {
    onFilterChange({
      ...filters,
      dateRange: dateValue,
    });
  };

  const handlePaymentChange = (paymentValue: string) => {
    onFilterChange({
      ...filters,
      paymentMethod: paymentValue,
    });
  };

  return (
    <aside className="w-full space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:w-72 lg:shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Filter size={16} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground">Filters</h2>
            {totalOrdersCount !== undefined && (
              <p className="text-[11px] text-muted-foreground">
                {totalOrdersCount} orders found
              </p>
            )}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 cursor-pointer gap-1 px-2 text-xs font-semibold text-accent hover:bg-accent/10 hover:text-accent"
          >
            <RotateCcw size={11} aria-hidden="true" />
            <span>Reset ({activeFiltersCount})</span>
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label
          htmlFor="order-search-input"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Search Orders
        </label>

        <div className="relative">
          <Search
            size={15}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="order-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Order ID, buyer name..."
            className="h-9.5 rounded-xl pl-9 pr-8 text-xs transition-colors focus-visible:ring-1 focus-visible:ring-accent"
          />

          {isSearchActive && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => handleSearchChange("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fulfillment Status
        </span>

        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map((item) => {
            const isSelected = filters.status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleStatusChange(item.value)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${item.color}`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>

                {isSelected && (
                  <Check
                    size={14}
                    aria-hidden="true"
                    className="text-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2.5 border-t border-border/40 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Date Placed
        </span>

        <div className="grid grid-cols-1 gap-1">
          {DATE_RANGE_OPTIONS.map((item) => {
            const isSelected = filters.dateRange === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleDateChange(item.value)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <Check
                    size={13}
                    aria-hidden="true"
                    className="text-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Method Filter */}
      <div className="space-y-2.5 border-t border-border/40 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Payment Method
        </span>

        <div className="grid grid-cols-1 gap-1">
          {PAYMENT_OPTIONS.map((item) => {
            const isSelected = filters.paymentMethod === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handlePaymentChange(item.value)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <Check
                    size={13}
                    aria-hidden="true"
                    className="text-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
