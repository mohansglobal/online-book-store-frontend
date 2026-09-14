"use client";

import React from "react";
import { CreditCard, Banknote } from "lucide-react";
import type { PaymentMethod } from "./types";
import type { CheckoutPaymentMethod } from "@/features/checkout";

interface CheckoutPaymentMethodsProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  availableMethods?: CheckoutPaymentMethod[];
}

export function CheckoutPaymentMethods({
  paymentMethod,
  onPaymentMethodChange,
  availableMethods,
}: CheckoutPaymentMethodsProps) {
  const isCodAvailable =
    availableMethods?.find((m) => m.id === "CASH_ON_DELIVERY")?.isAvailable ?? true;
  const isOnlineAvailable =
    availableMethods?.find((m) => m.id === "ONLINE_PAY")?.isAvailable ?? true;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <span className="mb-2 block text-[10px] font-bold text-muted-foreground uppercase">
        Payment Method
      </span>
      <div className="grid grid-cols-2 gap-2">
        {/* Online Payment */}
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${
            !isOnlineAvailable
              ? "cursor-not-allowed opacity-50 border-border"
              : paymentMethod === "online"
              ? "border-accent bg-accent/5 text-accent"
              : "border-border text-text-secondary hover:bg-surface-soft"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            disabled={!isOnlineAvailable}
            checked={paymentMethod === "online"}
            onChange={() => onPaymentMethodChange("online")}
            className="sr-only"
          />
          <CreditCard size={18} aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase">Online Pay</span>
        </label>

        {/* Cash on Delivery */}
        <label
          title={!isCodAvailable ? "COD is unavailable for this order" : undefined}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${
            !isCodAvailable
              ? "cursor-not-allowed opacity-45 border-border bg-surface-soft/40"
              : paymentMethod === "cod"
              ? "border-accent bg-accent/5 text-accent"
              : "border-border text-text-secondary hover:bg-surface-soft"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            disabled={!isCodAvailable}
            checked={paymentMethod === "cod"}
            onChange={() => {
              if (isCodAvailable) {
                onPaymentMethodChange("cod");
              }
            }}
            className="sr-only"
          />
          <Banknote size={18} aria-hidden="true" />
          <div className="text-center">
            <span className="block text-[11px] font-bold uppercase">Cash on Delivery</span>
            {!isCodAvailable && (
              <span className="block text-[9px] font-medium text-destructive">
                Unavailable
              </span>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
