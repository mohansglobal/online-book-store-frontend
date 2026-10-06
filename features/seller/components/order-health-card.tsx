"use client";

import {
  Activity,
  AlertCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useSellerOrderHealth } from "../queries/use-seller-order-health";
import type { OrderHealthTimeframe } from "../types/seller.types";
import { OrderHealthLineChart } from "./order-health-line-chart";

export interface OrderHealthCardProps {
  className?: string;
  timeframe?: OrderHealthTimeframe;
}

export function OrderHealthCard({
  className = "",
  timeframe = "all",
}: OrderHealthCardProps) {
  const { data, isLoading, isError, refetch } = useSellerOrderHealth({
    timeframe,
  });

  const health = data?.data;

  // Safe fallbacks
  const totalOrders = health?.totalOrders ?? 0;
  const trendFormatted = health?.cancellationTrend.formatted ?? "0% change";
  const trendDirection = health?.cancellationTrend.direction ?? "neutral";

  return (
    <section
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-xs ${className}`}
    >
      <Activity
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Operations
              </span>
              <h2 className="mt-0.5 text-base font-bold tracking-tight text-foreground sm:text-[17px]">
                Order Health
              </h2>
            </div>

            {/* {isLoading ? (
              <div className="h-6 w-16 animate-pulse rounded-full bg-surface-soft" />
            ) : (
              <div
                className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 hover:brightness-95 active:scale-[0.97] ${
                  isHealthy
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                <span
                  className={`size-1.5 animate-pulse rounded-full ${
                    isHealthy ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span>{isHealthy ? "Optimal" : "Review Needed"}</span>
              </div>
            )} */}
          </div>

          {/* Error State */}
          {isError && (
            <div className="my-6 flex flex-col items-center justify-center py-4 text-center">
              <AlertCircle className="size-6 text-destructive" />
              <p className="mt-2 text-xs font-semibold text-foreground">
                Failed to load health metrics
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white active:scale-[0.96]"
              >
                <RefreshCw size={12} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          {/* Primary Stat */}
          {!isError && (
            <div className="mt-5">
              <div className="flex min-h-[34px] items-center gap-3">
                {isLoading ? (
                  <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-soft" />
                ) : (
                  <span className="tabular-nums text-3xl font-bold leading-none tracking-tight text-foreground sm:text-[34px]">
                    {totalOrders.toLocaleString("en-IN")}
                  </span>
                )}

                {!isLoading && (
                  <span
                    className={`inline-flex cursor-pointer select-none items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold transition-all duration-150 hover:brightness-95 active:scale-[0.98] ${
                      trendDirection === "down"
                        ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : trendDirection === "up"
                        ? "border-rose-500/15 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "border-border bg-surface-soft text-muted-foreground"
                    }`}
                  >
                    {trendDirection === "down" ? (
                      <TrendingDown size={11} aria-hidden="true" />
                    ) : (
                      <TrendingUp size={11} aria-hidden="true" />
                    )}
                    <span>{trendFormatted}</span>
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Total platform orders monitored
              </p>
            </div>
          )}

          {/* 3-Line Fulfillment Graph (Delivered, Processing, Cancellation) */}
          {!isError && (
            <div className="mt-4">
              <OrderHealthLineChart
                timeline={health?.timeline ?? []}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Detailed Metric Badges */}
         
        </div>

        {/* Footer / Avg Dispatch */}
       
      </div>
    </section>
  );
}

export default OrderHealthCard;