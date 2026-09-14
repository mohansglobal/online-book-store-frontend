"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

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
