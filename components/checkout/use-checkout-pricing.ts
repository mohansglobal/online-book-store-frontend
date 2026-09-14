"use client";

import { useState, useCallback } from "react";
import type { CartItemView, CartSummaryView } from "@/features/cart";
import type { CheckoutSummaryData } from "@/features/checkout";
import type { OrderItemDisplay } from "./order-item-row";

export interface CachedCheckoutData {
  items: OrderItemDisplay[];
  subtotal: number;
  totalMrp: number;
  mrpSavings: number;
  couponDiscount: number;
  deliveryCharge: number;
}

interface UseCheckoutPricingParams {
  checkoutSummary: CheckoutSummaryData | undefined;
  summary: CartSummaryView;
  items: CartItemView[];
  isOrderComplete: boolean;
  isPlacingOrder?: boolean;
}

export function useCheckoutPricing({
  checkoutSummary,
  summary,
  items,
  isOrderComplete,
  isPlacingOrder = false,
}: UseCheckoutPricingParams) {
  const subtotal = checkoutSummary
    ? checkoutSummary.pricing.subtotalInPaise / 100
    : summary.subtotal;
  const totalMrp = checkoutSummary
    ? checkoutSummary.pricing.mrpTotalInPaise / 100
    : summary.totalMrp;
  const mrpSavings = checkoutSummary
    ? checkoutSummary.pricing.totalSavingsInPaise / 100
    : summary.mrpSavings;
  const couponDiscount = checkoutSummary?.coupon?.isValid
    ? checkoutSummary.coupon.discountInPaise / 100
    : 0;
  const deliveryCharge = checkoutSummary
    ? checkoutSummary.pricing.deliveryChargeInPaise / 100
    : 0;
  const canCheckout = checkoutSummary?.checkoutState?.canCheckout ?? true;
  const checkoutIssues = checkoutSummary?.checkoutState?.issues ?? [];
  const displayItems: OrderItemDisplay[] = checkoutSummary?.items?.length
    ? checkoutSummary.items
    : items;

  const [snapshot, setSnapshot] = useState<CachedCheckoutData | null>(null);

  const captureSnapshot = useCallback(() => {
    setSnapshot({
      items: displayItems,
      subtotal,
      totalMrp,
      mrpSavings,
      couponDiscount,
      deliveryCharge,
    });
  }, [displayItems, subtotal, totalMrp, mrpSavings, couponDiscount, deliveryCharge]);

  const shouldUseSnapshot =
    Boolean(snapshot) &&
    (isOrderComplete || isPlacingOrder || displayItems.length === 0);

  const activeItems =
    shouldUseSnapshot && snapshot ? snapshot.items : displayItems;
  const activeSubtotal =
    shouldUseSnapshot && snapshot ? snapshot.subtotal : subtotal;
  const activeTotalMrp =
    shouldUseSnapshot && snapshot ? snapshot.totalMrp : totalMrp;
  const activeMrpSavings =
    shouldUseSnapshot && snapshot ? snapshot.mrpSavings : mrpSavings;
  const activeCouponDiscount =
    shouldUseSnapshot && snapshot ? snapshot.couponDiscount : couponDiscount;
  const activeDeliveryCharge =
    shouldUseSnapshot && snapshot ? snapshot.deliveryCharge : deliveryCharge;

  return {
    activeItems,
    activeSubtotal,
    activeTotalMrp,
    activeMrpSavings,
    activeCouponDiscount,
    activeDeliveryCharge,
    canCheckout,
    checkoutIssues,
    captureSnapshot,
  };
}
