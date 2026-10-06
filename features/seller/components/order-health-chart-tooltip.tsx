"use client";

import type { OrderHealthTimelinePoint } from "../types/seller.types";

interface OrderHealthChartTooltipProps {
  point: OrderHealthTimelinePoint;
  visibleSeries: {
    delivered: boolean;
    processing: boolean;
    cancelled: boolean;
  };
  xPercent: number;
  isRightAligned: boolean;
}

export function OrderHealthChartTooltip({
  point,
  visibleSeries,
  xPercent,
  isRightAligned,
}: OrderHealthChartTooltipProps) {
  return (
    <div
      style={{
        left: `${xPercent}%`,
        transform: isRightAligned
          ? "translate(-105%, 8px)"
          : "translate(8px, 8px)",
      }}
      className="pointer-events-none absolute top-0 z-20 flex flex-col gap-1 rounded-xl border border-border bg-surface/95 px-3 py-2 text-[11px] shadow-lg backdrop-blur-md"
    >
      <div className="font-semibold text-foreground border-b border-border/50 pb-1">
        {point.label} · {point.date}
      </div>

      <div className="flex flex-col gap-0.5 font-medium">
        {visibleSeries.delivered && (
          <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Delivered
            </span>
            <span className="tabular-nums font-bold">{point.delivered}</span>
          </div>
        )}

        {visibleSeries.processing && (
          <div className="flex items-center justify-between gap-3 text-sky-600 dark:text-sky-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-sky-500" />
              Processing
            </span>
            <span className="tabular-nums font-bold">{point.processing}</span>
          </div>
        )}

        {visibleSeries.cancelled && (
          <div className="flex items-center justify-between gap-3 text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-rose-500" />
              Cancelled
            </span>
            <span className="tabular-nums font-bold">{point.cancelled}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHealthChartTooltip;
