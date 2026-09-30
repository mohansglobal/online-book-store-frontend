"use client";

import React, { useState, useOptimistic, startTransition } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import type { PaymentMethod } from "./types";
import { OrderItemRow, type OrderItemDisplay } from "./order-item-row";
import { CheckoutTotals } from "./checkout-totals";
import { CheckoutTrustBadges } from "./checkout-trust-badges";
import { CheckoutPaymentMethods } from "./checkout-payment-methods";
import { CheckoutCouponForm } from "./checkout-coupon-form";
import { TermsConditionsDialog } from "./terms-conditions-dialog";
import type { CheckoutIssue, CheckoutPaymentMethod } from "@/features/checkout";

interface CheckoutOrderSummaryProps {
  items: OrderItemDisplay[];
  subtotal: number;
  totalMrp?: number;
  mrpSavings: number;
  totalAmount?: number;
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
  onUpdateQuantity?: (bookListingId: string, quantity: number) => void;
  isUpdatingQuantity?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  mrpSavings,
  totalAmount,
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
  onUpdateQuantity,
  isUpdatingQuantity,
}: CheckoutOrderSummaryProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Optimistic quantity management for the Your Order card items
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (
      currentItems: OrderItemDisplay[],
      update: { bookListingId: string; quantity: number },
    ) => {
      return currentItems.map((item) => {
        const id = item.bookListingId || item.id;
        if (id === update.bookListingId) {
          return { ...item, quantity: update.quantity };
        }
        return item;
      });
    },
  );

  const handleOptimisticUpdateQuantity = (
    bookListingId: string,
    quantity: number,
  ) => {
    if (quantity < 1) return;

    startTransition(async () => {
      setOptimisticItems({ bookListingId, quantity });
      if (onUpdateQuantity) {
        await onUpdateQuantity(bookListingId, quantity);
      }
    });
  };

  const optimisticItemCount = optimisticItems.reduce(
    (acc, curr) => acc + curr.quantity,
    0,
  );

  const optimisticSubtotal = React.useMemo(() => {
    const hasQuantityMismatch = optimisticItems.some((optItem) => {
      const original = items.find(
        (it) => (it.bookListingId || it.id) === (optItem.bookListingId || optItem.id),
      );
      return !original || original.quantity !== optItem.quantity;
    });

    if (!hasQuantityMismatch) {
      return subtotal;
    }

    return optimisticItems.reduce((acc, item) => {
      const unitPrice =
        typeof item.sellingPriceInPaise === "number"
          ? item.sellingPriceInPaise / 100
          : item.price || 0;
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [optimisticItems, items, subtotal]);

  const optimisticTotal = React.useMemo(() => {
    if (typeof totalAmount === "number") {
      const subtotalDiff = optimisticSubtotal - subtotal;
      return Math.max(0, totalAmount + subtotalDiff);
    }

    return Math.max(
      0,
      optimisticSubtotal + deliveryCharge - couponDiscount,
    );
  }, [totalAmount, optimisticSubtotal, subtotal, deliveryCharge, couponDiscount]);

  const finalTotal = optimisticTotal;

  const totalSavings = mrpSavings + couponDiscount;

  return (
    <aside className="lg:sticky lg:top-20">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground sm:text-lg">Your Order</h2>
          <span className="rounded-full bg-surface-soft border border-border px-2.5 py-0.5 text-[11px] font-bold text-foreground">
            {optimisticItemCount} items
          </span>
        </div>

        {/* Live Items List with Custom Scrollbar */}
        <div className="mb-4 max-h-[190px] space-y-2 overflow-y-auto pr-1.5 custom-scrollbar">
          {optimisticItems.map((item, idx) => (
            <OrderItemRow
              key={item.bookListingId || item.id || idx}
              item={item}
              onUpdateQuantity={handleOptimisticUpdateQuantity}
              isUpdating={isUpdatingQuantity}
            />
          ))}
        </div>

        {/* Totals Breakdown */}
        <CheckoutTotals
          itemCount={optimisticItemCount}
          subtotal={optimisticSubtotal}
          deliveryCharge={deliveryCharge}
          couponDiscount={couponDiscount}
          finalTotal={finalTotal}
          totalSavings={totalSavings}
          deliveryDays={deliveryDays}
        />

        {/* Coupon Code Section */}
        <CheckoutCouponForm
          couponCode={couponCode}
          onCouponCodeChange={onCouponCodeChange}
          appliedCoupon={appliedCoupon}
          couponDiscount={couponDiscount}
          couponMessage={couponMessage}
          isCouponValid={isCouponValid}
          onApplyPromo={onApplyPromo}
          onRemovePromo={onRemovePromo}
        />

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
        <div className="mt-4 flex items-start gap-2">
          <input
            id="checkout-terms-checkbox"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded-full accent-accent cursor-pointer"
          />
          <label
            htmlFor="checkout-terms-checkbox"
            className="text-[10px] font-bold text-foreground uppercase cursor-pointer select-none"
          >
            I Accept the{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTermsOpen(true);
              }}
              className="text-accent underline hover:text-accent-hover cursor-pointer font-bold inline"
            >
              Terms & Conditions
            </button>{" "}
            *
          </label>
        </div>

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
                    ? `Confirm Cash On Delivery • ₹${finalTotal.toFixed(2)}`
                    : `Pay Securely Now • ₹${finalTotal.toFixed(2)}`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Trust & Guarantee Badges */}
      <CheckoutTrustBadges />

      <TermsConditionsDialog
        open={isTermsOpen}
        onOpenChange={setIsTermsOpen}
        onAccept={() => onAcceptedTermsChange(true)}
      />
    </aside>
  );
}
