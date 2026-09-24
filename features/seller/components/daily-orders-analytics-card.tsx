// Seller dashboard weekly daily orders & 7-day growth analytics card component
"use client";

import {
  Clock,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useSellerDailyOrders } from "../queries/use-seller-daily-orders";

const DEFAULT_DAYS: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const SKELETON_BAR_HEIGHTS: readonly number[] = [45, 70, 35, 85, 55, 90, 50];

export function DailyOrdersAnalyticsCard() {
  const { data, isLoading, isError, refetch } = useSellerDailyOrders({
    days: 7,
  });

  const analytics = data?.data;
  const mainMetrics = analytics?.main;


  const currentPeriod = analytics?.currentPeriod;
  const days = currentPeriod?.days ?? [];


  const peakInfo = analytics?.peak;

  const averageDailyOrders = mainMetrics?.averageDailyOrders ?? 0;
  const isIntegerAverage = averageDailyOrders % 1 === 0;

  const averageDailyOrdersFormatted = isIntegerAverage
    ? averageDailyOrders.toFixed(0)
    : averageDailyOrders.toFixed(1);

  const isGrowthPositive = mainMetrics?.isGrowthPositive ?? true;
  const growthSign = isGrowthPositive ? "+" : "";


  const formattedGrowth =
    mainMetrics?.formattedGrowth ||
    `${growthSign}${mainMetrics?.growthPercentage ?? 0}%`;

  const growthBadge =
    mainMetrics?.growthBadge ||
    `${Math.round(mainMetrics?.growthPercentage ?? 0)}%`;

  const maxOrders = Math.max(1, ...days.map((d) => d.orders));

  return (
    <section className="relative overflow-hidden flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-7">

      <ShoppingBag
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Card Header (Fixed Layout) */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 min-h-[36px]">
              {/* Clock Icon (Fixed) */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Clock size={18} aria-hidden="true" />
              </div>

              {/* Average Daily Orders Digit Skeleton / Value */}
              {isLoading ? (
                <>
                  <div className="h-8 w-14 rounded-lg bg-foreground/15 dark:bg-white/15 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-foreground/15 dark:bg-white/15 animate-pulse" />
                </>
              ) : (
                <>
                  <span className="font-display text-3xl font-bold text-foreground tabular-nums">
                    {averageDailyOrdersFormatted}
                  </span>

                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${isGrowthPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                  >
                    {isGrowthPositive ? (
                      <TrendingUp size={13} aria-hidden="true" />
                    ) : (
                      <TrendingDown size={13} aria-hidden="true" />
                    )}
                    {formattedGrowth}
                  </span>
                </>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {analytics?.subtitle || "Average daily orders"}
            </p>
          </div>

          {/* Growth badge box (Fixed) */}
          <div className="flex shrink-0 flex-col items-end rounded-xl border border-emerald-900 bg-emerald-950 p-2.5 text-emerald-50 sm:p-3">
            <span className="mb-0.5 text-[10px] font-semibold tracking-wide text-emerald-400 uppercase">
              Growth
            </span>

            {isLoading ? (
              <div className="mt-1 h-4 w-10 rounded bg-emerald-400/25 animate-pulse" />
            ) : (
              <span className="text-lg leading-none font-bold tracking-tight">
                {growthBadge}
              </span>
            )}
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-7 w-7 text-destructive" />

            <p className="mt-2 text-sm font-semibold text-foreground">
              Failed to load daily orders analytics
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Could not retrieve 7-day order breakdown.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Chart Box (Fixed Layout) */}
        {!isError && (
          <div className="flex flex-1 flex-col justify-between rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {analytics?.title || "Orders This Week"}
                </span>

                {isLoading ? (
                  <div className="h-4 w-20 rounded-full bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  peakInfo?.badge && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {peakInfo.badge}
                    </span>
                  )
                )}
              </div>

              <span className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-xs font-normal text-text-secondary">
                {analytics?.periodLabel || "Last 7 Days"}
              </span>
            </div>

            {/* 7-Day Bar Chart Grid (Fixed layout with digit & bar skeletons) */}
            <div className="grid flex-1 grid-cols-7 items-end gap-1.5 pt-3 pb-1 sm:gap-3">
              {isLoading || days.length === 0
                ? DEFAULT_DAYS.map((dayName, idx) => (
                  <div
                    key={dayName}
                    className="flex h-full flex-col items-center justify-end"
                  >
                    <div className="mb-1.5 h-3.5 w-5 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />

                    <div className="flex h-36 w-full max-w-[3.25rem] items-end justify-center overflow-hidden rounded-lg border border-transparent bg-surface-soft p-0.5 sm:h-40">
                      <div
                        className="w-full rounded-md bg-accent/25 animate-pulse"
                        style={{ height: `${SKELETON_BAR_HEIGHTS[idx]}%` }}
                      />
                    </div>

                    <span className="mt-2 text-xs font-medium text-muted-foreground">
                      {dayName}
                    </span>
                  </div>
                ))
                : days.map((dayData) => {
                  const percentage = Math.max(
                    12,
                    Math.round((dayData.orders / maxOrders) * 100),
                  );

                  const isPeak =
                    dayData.isPeak ||
                    (peakInfo && dayData.day === peakInfo.day);

                  const shipmentsCount = dayData.shipments ?? dayData.orders;
                  const revenueText = dayData.revenueInRupees
                    ? ` • ₹${dayData.revenueInRupees.toLocaleString("en-IN")}`
                    : "";

                  return (
                    <div
                      key={dayData.date || dayData.day}
                      className="group flex h-full flex-col items-center justify-end"
                      title={`${dayData.dayFull || dayData.day}: ${dayData.orders} orders (${shipmentsCount} shipments)${revenueText}`}
                    >
                      <span
                        className={`mb-1.5 font-sans text-[11px] font-semibold tabular-nums transition-colors duration-200 ${isPeak
                            ? "font-bold text-accent"
                            : "text-muted-foreground group-hover:text-foreground"
                          }`}
                      >
                        {dayData.orders}
                      </span>

                      <div className="flex h-36 w-full max-w-[3.25rem] items-end justify-center overflow-hidden rounded-lg border border-transparent bg-surface-soft p-0.5 transition-colors duration-200 group-hover:border-border sm:h-40">
                        <div
                          className={`w-full rounded-md transition-all duration-300 ${isPeak
                              ? "bg-accent shadow-xs"
                              : "bg-accent/45 group-hover:bg-accent/75"
                            }`}
                          style={{
                            height: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span
                        className={`mt-2 text-xs font-medium transition-colors duration-200 ${isPeak
                            ? "font-bold text-accent"
                            : "text-muted-foreground group-hover:text-foreground"
                          }`}
                      >
                        {dayData.day}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

