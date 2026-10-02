// Checkout payment method selector using custom card toggles
"use client";

import React from "react";
import { CreditCard, Banknote } from "lucide-react";
import { Label } from "@/components/ui/label";
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
  const codMethod = availableMethods?.find((m) => m.id === "CASH_ON_DELIVERY");
  const isCodAvailable = codMethod?.isAvailable ?? true;

  const onlineMethod = availableMethods?.find((m) => m.id === "ONLINE_PAY");
  const isOnlineAvailable = onlineMethod?.isAvailable ?? true;

  const handleSelectOnline = () => {
    if (isOnlineAvailable) {
      onPaymentMethodChange("online");
    }
  };

  const handleSelectCod = () => {
    if (isCodAvailable) {
      onPaymentMethodChange("cod");
    }
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <Label className="mb-2 block text-[10px] font-bold text-muted-foreground uppercase">
        Payment Method
      </Label>

      <div className="grid grid-cols-2 gap-3">
        {/* Online Pay Card Option */}
        <button
          type="button"
          onClick={handleSelectOnline}
          disabled={!isOnlineAvailable}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${
            !isOnlineAvailable
              ? "cursor-not-allowed opacity-50 border-border"
              : paymentMethod === "online"
              ? "border-accent bg-accent/5 text-accent cursor-pointer"
              : "border-border text-text-secondary hover:bg-surface-soft cursor-pointer"
          }`}
        >
          <CreditCard size={18} aria-hidden="true" />

          <span className="text-[11px] font-bold uppercase">
            Online Pay
          </span>
        </button>

        {/* Cash on Delivery Card Option */}
        <button
          type="button"
          onClick={handleSelectCod}
          disabled={!isCodAvailable}
          title={!isCodAvailable ? "COD is unavailable for this order" : undefined}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-md border p-2.5 transition-all ${
            !isCodAvailable
              ? "cursor-not-allowed opacity-45 border-border bg-surface-soft/40"
              : paymentMethod === "cod"
              ? "border-accent bg-accent/5 text-accent cursor-pointer"
              : "border-border text-text-secondary hover:bg-surface-soft cursor-pointer"
          }`}
        >
          <Banknote size={18} aria-hidden="true" />

          <div className="text-center">
            <span className="block text-[11px] font-bold uppercase">
              Cash on Delivery
            </span>

            {!isCodAvailable && (
              <span className="block text-[9px] font-medium text-destructive">
                Unavailable
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
