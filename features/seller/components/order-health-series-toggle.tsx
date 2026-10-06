"use client";

interface OrderHealthSeriesToggleProps {
  visibleSeries: {
    delivered: boolean;
    processing: boolean;
    cancelled: boolean;
  };
  onToggle: (key: "delivered" | "processing" | "cancelled") => void;
}

export function OrderHealthSeriesToggle({
  visibleSeries,
  onToggle,
}: OrderHealthSeriesToggleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
     

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onToggle("delivered")}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
            visibleSeries.delivered
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border/60 bg-surface-soft/60 text-muted-foreground opacity-50"
          }`}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>Delivered</span>
        </button>

        <button
          type="button"
          onClick={() => onToggle("processing")}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
            visibleSeries.processing
              ? "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
              : "border-border/60 bg-surface-soft/60 text-muted-foreground opacity-50"
          }`}
        >
          <span className="size-1.5 rounded-full bg-sky-500" />
          <span>Processing</span>
        </button>

        <button
          type="button"
          onClick={() => onToggle("cancelled")}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
            visibleSeries.cancelled
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-border/60 bg-surface-soft/60 text-muted-foreground opacity-50"
          }`}
        >
          <span className="size-1.5 rounded-full bg-rose-500" />
          <span>Cancelled</span>
        </button>
      </div>
    </div>
  );
}

export default OrderHealthSeriesToggle;
