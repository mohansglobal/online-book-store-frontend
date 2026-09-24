"use client";

// Seller dashboard revenue analytics & money analytics card component
import { useState } from "react";
import { ChevronDown, RefreshCw, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSellerRevenueAnalytics } from "../queries/use-seller-revenue-analytics";
import type { SellerRevenueTimeframe } from "../types/seller.types";
import { RevenueSparklineChart } from "./revenue-sparkline-chart";

const TIMEFRAME_OPTIONS: readonly {
  value: SellerRevenueTimeframe;
  label: string;
}[] = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

export function RevenueAnalyticsCard() {
  const [timeframe, setTimeframe] = useState<SellerRevenueTimeframe>("monthly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useSellerRevenueAnalytics({
    timeframe,
  });

  const selectedOption =
    TIMEFRAME_OPTIONS.find((t) => t.value === timeframe) ?? TIMEFRAME_OPTIONS[1];

  const analytics = data?.data;
  const points = analytics?.trend?.points ?? [];

  const totalRevenueFormatted = `₹${(analytics?.main?.totalRevenueInRupees ?? 0).toLocaleString("en-IN")}`;
  const todayRevenueFormatted = `₹${(analytics?.today?.todayRevenueInRupees ?? 0).toLocaleString("en-IN")}`;
  const avgOrderFormatted = `₹${(analytics?.metrics?.avgOrderValueInRupees ?? 0).toLocaleString("en-IN")}`;
  const trendTotalFormatted = `₹${(analytics?.trend?.trendTotalInRupees ?? 0).toLocaleString("en-IN")}`;

  const isGrowthPositive = analytics?.main?.isGrowthPositive ?? true;
  const growthSign = (analytics?.main?.growthPercentage ?? 0) >= 0 ? "+" : "";
  const growthFormatted = `${growthSign}${analytics?.main?.growthPercentage ?? 0}%`;

  const trendGrowthSign = (analytics?.trend?.trendGrowthPercentage ?? 0) >= 0 ? "+" : "";
  const trendGrowthFormatted = `${trendGrowthSign}${analytics?.trend?.trendGrowthPercentage ?? 0}%`;

  return (
    <section className="relative overflow-hidden flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-5">

      <TrendingUp
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Revenue
            </p>

            <h2 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-[17px]">
              Money Analytics
            </h2>
          </div>


          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Select timeframe"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-soft/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{selectedOption.label}</span>

                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-32 rounded-xl border border-border bg-surface p-1 shadow-lg z-50"
            >
              {TIMEFRAME_OPTIONS.map((item) => {
                const isSelected = timeframe === item.value;

                return (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => {
                      setTimeframe(item.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors ${isSelected
                        ? "bg-accent/10 font-bold text-accent"
                        : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                      }`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isError && (
          <div className="my-6 flex flex-col items-center justify-center py-4 text-center">
            <p className="text-sm text-rose-500">Failed to load revenue analytics</p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              <RefreshCw size={13} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {!isError && (
          <>
            {/* Main Revenue (Fixed layout with digit skeleton) */}
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 min-h-[34px]">
                  {isLoading ? (
                    <>
                      <div className="h-8 w-32 rounded-lg bg-foreground/15 dark:bg-white/15 animate-pulse" />
                      <div className="h-5 w-12 rounded-full bg-foreground/15 dark:bg-white/15 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <span className="text-3xl leading-none font-bold tracking-tight text-foreground tabular-nums sm:text-[34px]">
                        {totalRevenueFormatted}
                      </span>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${isGrowthPositive
                            ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-rose-500/15 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                      >
                        {growthFormatted}
                      </span>
                    </>
                  )}
                </div>

                {isLoading ? (
                  <div className="mt-2 h-3.5 w-40 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {analytics?.main?.comparisonText || "-"}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Today
                </p>

                {isLoading ? (
                  <div className="mt-1 ml-auto h-4 w-14 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
                    {todayRevenueFormatted}
                  </p>
                )}
              </div>
            </div>

            {/* Metrics (Fixed 3-column layout with digits skeleton) */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border py-3.5">
              <div className="pr-3.5">
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Net Revenue
                </p>

                {isLoading ? (
                  <div className="mt-1.5 h-4 w-14 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                    {analytics?.metrics?.formattedNetRevenue || "-"}
                  </p>
                )}
              </div>

              <div className="px-3.5">
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Avg. Order
                </p>

                {isLoading ? (
                  <div className="mt-1.5 h-4 w-12 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                    {avgOrderFormatted}
                  </p>
                )}
              </div>

              <div className="pl-3.5">
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Orders
                </p>

                {isLoading ? (
                  <div className="mt-1.5 h-4 w-10 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                ) : (
                  <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                    {analytics?.metrics?.totalOrders ?? "-"}
                  </p>
                )}
              </div>
            </div>

            {/* Revenue Chart Section (Fixed layout with dynamic chart) */}
            <div className="mt-5 pt-1">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {analytics?.trend?.title ?? "Revenue trend"}
                  </p>

                  {isLoading ? (
                    <div className="mt-1 h-2.5 w-16 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                  ) : (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {analytics?.trend?.subtitle ?? "Last 7 days"}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  {isLoading ? (
                    <div className="ml-auto space-y-1">
                      <div className="ml-auto h-3.5 w-14 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                      <div className="ml-auto h-2.5 w-10 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-foreground">
                        {trendTotalFormatted}
                      </p>

                      <p
                        className={`text-[9px] font-semibold ${analytics?.trend?.isTrendGrowthPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                          }`}
                      >
                        {trendGrowthFormatted}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <RevenueSparklineChart points={points} isLoading={isLoading} />
            </div>

          </>
        )}
      </div>
    </section>
  );
}
