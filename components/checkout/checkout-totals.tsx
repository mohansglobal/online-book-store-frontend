import React from "react";

interface CheckoutTotalsProps {
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  couponDiscount: number;
  finalTotal: number;
  totalSavings: number;
  deliveryDays?: { min: number; max: number };
}

export function CheckoutTotals({
  itemCount,
  subtotal,
  deliveryCharge,
  couponDiscount,
  finalTotal,
  totalSavings,
  deliveryDays,
}: CheckoutTotalsProps) {
  return (
    <div className="space-y-1.5 border-t border-border pt-3 text-xs text-text-secondary">
      <div className="flex justify-between">
        <span>Subtotal ({itemCount} items)</span>
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
          Estimated Delivery:{" "}
          <span className="font-semibold text-foreground">
            {deliveryDays.min}–{deliveryDays.max} business days
          </span>
        </p>
      )}
    </div>
  );
}
