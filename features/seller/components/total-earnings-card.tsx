"use client";

import {
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  AlertCircle,
  ChevronDown,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSellerRevenueAnalytics } from "../queries/use-seller-revenue-analytics";
import type { SellerRevenueTimeframe } from "../types/seller.types";

export interface TotalEarningsCardProps {
  className?: string;
}

type PointCoord = {
  x: number;
  y: number;
  value: number;
  label: string;
};

const TIMEFRAME_OPTIONS: {
  value: SellerRevenueTimeframe;
  label: string;
}[] = [
  { value: "weekly", label: "Week" },
  { value: "monthly", label: "Month" },
  { value: "yearly", label: "Year" },
];

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value = 0) {
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(1)}Cr`;
  }

  if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `₹${(value / 1_000).toFixed(1)}k`;
  }

  return `₹${value}`;
}

function createSmoothPath(points: PointCoord[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;

    path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function createAreaPath(points: PointCoord[], baselineY: number) {
  if (points.length === 0) return "";
  const line = createSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];

  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

export function TotalEarningsCard({
  className = "",
}: TotalEarningsCardProps) {
  const [timeframe, setTimeframe] = useState<SellerRevenueTimeframe>("weekly");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useSellerRevenueAnalytics({
    timeframe,
  });

  const analytics = data?.data;
  const points = analytics?.trend?.points ?? [];

  const mainTotal = analytics?.main?.totalRevenueInRupees;
  const trendTotal = analytics?.trend?.trendTotalInRupees;
  const totalRevenue = mainTotal ?? trendTotal ?? 0;
  const formattedRevenue = `₹${totalRevenue.toLocaleString("en-IN")}`;

  const growthPercentage =
    analytics?.main?.growthPercentage ??
    analytics?.trend?.trendGrowthPercentage ??
    0;

  const isGrowthPositive =
    analytics?.main?.isGrowthPositive ?? growthPercentage >= 0;

  const growthSign = growthPercentage >= 0 ? "+" : "";
  const growthFormatted = `${growthSign}${growthPercentage}%`;

  const fallbackComparison =
    timeframe === "weekly"
      ? "vs previous week"
      : timeframe === "monthly"
      ? "vs previous month"
      : "vs previous year";

  const comparisonText = analytics?.main?.comparisonText || fallbackComparison;

  const selectedOption =
    TIMEFRAME_OPTIONS.find((option) => option.value === timeframe) ??
    TIMEFRAME_OPTIONS[0];

  const width = 600;
  const height = 150;
  const topPadding = 12;
  const bottomPadding = 12;
  const usableHeight = height - topPadding - bottomPadding;

  const revenueValues = points.map((point) => point.revenueInRupees ?? 0);
  const highestRevenue =
    revenueValues.length > 0 ? Math.max(...revenueValues) : 0;

  const yAxisMax =
    highestRevenue > 0 ? Math.ceil(highestRevenue * 1.15) : 100;

  const coordinates: PointCoord[] = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : (index / (points.length - 1)) * width;

    const normalized = (point.revenueInRupees ?? 0) / yAxisMax;
    const y = height - bottomPadding - normalized * usableHeight;

    return {
      x,
      y,
      value: point.revenueInRupees ?? 0,
      label: point.label,
    };
  });

  const linePath = createSmoothPath(coordinates);
  const areaPath = createAreaPath(coordinates, height - bottomPadding);

  const yTicks = [
    yAxisMax,
    Math.round(yAxisMax * 0.66),
    Math.round(yAxisMax * 0.33),
    0,
  ];

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!chartRef.current || coordinates.length === 0) return;

    const rect = chartRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const index = Math.round(ratio * (coordinates.length - 1));

    setHoveredIndex(index);
  };

  const activePoint =
    hoveredIndex !== null ? coordinates[hoveredIndex] : null;

  return (
    <section
      className={`relative overflow-hidden flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs ${className}`}
    >
      <TrendingUp
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Revenue Overview
              </span>

              <h2 className="mt-0.5 text-base font-bold tracking-tight text-foreground sm:text-[17px]">
                Total Earnings
              </h2>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Select earnings timeframe"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-soft/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-foreground/25 hover:bg-surface-soft hover:text-foreground active:scale-[0.97] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span>{selectedOption.label}</span>
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-32 rounded-xl border border-border bg-surface p-1 shadow-lg z-50"
              >
                {TIMEFRAME_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTimeframe(option.value)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors duration-150 active:scale-[0.98] ${
                      timeframe === option.value
                        ? "bg-accent/15 font-bold text-accent"
                        : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Error State */}
          {isError && (
            <div className="my-6 flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="size-7 text-destructive" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                Failed to load total earnings
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white active:scale-[0.96]"
              >
                <RefreshCw size={13} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          {/* Revenue Stat Display */}
          {!isError && (
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 min-h-[34px]">
                  {isLoading ? (
                    <>
                      <div className="h-8 w-32 rounded-lg bg-surface-soft animate-pulse" />
                      <div className="h-5 w-14 rounded-full bg-surface-soft animate-pulse" />
                    </>
                  ) : (
                    <span className="text-3xl leading-none font-bold tracking-tight text-foreground tabular-nums sm:text-[34px]">
                      {formattedRevenue}
                    </span>
                  )}

                  {!isLoading && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold transition-all duration-150 select-none cursor-pointer hover:brightness-95 active:scale-[0.98] ${
                        isGrowthPositive
                          ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-rose-500/15 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isGrowthPositive ? (
                        <TrendingUp size={11} aria-hidden="true" />
                      ) : (
                        <TrendingDown size={11} aria-hidden="true" />
                      )}
                      <span>{growthFormatted}</span>
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="mt-1.5 h-3.5 w-40 rounded bg-surface-soft animate-pulse" />
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {comparisonText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading Skeleton for Chart */}
          {isLoading && !isError && (
            <div className="mt-5">
              <div className="flex">
                {/* Y Axis Ticks Skeleton */}
                <div className="flex h-[150px] w-12 shrink-0 flex-col justify-between pr-2 text-right">
                  {[1, 2, 3, 4].map((tick) => (
                    <div
                      key={tick}
                      className="ml-auto h-2.5 w-7 animate-pulse rounded bg-surface-soft/80"
                    />
                  ))}
                </div>

                {/* Chart Area Skeleton */}
                <div className="relative flex h-[150px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-surface-soft/20 p-2">
                  <div className="absolute inset-x-2 top-1/4 border-t border-dashed border-border/30" />
                  <div className="absolute inset-x-2 top-1/2 border-t border-dashed border-border/30" />
                  <div className="absolute inset-x-2 top-3/4 border-t border-dashed border-border/30" />

                  {/* Shimmer wave columns */}
                  <div className="relative flex h-full w-full items-end justify-between gap-3 px-2 pb-1">
                    {[38, 65, 42, 58, 30, 72, 45].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex flex-1 flex-col items-center justify-end"
                      >
                        <div
                          className="w-full max-w-[28px] animate-pulse rounded-t-md bg-accent/[0.08]"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* X Axis Labels Skeleton */}
              <div className="mt-2 flex pl-12">
                <div className="flex w-full justify-between px-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div
                      key={item}
                      className="h-2 w-6 animate-pulse rounded bg-surface-soft"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && points.length === 0 && (
            <div className="flex h-[170px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No revenue data available
              </p>
            </div>
          )}

          {/* Interactive Chart with Palette */}
          {!isLoading && !isError && points.length > 0 && (
            <div className="mt-5">
              <div className="flex">
                {/* Y Axis Ticks */}
                <div className="flex h-[150px] w-12 shrink-0 flex-col justify-between pr-2 text-right">
                  {yTicks.map((tick, index) => (
                    <span
                      key={`${tick}-${index}`}
                      className="text-[10px] font-medium tabular-nums text-muted-foreground"
                    >
                      {formatCompactCurrency(tick)}
                    </span>
                  ))}
                </div>

                {/* SVG Area & Line Chart */}
                <div
                  ref={chartRef}
                  onPointerMove={handlePointerMove}
                  onPointerLeave={() => setHoveredIndex(null)}
                  className="relative h-[150px] min-w-0 flex-1 cursor-crosshair select-none"
                >
                  <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    className="size-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="totalEarningsArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--color-accent)"
                          stopOpacity="0.22"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-accent)"
                          stopOpacity="0.01"
                        />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[0, 1, 2, 3].map((index) => {
                      const y = topPadding + (index / 3) * usableHeight;

                      return (
                        <line
                          key={index}
                          x1="0"
                          y1={y}
                          x2={width}
                          y2={y}
                          stroke="var(--color-border)"
                          strokeOpacity="0.5"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Gradient Area */}
                    {areaPath && (
                      <path d={areaPath} fill="url(#totalEarningsArea)" />
                    )}

                    {/* Accent Revenue Line */}
                    {linePath && (
                      <path
                        d={linePath}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Interactive Guideline */}
                    {activePoint && (
                      <line
                        x1={activePoint.x}
                        y1={topPadding}
                        x2={activePoint.x}
                        y2={height - bottomPadding}
                        stroke="var(--color-accent)"
                        strokeOpacity="0.35"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Data Point Circles */}
                    {coordinates.map((point, index) => (
                      <circle
                        key={`${point.label}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={hoveredIndex === index ? 4.5 : 2.5}
                        fill="var(--color-accent)"
                        stroke="var(--color-surface)"
                        strokeWidth={hoveredIndex === index ? 2 : 1}
                        className="transition-all duration-150"
                      />
                    ))}
                  </svg>

                  {/* Interactive Tooltip */}
                  {activePoint && (
                    <div
                      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-surface px-3 py-1.5 shadow-lg"
                      style={{
                        left: `${(activePoint.x / width) * 100}%`,
                        top: `${Math.max(10, (activePoint.y / height) * 100)}%`,
                      }}
                    >
                      <p className="whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                        {activePoint.label}
                      </p>

                      <p className="whitespace-nowrap text-xs font-bold text-accent tabular-nums">
                        {formatCurrency(activePoint.value)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="mt-2 flex justify-between pl-12 text-[10px] font-medium text-muted-foreground">
                {points.map((point, index) => (
                  <span key={`${point.label}-${index}`} className="min-w-0">
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TotalEarningsCard;