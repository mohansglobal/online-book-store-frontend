"use client";

import React from "react";

export function OrderSkeletonList() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading orders">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-stretch overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-xs animate-pulse"
        >
          {/* Left Full-Bleed Skeleton Image Block */}
          <div className="w-[76px] sm:w-[90px] shrink-0 border-r border-border/70 bg-surface-soft min-h-[105px]" />

          {/* Right Content Area Skeleton */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3.5 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 w-32 rounded bg-surface-soft" />
              <div className="h-4 w-28 rounded-full bg-surface-soft" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="h-3 w-3/4 rounded bg-surface-soft" />
              <div className="h-5 w-5 rounded bg-surface-soft/60 shrink-0" />
            </div>

            <div className="h-4 w-20 rounded bg-surface-soft" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading orders...</span>
    </div>
  );
}
