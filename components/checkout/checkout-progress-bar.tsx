"use client";

import React from "react";
import { Check } from "lucide-react";

export function CheckoutProgressBar() {
  return (
    <div className="mx-auto mb-6 max-w-2xl rounded-lg border border-border bg-background p-3 shadow-xs">
      <div className="flex items-center justify-between px-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Check size={12} strokeWidth={3} />
          </span>
          <span>Cart</span>
        </div>

        <div className="h-px w-8 bg-emerald-500 sm:w-16" />

        <div className="flex items-center gap-1.5 text-accent">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
            2
          </span>
          <span>Shipping & Details</span>
        </div>

        <div className="h-px w-8 bg-border sm:w-16" />

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border">
            3
          </span>
          <span>Payment</span>
        </div>
      </div>
    </div>
  );
}
