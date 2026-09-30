"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SellerOrdersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={`seller-order-skeleton-${idx}`}
          className="rounded-2xl border border-border bg-surface p-3.5 shadow-sm space-y-3 sm:p-4"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-12 w-9 rounded-lg" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <Skeleton className="h-3.5 w-44 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
