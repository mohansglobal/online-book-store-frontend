"use client";

import React from "react";
import { Check } from "lucide-react";
import type { AddressType } from "@/features/addresses";

interface AddressModalTabsProps {
  activeTab: AddressType;
  onTabChange: (tab: AddressType) => void;
  billingFilled: boolean;
  useAsShipping: boolean;
  onToggleUseAsShipping: (checked: boolean) => void;
}

export function AddressModalTabs({
  activeTab,
  onTabChange,
  billingFilled,
  useAsShipping,
  onToggleUseAsShipping,
}: AddressModalTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex rounded-lg border border-border p-1 bg-surface-soft/60">
        <button
          type="button"
          onClick={() => onTabChange("BILLING")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "BILLING"
              ? "bg-accent text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Billing Address</span>
          {billingFilled && (
            <Check
              size={11}
              className={activeTab === "BILLING" ? "text-white" : "text-emerald-500"}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("SHIPPING")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "SHIPPING"
              ? "bg-accent text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Shipping Address</span>
          {!useAsShipping && (
            <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold bg-amber-500/20 text-amber-700 dark:text-amber-400">
              Separate
            </span>
          )}
        </button>
      </div>

      <div className="rounded-lg border border-border bg-surface-soft/40 px-3 py-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useAsShipping}
            onChange={(e) => onToggleUseAsShipping(e.target.checked)}
            className="h-4 w-4 rounded accent-accent cursor-pointer"
          />
          <span className="font-semibold text-text-secondary">
            Use billing address as shipping address
          </span>
        </label>
        {!useAsShipping && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Billing and shipping addresses are different. Both will be saved to your account.
          </p>
        )}
      </div>
    </div>
  );
}
