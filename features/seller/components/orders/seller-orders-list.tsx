"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SellerOrder, SellerPaginationMeta } from "../../types/seller.types";
import { SellerOrderCard } from "./seller-order-card";
import { SellerOrdersSkeleton } from "./seller-orders-skeleton";
import { SellerOrdersEmptyState } from "./seller-orders-empty-state";

interface SellerOrdersListProps {
  orders: SellerOrder[];
  isLoading: boolean;
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenStatusDialog: (order: SellerOrder) => void;
  meta?: SellerPaginationMeta;
  onPageChange: (page: number) => void;
}

export function SellerOrdersList({
  orders,
  isLoading,
  hasFilters,
  onResetFilters,
  onOpenStatusDialog,
  meta,
  onPageChange,
}: SellerOrdersListProps) {
  if (isLoading) {
    return <SellerOrdersSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <SellerOrdersEmptyState
        hasFilters={hasFilters}
        onResetFilters={onResetFilters}
      />
    );
  }

  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="space-y-4">
      {/* Order Cards */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <SellerOrderCard
            key={order._id}
            order={order}
            onOpenStatusDialog={onOpenStatusDialog}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canGoPrev}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 cursor-pointer gap-1 px-2.5 text-xs font-medium"
            >
              <ChevronLeft size={13} aria-hidden="true" />
              <span>Previous</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canGoNext}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 cursor-pointer gap-1 px-2.5 text-xs font-medium"
            >
              <span>Next</span>
              <ChevronRight size={13} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
