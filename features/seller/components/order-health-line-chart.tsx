"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import type { OrderHealthTimelinePoint } from "../types/seller.types";
import {
  calculateSeriesCoords,
  generateSmoothPath,
} from "../utils/order-health-chart.utils";
import { OrderHealthChartTooltip } from "./order-health-chart-tooltip";
import { OrderHealthSeriesToggle } from "./order-health-series-toggle";

export interface OrderHealthLineChartProps {
  timeline: OrderHealthTimelinePoint[];
  isLoading?: boolean;
  className?: string;
}

const WIDTH = 420;
const HEIGHT = 140;
const TOP_PAD = 14;
const BOT_PAD = 24;

export function OrderHealthLineChart({
  timeline,
  isLoading = false,
  className = "",
}: OrderHealthLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [visibleSeries, setVisibleSeries] = useState({
    delivered: true,
    processing: true,
    cancelled: true,
  });

  const points = useMemo(() => (timeline.length > 0 ? timeline : []), [timeline]);

  const maxValue = useMemo(() => {
    const vals = points.flatMap((p) => [
      visibleSeries.delivered ? p.delivered : 0,
      visibleSeries.processing ? p.processing : 0,
      visibleSeries.cancelled ? p.cancelled : 0,
    ]);
    const peak = Math.max(...vals, 1);
    return Math.ceil(peak * 1.15) || 5;
  }, [points, visibleSeries]);

  const deliveredCoords = useMemo(
    () => calculateSeriesCoords(points, (p) => p.delivered, maxValue, WIDTH, HEIGHT, TOP_PAD, BOT_PAD),
    [points, maxValue],
  );

  const processingCoords = useMemo(
    () => calculateSeriesCoords(points, (p) => p.processing, maxValue, WIDTH, HEIGHT, TOP_PAD, BOT_PAD),
    [points, maxValue],
  );

  const cancelledCoords = useMemo(
    () => calculateSeriesCoords(points, (p) => p.cancelled, maxValue, WIDTH, HEIGHT, TOP_PAD, BOT_PAD),
    [points, maxValue],
  );

  const deliveredPath = useMemo(() => generateSmoothPath(deliveredCoords), [deliveredCoords]);
  const processingPath = useMemo(() => generateSmoothPath(processingCoords), [processingCoords]);
  const cancelledPath = useMemo(() => generateSmoothPath(cancelledCoords), [cancelledCoords]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!chartRef.current || points.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(rect.width, e.clientX - rect.left)) / rect.width;
    const idx = Math.round(ratio * (points.length - 1));
    setHoveredIndex(Math.max(0, Math.min(points.length - 1, idx)));
  };

  const toggle = (key: "delivered" | "processing" | "cancelled") => {
    setVisibleSeries((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[key]) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const hovered = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-3 py-1 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 animate-pulse rounded bg-surface-soft" />
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-16 animate-pulse rounded-full bg-surface-soft" />
            ))}
          </div>
        </div>
        <div className="h-32 w-full animate-pulse rounded-xl bg-surface-soft/60" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      <OrderHealthSeriesToggle visibleSeries={visibleSeries} onToggle={toggle} />

      <div
        ref={chartRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredIndex(null)}
        className="relative h-32 w-full cursor-crosshair select-none overflow-hidden rounded-xl border border-border/40 bg-surface-soft/20 p-1"
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="size-full overflow-visible"
          aria-hidden="true"
        >
          {[0, 1, 2].map((idx) => (
            <line
              key={idx}
              x1={8}
              y1={TOP_PAD + (idx / 2) * (HEIGHT - TOP_PAD - BOT_PAD)}
              x2={WIDTH - 8}
              y2={TOP_PAD + (idx / 2) * (HEIGHT - TOP_PAD - BOT_PAD)}
              stroke="var(--color-border)"
              strokeOpacity="0.4"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          ))}

          {visibleSeries.delivered && deliveredPath && (
            <path
              d={deliveredPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {visibleSeries.processing && processingPath && (
            <path
              d={processingPath}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {visibleSeries.cancelled && cancelledPath && (
            <path
              d={cancelledPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {hoveredIndex !== null && points.length > 0 && (
            <g>
              <line
                x1={deliveredCoords[hoveredIndex]?.x ?? 0}
                y1={TOP_PAD}
                x2={deliveredCoords[hoveredIndex]?.x ?? 0}
                y2={HEIGHT - BOT_PAD}
                stroke="var(--color-foreground)"
                strokeOpacity="0.25"
                strokeDasharray="2 2"
                strokeWidth="1"
              />

              {visibleSeries.delivered && deliveredCoords[hoveredIndex] && (
                <circle
                  cx={deliveredCoords[hoveredIndex].x}
                  cy={deliveredCoords[hoveredIndex].y}
                  r="4"
                  fill="#10b981"
                  stroke="var(--color-surface)"
                  strokeWidth="2"
                />
              )}

              {visibleSeries.processing && processingCoords[hoveredIndex] && (
                <circle
                  cx={processingCoords[hoveredIndex].x}
                  cy={processingCoords[hoveredIndex].y}
                  r="4"
                  fill="#0ea5e9"
                  stroke="var(--color-surface)"
                  strokeWidth="2"
                />
              )}

              {visibleSeries.cancelled && cancelledCoords[hoveredIndex] && (
                <circle
                  cx={cancelledCoords[hoveredIndex].x}
                  cy={cancelledCoords[hoveredIndex].y}
                  r="4"
                  fill="#f43f5e"
                  stroke="var(--color-surface)"
                  strokeWidth="2"
                />
              )}
            </g>
          )}
        </svg>

        {hovered && hoveredIndex !== null && (
          <OrderHealthChartTooltip
            point={hovered}
            visibleSeries={visibleSeries}
            xPercent={(hoveredIndex / Math.max(1, points.length - 1)) * 100}
            isRightAligned={hoveredIndex > points.length / 2}
          />
        )}
      </div>

      {points.length > 0 && (
        <div className="mt-1.5 flex justify-between px-2 text-[10px] font-medium text-muted-foreground">
          {points.map((p, idx) => (
            <span
              key={`${p.date}-${idx}`}
              className={hoveredIndex === idx ? "font-bold text-foreground" : "text-muted-foreground"}
            >
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHealthLineChart;
