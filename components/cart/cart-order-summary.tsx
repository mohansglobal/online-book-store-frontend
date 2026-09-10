"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

type CartOrderSummaryProps = {
  subtotal: number;
  totalMrp: number;
  mrpSavings: number;
  totalCount: number;
};

const DELIVERY_CHARGE: number = 0;

export function CartOrderSummary({
  subtotal,
  totalMrp,
  mrpSavings,
  totalCount,
}: CartOrderSummaryProps) {
  const router = useRouter();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const totalSavings = mrpSavings + couponDiscount;
  const grandTotal = Math.max(0, subtotal - couponDiscount + DELIVERY_CHARGE);

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Coupon validation is a placeholder — real validation happens on backend
    toast.info(
      "Coupon validation will be available soon. Coupons are verified at checkout.",
    );
  };

  const handleRemoveCoupon = (): void => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleProceedToCheckout = (): void => {
    setIsCheckingOut(true);

    window.setTimeout(() => {
      router.push("/checkout");
    }, 300);
  };

  return (
    <aside className="sticky top-24 space-y-5 lg:col-span-4">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-5 border-b border-border pb-3 text-lg font-semibold">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>
              Items ({totalCount})
            </span>

            <span className="text-muted-foreground line-through">
              ₹{totalMrp.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal (Discounted)</span>

            <span className="font-medium text-foreground">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>

            <span className="font-medium text-foreground">
              {DELIVERY_CHARGE === 0
                ? "Free"
                : `₹${DELIVERY_CHARGE.toFixed(2)}`}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between font-medium text-accent">
              <span>Coupon Savings</span>

              <span>-₹{couponDiscount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="my-5 border-t border-border pt-4">
          <div className="flex items-end justify-between">
            <span className="text-base font-medium">Total</span>

            <span className="text-2xl font-bold tracking-tight">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          {totalSavings > 0 && (
            <div className="mt-1.5 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              You saved ₹{totalSavings.toFixed(2)} on this order!
            </div>
          )}
        </div>

        {/* Checkout */}
        <button
          type="button"
          onClick={handleProceedToCheckout}
          disabled={isCheckingOut}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent font-semibold text-white shadow-sm transition-all hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isCheckingOut ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </button>

        {/* Coupon */}
        <div className="mt-6 border-t border-border pt-5">
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder="Gift or promo code"
              aria-label="Gift or promo code"
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            <button
              type="submit"
              className="h-10 cursor-pointer rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Apply
            </button>
          </form>

          {appliedCoupon && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
              <CheckCircle2 size={14} />
              Code {appliedCoupon} applied
            </div>
          )}
        </div>
      </div>

      {/* Assurance */}
      <div className="flex items-center justify-center gap-4 rounded-lg border border-border bg-surface-soft px-2 py-4 text-xs text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck size={18} className="text-primary" />
          <span>Genuine</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex flex-col items-center gap-1">
          <Truck size={18} className="text-primary" />
          <span>Fast Delivery</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex flex-col items-center gap-1">
          <RotateCcw size={18} className="text-primary" />
          <span>Easy Returns</span>
        </div>
      </div>
    </aside>
  );
}
