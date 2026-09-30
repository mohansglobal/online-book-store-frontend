"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import emptyOrderIllustration from "@/assets/emptyorder.png";
import { Button } from "@/components/ui/button";

interface SellerOrdersEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function SellerOrdersEmptyState({
  hasFilters,
  onResetFilters,
}: SellerOrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-surface/80 p-8 text-center shadow-xs sm:p-12">
      {/* Decorative Empty Order Illustration with Glow */}
      <div className="relative mb-5 w-44 sm:w-52">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-2xl animate-pulse"
        />
        <Image
          src={emptyOrderIllustration}
          alt="Illustration of empty orders"
          width={220}
          height={220}
          className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-xs"
          priority
        />
      </div>

      <h3 className="text-lg font-bold text-foreground sm:text-xl">
        {hasFilters ? "No Matching Orders Found" : "No Orders Yet"}
      </h3>

      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {hasFilters
          ? "We couldn't find any orders matching your search or active filter criteria. Try adjusting your filters or search terms."
          : "When customers purchase books from your store listings, their orders will appear here for you to manage and fulfill."}
      </p>

      {hasFilters && (
        <Button
          type="button"
          size="sm"
          onClick={onResetFilters}
          className="mt-6 h-9 cursor-pointer gap-2 rounded-xl bg-accent px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-hover active:scale-95 sm:text-sm"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset All Filters</span>
        </Button>
      )}
    </div>
  );
}
