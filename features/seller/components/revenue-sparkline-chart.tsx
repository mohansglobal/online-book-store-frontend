"use client";

// Dynamic SVG sparkline area chart with interactive hover tooltip for seller revenue trend
import { useState, useRef, type PointerEvent } from "react";
import type { SellerRevenuePoint } from "../types/seller.types";

interface RevenueSparklineChartProps {
  points: SellerRevenuePoint[];
  isLoading?: boolean;
  width?: number;
  height?: number;
}

interface PointCoordinate {
  x: number;
  y: number;
  point: SellerRevenuePoint;
  index: number;
}

const DEFAULT_LABELS: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const PLACEHOLDER_PATH =
  "M 0 55 C 40 45, 80 60, 120 40 S 200 50, 240 30 S 320 45, 360 25 L 420 35";
const PLACEHOLDER_AREA = `${PLACEHOLDER_PATH} L 420 80 L 0 80 Z`;

function generateChartPaths(
  points: SellerRevenuePoint[],
  width = 420,
  height = 80,
) {
  if (!points || points.length === 0) {
    return { linePath: "", areaPath: "", lastPoint: { x: 0, y: 0 }, coords: [] };
  }

  const values = points.map((p) => p.revenueInRupees);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const topPadding = 14;
  const bottomPadding = 14;
  const usableHeight = height - topPadding - bottomPadding;

  const coords: PointCoordinate[] = points.map((p, index) => {
    const x =
      points.length === 1
        ? width / 2
        : (index / (points.length - 1)) * width;

    const normalized = (p.revenueInRupees - minVal) / range;
    const y = height - bottomPadding - normalized * usableHeight;

    return { x, y, point: p, index };
  });

  if (coords.length === 1) {
    const single = coords[0];
    const linePath = `M 0 ${single.y} L ${width} ${single.y}`;
    const areaPath = `M 0 ${single.y} L ${width} ${single.y} L ${width} ${height} L 0 ${height} Z`;

    return { linePath, areaPath, lastPoint: single, coords };
  }

  let linePath = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];

    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;

    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const lastPoint = coords[coords.length - 1];
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return { linePath, areaPath, lastPoint, coords };
}

export function RevenueSparklineChart({
  points,
  isLoading = false,
  width = 420,
  height = 80,
}: RevenueSparklineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { linePath, areaPath, lastPoint, coords } = generateChartPaths(
    points,
    width,
    height,
  );

  const activeLinePath = isLoading ? PLACEHOLDER_PATH : linePath;
  const activeAreaPath = isLoading ? PLACEHOLDER_AREA : areaPath;

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || points.length === 0 || isLoading) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const closestIdx = Math.round(ratio * (points.length - 1));
    setHoveredIdx(closestIdx);
  };

  const handlePointerLeave = () => {
    setHoveredIdx(null);
  };

  const activeCoord = hoveredIdx !== null && coords[hoveredIdx] ? coords[hoveredIdx] : null;
  const activePoint = activeCoord ? activeCoord.point : null;

  return (
    <div className="relative select-none">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative h-[82px] w-full cursor-crosshair touch-none ${
          isLoading ? "animate-pulse opacity-50" : ""
        }`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sellerRevenueArea" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {activeAreaPath && (
            <path d={activeAreaPath} fill="url(#sellerRevenueArea)" />
          )}

          {activeLinePath && (
            <path
              d={activeLinePath}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Interactive vertical guideline on hover */}
          {!isLoading && activeCoord && (
            <line
              x1={activeCoord.x}
              y1={0}
              x2={activeCoord.x}
              y2={height}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="opacity-70"
            />
          )}

          {/* Interactive active point dot */}
          {!isLoading && activeCoord && (
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r="5"
              fill="var(--color-accent)"
              stroke="var(--color-surface)"
              strokeWidth="2.5"
              className="drop-shadow-xs"
            />
          )}

          {/* Default static endpoint dot when not hovering */}
          {!isLoading && !activeCoord && lastPoint.x > 0 && (
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="4"
              fill="var(--color-accent)"
              stroke="var(--color-surface)"
              strokeWidth="3"
            />
          )}
        </svg>

        {/* Floating Insight Tooltip */}
        {!isLoading && activeCoord && activePoint && (
          <div
            className="pointer-events-none absolute z-30 transition-all duration-75 ease-out"
            style={{
              left: `${(activeCoord.x / width) * 100}%`,
              top: `${Math.max(10, (activeCoord.y / height) * 100)}%`,
              transform:
                hoveredIdx === 0
                  ? "translate(0%, -115%)"
                  : hoveredIdx === points.length - 1
                  ? "translate(-100%, -115%)"
                  : "translate(-50%, -115%)",
            }}
          >
            <div className="flex flex-col items-center whitespace-nowrap rounded-lg border border-accent/40 bg-accent px-2.5 py-1 text-white shadow-lg backdrop-blur-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-white">
                <span>{activePoint.label}</span>
                {activePoint.date && (
                  <span className="text-[9px] font-normal text-white/80">
                    ({new Date(activePoint.date).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-white">
                <span>₹{activePoint.revenueInRupees.toLocaleString("en-IN")}</span>
                <span className="text-[9px] font-medium text-white/85">
                  • {activePoint.orders} {activePoint.orders === 1 ? "order" : "orders"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* X-Axis labels */}
      <div className="mt-1 flex justify-between text-[9px] font-medium text-muted-foreground">
        {isLoading || points.length === 0 ? (
          DEFAULT_LABELS.map((day) => <span key={day}>{day}</span>)
        ) : points.length > 14 ? (
          points.map((pt, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === points.length - 1;
            const dayNum = parseInt(pt.label, 10);
            const isMilestone = !isNaN(dayNum) && (dayNum % 5 === 0 || dayNum === 1);

            if (isFirst || isLast || isMilestone) {
              return (
                <span key={pt.date || `${pt.label}-${idx}`}>
                  {pt.label}
                </span>
              );
            }
            return null;
          })
        ) : (
          points.map((pt) => (
            <span key={pt.date || pt.label}>{pt.label}</span>
          ))
        )}
      </div>
    </div>
  );
}
