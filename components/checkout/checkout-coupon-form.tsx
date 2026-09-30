"use client";

import React from "react";
import { Tag, X } from "lucide-react";

interface CheckoutCouponFormProps {
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  couponMessage?: string;
  isCouponValid?: boolean;
  onApplyPromo: (e: React.FormEvent) => void;
  onRemovePromo: () => void;
}

export function CheckoutCouponForm({
  couponCode,
  onCouponCodeChange,
  appliedCoupon,
  couponDiscount,
  couponMessage,
  isCouponValid = true,
  onApplyPromo,
  onRemovePromo,
}: CheckoutCouponFormProps) {
  return (
    <>
      <form onSubmit={onApplyPromo} className="mt-4 flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponCodeChange(e.target.value)}
          placeholder="Promo code (e.g. BENGAL10)"
          aria-label="Promo code"
          className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground uppercase outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          type="submit"
          className="h-8 cursor-pointer rounded-md bg-accent px-3 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Apply
        </button>
      </form>

      {appliedCoupon && (
        <div
          className={`mt-2 flex items-start justify-between gap-2 rounded-md border px-2.5 py-2 text-xs ${
            isCouponValid
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <Tag size={13} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 break-words">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold tracking-wide uppercase">
                  {appliedCoupon}:
                </span>
                <span className="font-semibold">
                  {isCouponValid
                    ? `Saved ₹${couponDiscount.toFixed(2)}`
                    : "Invalid coupon"}
                </span>
              </div>
              {couponMessage && (
                <p className="mt-0.5 text-[11px] font-medium leading-tight opacity-90">
                  {couponMessage}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemovePromo}
            aria-label="Remove coupon"
            title="Remove coupon"
            className="shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </>
  );
}
