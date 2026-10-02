"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SellerOrder } from "../../types/seller.types";
import { SellerOrderCard } from "./seller-order-card";
import { SellerOrdersSkeleton } from "./seller-orders-skeleton";
import { SellerOrdersEmptyState } from "./seller-orders-empty-state";

interface SellerOrdersListProps {
  orders: SellerOrder[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenStatusDialog: (order: SellerOrder) => void;
}

export function SellerOrdersList({
  orders,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
  hasFilters,
  onResetFilters,
  onOpenStatusDialog,
}: SellerOrdersListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto-fetch next page on scroll when sentinel enters viewport
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

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

      {/* Infinite Scroll Sentinel & Status Indicators */}
      <div ref={loadMoreRef} className="py-2">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-muted-foreground">
            <Loader2 size={16} className="animate-spin text-accent" />
            <span>Loading more orders...</span>
          </div>
        )}

        {!hasNextPage && orders.length > 0 && (
          <div className="flex items-center justify-center py-6 text-xs text-muted-foreground/80">
            <p>You&apos;ve reached the end of your orders.</p>
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onFetchNextPage}
              className="h-8 cursor-pointer rounded-xl text-xs font-semibold text-muted-foreground hover:bg-surface hover:text-foreground"
            >
              Load more orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
