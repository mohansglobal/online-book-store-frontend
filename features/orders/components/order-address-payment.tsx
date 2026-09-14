"use client";

import React from "react";
import { CreditCard, MapPin } from "lucide-react";
import type { Order } from "../types/order.types";
import { formatOrderPrice, toTitleCase } from "../utils/order-helpers";

interface OrderAddressPaymentProps {
  order: Order;
}

export function OrderAddressPayment({ order }: OrderAddressPaymentProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Left: Delivery Address */}
        <div className="flex flex-col justify-between space-y-3">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <MapPin size={14} className="text-accent shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Delivery Address
              </h3>
            </div>

            {order.shippingAddress ? (
              <div className="space-y-1 text-xs text-foreground/90">
                <p className="text-sm font-bold text-foreground">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.streetAddress}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="pt-1 text-[11px] text-muted-foreground">
                  Phone:{" "}
                  <span className="font-semibold text-foreground">
                    {order.shippingAddress.mobileNumber}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No delivery address recorded
              </p>
            )}
          </div>
        </div>

        {/* Right: Payment Summary */}
        <div className="space-y-2.5 border-t border-border pt-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
          <div className="mb-2.5 flex items-center gap-2">
            <CreditCard size={14} className="text-accent shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Payment Summary
            </h3>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Items Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatOrderPrice(order.subtotalInPaise)}
            </span>
          </div>

          {order.couponDiscountInPaise > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span>Discount ({order.couponCode || "COUPON"})</span>
              <span className="font-semibold">
                -{formatOrderPrice(order.couponDiscountInPaise)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Delivery Fee</span>
            <span>
              {order.deliveryChargeInPaise > 0
                ? formatOrderPrice(order.deliveryChargeInPaise)
                : "FREE"}
            </span>
          </div>

          <div className="flex justify-between border-t border-border pt-2 text-xs sm:text-sm font-bold text-foreground">
            <span>Total Paid</span>
            <span className="text-accent tabular-nums">
              {formatOrderPrice(order.totalAmountInPaise)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
            <span>
              Method:{" "}
              <span className="font-semibold text-foreground">
                {order.paymentMethod === "CASH_ON_DELIVERY"
                  ? "Cash On Delivery"
                  : "Online Payment"}
              </span>
            </span>
            <span>
              Payment:{" "}
              <span className="font-semibold text-foreground">
                {toTitleCase(order.paymentStatus)}
              </span>
            </span>
          </div>

          {order.refundStatus && order.refundStatus !== "NONE" && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Refund Status:{" "}
              <span className="font-semibold">
                {toTitleCase(order.refundStatus)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

