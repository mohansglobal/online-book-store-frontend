import React from "react";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export function CheckoutTrustBadges() {
  return (
    <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg border border-border bg-surface-soft px-1 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase">
      <div className="flex flex-col items-center gap-0.5">
        <ShieldCheck size={14} className="text-accent" />
        <span>100% Genuine</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 border-x border-border">
        <Truck size={14} className="text-accent" />
        <span>Fast Shipping</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <RotateCcw size={14} className="text-accent" />
        <span>Easy Returns</span>
      </div>
    </div>
  );
}
