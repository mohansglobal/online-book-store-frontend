"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import type { CheckoutCoupon } from "@/features/checkout";

export function useCouponToast(
  appliedCouponCode: string | null,
  coupon?: CheckoutCoupon | null,
) {
  const lastToastedCouponRef = useRef<string | null>(null);

  useEffect(() => {
    if (!appliedCouponCode) {
      lastToastedCouponRef.current = null;
      return;
    }

    const isMatchingCoupon =
      coupon &&
      coupon.code.toUpperCase() === appliedCouponCode.toUpperCase();

    if (isMatchingCoupon && lastToastedCouponRef.current !== appliedCouponCode) {
      lastToastedCouponRef.current = appliedCouponCode;

      if (coupon.isValid) {
        toast.success(coupon.message || `Coupon ${coupon.code} applied!`);
      } else {
        toast.error(coupon.message || `Coupon ${coupon.code} is not valid.`);
      }
    }
  }, [appliedCouponCode, coupon]);
}

export function useCheckoutPromo() {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const handleApplyPromo = (event: FormEvent) => {
    event.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter a promo code");
      return;
    }

    setAppliedCouponCode(code);
  };

  const handleRemovePromo = () => {
    setAppliedCouponCode(null);
    setCouponInput("");
    toast.info("Coupon removed");
  };

  return {
    couponInput,
    setCouponInput,
    appliedCouponCode,
    handleApplyPromo,
    handleRemovePromo,
  };
}
