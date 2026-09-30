"use client";

import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SellerOrdersHeaderProps {
  totalCount: number;
  isFetching: boolean;
  onRefresh: () => void;
  onOpenMobileFilters?: () => void;
}

export function SellerOrdersHeader({
  totalCount,
  isFetching,
  onRefresh,
  onOpenMobileFilters,
}: SellerOrdersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">
          Showing <strong className="text-foreground">{totalCount}</strong> orders
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onOpenMobileFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenMobileFilters}
            className="flex h-8.5 cursor-pointer items-center gap-1.5 rounded-xl text-xs font-semibold lg:hidden"
          >
            <Filter size={13} aria-hidden="true" />
            <span>Filters</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="flex h-8.5 cursor-pointer items-center gap-1.5 rounded-xl text-xs font-semibold text-text-secondary transition-colors hover:bg-surface hover:text-foreground active:scale-95"
        >
          <RefreshCw
            size={12}
            aria-hidden="true"
            className={isFetching ? "animate-spin text-accent" : ""}
          />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
}
