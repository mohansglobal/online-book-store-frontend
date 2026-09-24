"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, AlertCircle, RefreshCcw, PieChart } from "lucide-react";
import { useSellerCategoryBreakdown } from "../queries/use-seller-category-breakdown";
import type { CategoryBreakdownItem } from "../types/seller.types";

// ----------------------------------------------------------------------
// Utility Functions for SVG Arc Math
// ----------------------------------------------------------------------
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const arcSweep = startAngle - endAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${arcSweep} 1 ${end.x} ${end.y}`;
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export function GenreBreakdownCard() {
  const { data, isLoading, isError, refetch } = useSellerCategoryBreakdown();
  const [hoveredCategory, setHoveredCategory] =
    useState<CategoryBreakdownItem | null>(null);

  const analytics = data?.data;
  const items = analytics?.items ?? [];

  const totalBooksSoldFormatted =
    analytics?.formattedTotalBooksSold ||
    (analytics?.totalBooksSold ?? 0).toLocaleString("en-IN");

  const title = analytics?.title || "Genre Breakdown";
  const subtitle = analytics?.subtitle || "Total Books Sold";

  // Calculate SVG Paths (Apple-style thin strokes, tiny gaps)
  let currentAngle = 180;
  const arcs = items.map((item) => {
    const angleSpan = (item.percentage / 100) * 180;
    const start = currentAngle;
    const end = Math.max(
      0,
      currentAngle - angleSpan + (angleSpan > 3 ? 1.5 : 0),
    );

    currentAngle = Math.max(0, currentAngle - angleSpan);
    const path = describeArc(50, 50, 44, start, end);

    return { ...item, path };
  });

  return (
    <section className="relative overflow-hidden flex flex-col justify-between rounded-3xl border border-border/40 bg-background p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:col-span-5">
      {/* Background Rotated Watermark Icon (matching logout alert dialog) */}
      <PieChart
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      {/* Header */}
      <header className="relative z-10 mb-2 flex items-center justify-between">
        <h2 className="text-[13px] font-medium tracking-tight text-muted-foreground">
          {title}
        </h2>
        <Link
          href="/categories"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/40 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </header>

      {/* Error State */}
      {isError ? (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-6 text-center">
          <AlertCircle className="mb-2 h-5 w-5 text-destructive/80" />
          <p className="text-xs font-medium text-foreground">Cannot load data</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            <RefreshCcw size={12} /> Retry
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col justify-between pt-1">
          {/* Semicircle Chart */}
          <div className="relative mx-auto my-auto flex w-full max-w-[230px] items-end justify-center">
            <svg
              viewBox="0 0 100 53"
              className="w-full overflow-visible drop-shadow-sm"
              aria-hidden="true"
            >
              {/* Subtle background track */}
              <path
                d="M 6 50 A 44 44 0 0 1 94 50"
                fill="none"
                stroke="currentColor"
                className="text-muted/20"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Dynamic Segments */}
              {!isLoading &&
                arcs.map((arc) => {
                  const isHovered =
                    hoveredCategory?.categoryId === arc.categoryId;

                  return (
                    arc.percentage > 0 && (
                      <path
                        key={arc.categoryId}
                        d={arc.path}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth={isHovered ? "8.5" : "6"}
                        strokeLinecap="round"
                        onMouseEnter={() => setHoveredCategory(arc)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={`cursor-pointer transition-all duration-300 ${
                          isHovered
                            ? "opacity-100 drop-shadow-md"
                            : hoveredCategory
                              ? "opacity-35"
                              : "opacity-100"
                        }`}
                      />
                    )
                  );
                })}
            </svg>

            {/* Inner Center Metrics (Animated Hover State) */}
            <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center justify-center text-center">
              {isLoading ? (
                <>
                  <div className="h-7 w-16 rounded-md bg-muted/50 animate-pulse" />
                  <div className="mt-1 h-2.5 w-12 rounded bg-muted/30 animate-pulse" />
                </>
              ) : hoveredCategory ? (
                <div
                  key={hoveredCategory.categoryId}
                  className="animate-in fade-in zoom-in-95 duration-200"
                >
                  <span
                    className="block text-[28px] leading-none font-bold tracking-tight tabular-nums"
                    style={{ color: hoveredCategory.color }}
                  >
                    {hoveredCategory.formattedPercentage}
                  </span>

                  <span className="mt-1 block max-w-[140px] truncate text-[10px] font-semibold uppercase tracking-wider text-foreground">
                    {hoveredCategory.name}
                  </span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <span className="block text-[28px] leading-none font-semibold tracking-tight text-foreground tabular-nums">
                    {totalBooksSoldFormatted}
                  </span>

                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                    {subtitle}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Minimalist Breakdown List (Filling Available Card Height) */}
          <div className="mt-4 flex flex-col justify-around space-y-1.5 border-t border-border/40 pt-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                      <div className="h-3.5 w-20 rounded bg-muted/50 animate-pulse" />
                    </div>
                    <div className="h-3.5 w-10 rounded bg-muted/50 animate-pulse" />
                  </div>
                ))
              : items.map((item) => {
                  const isHovered =
                    hoveredCategory?.categoryId === item.categoryId;

                  return (
                    <div
                      key={item.categoryId}
                      onMouseEnter={() => setHoveredCategory(item)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors duration-200 ${
                        isHovered
                          ? "bg-secondary/60 shadow-xs"
                          : "hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
                            isHovered ? "scale-125 shadow-xs" : "shadow-sm"
                          }`}
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />

                        <span
                          className={`text-[13px] transition-colors duration-200 ${
                            isHovered
                              ? "font-semibold text-foreground"
                              : "font-medium text-muted-foreground"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 tabular-nums">
                        <span className="text-[13px] font-semibold text-foreground">
                          {item.booksSold.toLocaleString("en-IN")}
                        </span>

                        <span
                          className={`w-10 text-right text-[11px] transition-colors duration-200 ${
                            isHovered
                              ? "font-bold text-foreground"
                              : "font-medium text-muted-foreground/60"
                          }`}
                        >
                          {item.formattedPercentage}
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </section>
  );
}