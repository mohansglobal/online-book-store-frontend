"use client";

import React from "react";
import { Check, XCircle } from "lucide-react";
import type { OrderStatus } from "../types/order.types";

const TRACKING_STEPS: { key: string; label: string }[] = [
  { key: "PENDING", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
    case "PROCESSING":
      return 1;
    case "SHIPPED":
      return 2;
    case "DELIVERED":
      return 3;
    case "CANCELLED":
      return -1;
    default:
      return 0;
  }
}

interface OrderTrackingProgressProps {
  orderStatus: OrderStatus;
}

export function OrderTrackingProgress({
  orderStatus,
}: OrderTrackingProgressProps) {
  const isCancelled = orderStatus === "CANCELLED";
  const currentStep = getStepIndex(orderStatus);

  if (isCancelled) {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-200/70 bg-rose-50/50 p-3.5 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
        <XCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
        <span>This order has been cancelled.</span>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-2">
      <div className="relative flex items-center justify-between">
        {/* Continuous Track Background Line */}
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-border/70" />
        {/* Filled Progress Line */}
        <div
          className="absolute left-6 top-4 h-0.5 bg-accent transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, (currentStep / (TRACKING_STEPS.length - 1)) * 100))}%`,
          }}
        />

        {TRACKING_STEPS.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? "bg-accent text-white shadow-xs"
                    : isCurrent
                    ? "border-2 border-accent bg-surface text-accent ring-4 ring-accent/15 shadow-xs"
                    : "border border-border/80 bg-surface-soft text-muted-foreground/60"
                }`}
              >
                {isDone ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : isCurrent ? (
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </div>
              <span
                className={`mt-2 text-center text-[11px] sm:text-xs transition-colors ${
                  isCurrent
                    ? "font-bold text-accent"
                    : isDone
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/70"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
