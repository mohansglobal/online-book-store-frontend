// Custom hook encapsulating discount calculation, validation, and submission logic
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useApplyListingDiscountMutation,
  useRemoveListingDiscountMutation,
} from "@/features/books";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";
import type { DiscountType } from "../types/discount-types";

interface UseDiscountFormParams {
  listing: SellerBookListingItem;

  onClose: () => void;
}

export function useDiscountForm({ listing, onClose }: UseDiscountFormParams) {
  const mrpInPaise = listing.mrpInPaise ?? 0;

  const mrp = listing.mrp ?? (mrpInPaise > 0 ? Math.round(mrpInPaise / 100) : 0);

  const effectiveSellingPriceInPaise =
    listing.priceInPaise ??
    (listing.price !== undefined
      ? listing.price * 100
      : listing.sellingPriceInPaise ?? mrpInPaise);

  const currentSellingPrice =
    listing.price ?? Math.round(effectiveSellingPriceInPaise / 100);

  const existingSchedule = listing.discountSchedule;

  const activeDiscount = listing.activeDiscount;

  const startDateVal = activeDiscount?.startDate || existingSchedule?.startDate;

  const endDateVal = activeDiscount?.endDate || existingSchedule?.endDate;

  const hasExistingSchedule = Boolean(startDateVal && endDateVal);

  const hasDiscount = Boolean(
    listing.isDiscountActive ||
    (listing.discountPercentage && listing.discountPercentage > 0) ||
    (mrp > 0 && currentSellingPrice < mrp) ||
    hasExistingSchedule,
  );

  let initialDiscountPct = listing.discountPercentage ?? 0;

  if (!initialDiscountPct && hasDiscount && mrp > 0) {
    const savings = mrp - currentSellingPrice;

    const calculatedPct = Math.round((savings / mrp) * 100);

    initialDiscountPct = Math.max(0, calculatedPct);
  }

  const initialDiscountType: DiscountType =
    (activeDiscount?.discountType as DiscountType) ||
    existingSchedule?.discountType ||
    "PERCENTAGE";

  const initialDiscountVal =
    listing.discountPercentage ??
    activeDiscount?.discountValue ??
    existingSchedule?.discountValue ??
    initialDiscountPct;

  const [discountType, setDiscountType] = useState<DiscountType>(initialDiscountType);

  const [discountValue, setDiscountValue] = useState<number>(initialDiscountVal);

  const [isScheduled, setIsScheduled] = useState(hasExistingSchedule);

  const [campaignName, setCampaignName] = useState(existingSchedule?.campaignName || "");

  const initialStartDate = startDateVal
    ? new Date(startDateVal).toISOString().slice(0, 10)
    : "";

  const initialEndDate = endDateVal
    ? new Date(endDateVal).toISOString().slice(0, 10)
    : "";

  const [startDate, setStartDate] = useState(initialStartDate);

  const [endDate, setEndDate] = useState(initialEndDate);

  const applyDiscountMutation = useApplyListingDiscountMutation();

  const removeDiscountMutation = useRemoveListingDiscountMutation();

  const isPercentage = discountType === "PERCENTAGE";

  const maxDiscountValue = isPercentage ? 99 : Math.max(1, mrp - 1);

  let discountAmount = 0;

  if (isPercentage) {
    const calculatedDiscount = (mrp * discountValue) / 100;

    discountAmount = Math.round(calculatedDiscount);
  } else {
    discountAmount = discountValue;
  }

  const calculatedSellingPrice = Math.max(0, mrp - discountAmount);

  const calculatedSavingsPct = mrp > 0 ? Math.round((discountAmount / mrp) * 100) : 0;

  const isNegative = discountValue < 0;

  const isExceedingMax = isPercentage ? discountValue > 99 : discountValue >= mrp;

  const isDatesInvalid =
    isScheduled && (!startDate || !endDate || new Date(startDate) > new Date(endDate));

  const isValid = !isNegative && !isExceedingMax && !isDatesInvalid;

  let validationError = "";

  if (isNegative) {
    validationError = "Discount value cannot be negative.";
  } else if (isExceedingMax) {
    validationError = isPercentage
      ? "Percentage discount cannot exceed 99%."
      : `Flat discount must be less than MRP (₹${mrp}).`;
  } else if (isDatesInvalid) {
    validationError = "Please select a valid start date and end date.";
  }

  const handleApply = async () => {
    if (!isValid) {
      toast.error(validationError || "Invalid discount value");
      return;
    }

    try {
      const formattedStartDate =
        isScheduled && startDate ? new Date(startDate).toISOString() : undefined;

      const formattedEndDate =
        isScheduled && endDate ? new Date(`${endDate}T23:59:59.999Z`).toISOString() : undefined;

      const response = await applyDiscountMutation.mutateAsync({
        listingId: listing._id,
        discountType,
        discountValue,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        campaignName: isScheduled && campaignName.trim() ? campaignName.trim() : undefined,
      });

      const message =
        response.message ||
        (discountValue === 0
          ? "Discount removed successfully"
          : isScheduled
            ? "Scheduled discount applied successfully"
            : "Discount applied successfully");

      toast.success(message);

      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to apply discount";

      toast.error(errorMessage);
    }
  };

  const handleRemoveDiscount = async () => {
    try {
      const response = await removeDiscountMutation.mutateAsync(listing._id);

      const message = response.message || "Discount removed successfully";

      toast.success(message);

      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove discount";

      toast.error(errorMessage);
    }
  };

  const isSaving = applyDiscountMutation.isPending || removeDiscountMutation.isPending;

  return {
    mrp,
    currentSellingPrice,
    hasDiscount,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    isPercentage,
    maxDiscountValue,
    discountAmount,
    calculatedSellingPrice,
    calculatedSavingsPct,
    isScheduled,
    setIsScheduled,
    campaignName,
    setCampaignName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isValid,
    validationError,
    handleApply,
    handleRemoveDiscount,
    isSaving,
    existingSchedule,
  };
}
