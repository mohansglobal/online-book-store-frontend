"use client";

import React from "react";
import {
  Lock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  X,
  AlertTriangle,
} from "lucide-react";
import type { PaymentMethod } from "./types";
import { OrderItemRow, type OrderItemDisplay } from "./order-item-row";
import { CheckoutPaymentMethods } from "./checkout-payment-methods";
import type { CheckoutIssue, CheckoutPaymentMethod } from "@/features/checkout";

interface CheckoutOrderSummaryProps {
  items: OrderItemDisplay[];
  subtotal: number;
  totalMrp?: number;
  mrpSavings: number;
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  couponMessage?: string;
  isCouponValid?: boolean;
  onApplyPromo: (e: React.FormEvent) => void;
  onRemovePromo: () => void;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  availablePaymentMethods?: CheckoutPaymentMethod[];
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  isProcessing: boolean;
  canCheckout?: boolean;
  checkoutIssues?: CheckoutIssue[];
  deliveryCharge?: number;
  deliveryDays?: { min: number; max: number };
  onProceed: () => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  mrpSavings,
  couponCode,
  onCouponCodeChange,
  appliedCoupon,
  couponDiscount,
  couponMessage,
  isCouponValid = true,
  onApplyPromo,
  onRemovePromo,
  paymentMethod,
  onPaymentMethodChange,
  availablePaymentMethods,
  acceptedTerms,
  onAcceptedTermsChange,
  isProcessing,
  canCheckout = true,
  checkoutIssues = [],
  deliveryCharge = 0,
  deliveryDays,
  onProceed,
}: CheckoutOrderSummaryProps) {
  const finalTotal = Math.max(0, subtotal + deliveryCharge - couponDiscount);
  const totalSavings = mrpSavings + couponDiscount;

  return (
    <aside className="lg:sticky lg:top-20">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground sm:text-lg">Your Order</h2>
          <span className="rounded-full bg-surface-soft border border-border px-2.5 py-0.5 text-[11px] font-bold text-foreground">
            {items.reduce((acc, curr) => acc + curr.quantity, 0)} items
          </span>
        </div>

        {/* Live Items List with Custom Scrollbar */}
        <div className="mb-4 max-h-[190px] space-y-2 overflow-y-auto pr-1.5 custom-scrollbar">
          {items.map((item, idx) => (
            <OrderItemRow key={item.id || item.bookListingId || idx} item={item} />
          ))}
        </div>

        {/* Totals Breakdown */}
        <div className="space-y-1.5 border-t border-border pt-3 text-xs text-text-secondary">
          <div className="flex justify-between">
            <span>Subtotal ({items.length} items)</span>
            <span className="font-medium font-sans text-foreground tabular-nums">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Charge</span>
            {deliveryCharge === 0 ? (
              <span className="font-medium text-emerald-600">FREE</span>
            ) : (
              <span className="font-medium font-sans text-foreground tabular-nums">
                ₹{deliveryCharge.toFixed(2)}
              </span>
            )}
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between font-semibold text-accent">
              <span>Coupon Discount</span>
              <span className="tabular-nums">-₹{couponDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-bold text-foreground uppercase">Total Amount</span>
            <span className="text-xl font-bold font-sans text-foreground tabular-nums">
              ₹{finalTotal.toFixed(2)}
            </span>
          </div>

          {totalSavings > 0 && (
            <p className="pt-1 text-right text-[10px] font-semibold text-emerald-600">
              You save ₹{totalSavings.toFixed(2)} on this order!
            </p>
          )}

          {deliveryDays && (
            <p className="pt-1 text-[11px] text-muted-foreground">
              Estimated Delivery: <span className="font-semibold text-foreground">{deliveryDays.min}–{deliveryDays.max} business days</span>
            </p>
          )}
        </div>

        {/* Coupon Code Box */}
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
            className={`mt-2 flex items-start justify-between gap-2 rounded-md border px-2.5 py-1.5 text-xs ${
              isCouponValid
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "border-destructive/30 bg-destructive/5 text-destructive"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-start gap-1.5">
              <Tag size={13} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1 break-words">
                <span className="mr-1.5 font-bold tracking-wide uppercase">
                  {appliedCoupon}:
                </span>
                <span className="font-semibold">
                  {isCouponValid
                    ? `Saved ₹${couponDiscount.toFixed(2)}`
                    : couponMessage || "Invalid coupon"}
                </span>
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

        {/* Checkout Issues Warning */}
        {checkoutIssues.length > 0 && (
          <div className="mt-3 space-y-1 rounded-md border border-amber-300 bg-amber-50 p-2.5 text-[11px] text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle size={13} className="shrink-0 text-amber-600" />
              <span>Please review before ordering:</span>
            </div>
            <ul className="list-inside list-disc pl-1 space-y-0.5">
              {checkoutIssues.map((issue, idx) => (
                <li key={idx}>{issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment Method Selector Subcomponent */}
        <CheckoutPaymentMethods
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
          availableMethods={availablePaymentMethods}
        />

        {/* Terms Checkbox */}
        <label className="mt-4 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded-full accent-accent cursor-pointer"
          />
          <span className="text-[10px] font-bold text-foreground uppercase">
            I Accept the{" "}
            <span className="text-accent underline">Terms & Conditions</span> *
          </span>
        </label>

        {/* Place Order CTA */}
        <button
          type="button"
          onClick={onProceed}
          disabled={isProcessing || !canCheckout}
          className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <Lock size={14} aria-hidden="true" />
              <span>
                {!canCheckout
                  ? "Resolve Issues to Continue"
                  : paymentMethod === "cod"
                    ? "Confirm Cash On Delivery"
                    : "Pay Securely Now"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Trust & Guarantee Badges */}
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
    </aside>
  );
}
