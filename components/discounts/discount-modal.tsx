// Modal dialog for applying or modifying listing discounts
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveCoverUrl } from "@/lib/image-url";
import { useApplyListingDiscountMutation } from "@/features/books";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";
import type { DiscountType } from "./discount-types";

interface DiscountModalProps {
  listing: SellerBookListingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const LABEL_CLASS =
  "text-[10px] font-bold uppercase tracking-wider text-muted-foreground";

interface DiscountFormProps {
  listing: SellerBookListingItem;
  onClose: () => void;
}

function DiscountForm({ listing, onClose }: DiscountFormProps) {
  const titleEn = listing.book?.title || "-";

  const authorNames = listing.book?.authors?.map((a) => a.name).filter(Boolean);
  const author = authorNames && authorNames.length > 0 ? authorNames.join(", ") : "-";

  const mrpInPaise = listing.mrpInPaise ?? 0;
  const mrp = Math.round(mrpInPaise / 100);

  const sellingPriceInPaise = listing.sellingPriceInPaise ?? mrpInPaise;
  const currentSellingPrice = Math.round(sellingPriceInPaise / 100);

  let initialDiscountPct = 10;

  if (mrp > 0 && currentSellingPrice < mrp) {
    const savings = mrp - currentSellingPrice;
    const calculatedPct = Math.round((savings / mrp) * 100);
    initialDiscountPct = Math.max(1, calculatedPct);
  }

  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(initialDiscountPct);

  const applyDiscountMutation = useApplyListingDiscountMutation();

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
  const coverUrl = resolveCoverUrl(listing.coverImage || listing.book?.coverImage);
  const calculatedSavingsPct = mrp > 0 ? Math.round((discountAmount / mrp) * 100) : 0;

  // Validation: 0 or negative is invalid
  const isZeroOrNegative = discountValue <= 0;
  const isExceedingMax = isPercentage ? discountValue > 99 : discountValue >= mrp;
  const isValid = !isZeroOrNegative && !isExceedingMax;

  let validationError = "";

  if (isZeroOrNegative) {
    validationError = "Discount value must be greater than 0.";
  } else if (isExceedingMax) {
    validationError = isPercentage
      ? "Percentage discount cannot exceed 99%."
      : `Flat discount must be less than MRP (₹${mrp}).`;
  }

  const handleApply = async () => {
    if (!isValid) {
      toast.error(validationError || "Invalid discount value");
      return;
    }

    try {
      const response = await applyDiscountMutation.mutateAsync({
        listingId: listing._id,
        discountType,
        discountValue,
      });

      const message = response.message || "Discount applied successfully";
      toast.success(message);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to apply discount";
      toast.error(errorMessage);
    }
  };

  const isSaving = applyDiscountMutation.isPending;

  return (
    <>
      {/* Book Preview Card */}
      <div className="flex items-center gap-3.5 rounded-xl border border-border bg-background p-3 my-2">
        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-soft">
          <Image
            src={coverUrl}
            alt={titleEn}
            fill
            sizes="48px"
            unoptimized={typeof coverUrl === "string" && !coverUrl.startsWith("/")}
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <h4 className="truncate text-sm font-semibold text-foreground">{titleEn}</h4>
          <p className="truncate text-xs text-muted-foreground">{author}</p>
          <p className="text-xs font-bold text-accent">MRP: ₹{mrp}</p>
        </div>
      </div>

      <div className="space-y-4 py-2">
        {/* Discount Type */}
        <div className="space-y-1.5">
          <Label className={LABEL_CLASS}>Discount Type</Label>
          <Select
            value={discountType}
            onValueChange={(val) => setDiscountType(val as DiscountType)}
          >
            <SelectTrigger className="h-10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 border-border bg-surface">
              <SelectItem value="PERCENTAGE" className="cursor-pointer text-xs">
                Percentage (%) Off
              </SelectItem>
              <SelectItem value="FLAT" className="cursor-pointer text-xs">
                Flat Amount (₹) Off
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discount Value */}
        <div className="space-y-1.5">
          <Label htmlFor="discountValue" className={LABEL_CLASS}>
            {isPercentage ? "Percentage Off (%)" : "Amount Off (₹)"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            min={1}
            max={maxDiscountValue}
            value={discountValue || ""}
            onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
            className="h-10 text-xs"
          />
          {validationError && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle size={12} />
              {validationError}
            </p>
          )}
        </div>

        {/* New Selling Price Calculation Preview Card */}
        <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 p-3.5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
              New Selling Price
            </p>
            <p className="text-xs text-muted-foreground">
              Buyer saves ₹{discountAmount} ({calculatedSavingsPct}%)
            </p>
          </div>
          <p className="font-sans text-xl font-bold text-accent">
            ₹{calculatedSellingPrice}
          </p>
        </div>
      </div>

      <DialogFooter className="mt-4 flex gap-2 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 h-10 cursor-pointer text-xs"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleApply}
          disabled={isSaving || !isValid}
          className="flex-1 h-10 cursor-pointer bg-accent text-white hover:bg-accent-hover text-xs font-semibold"
        >
          {isSaving ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Applying...
            </span>
          ) : (
            "Apply Discount"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}

export function DiscountModal({
  listing,
  isOpen,
  onClose,
}: DiscountModalProps) {
  if (!listing) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-accent" />
            Manage Listing Discount
          </DialogTitle>
        </DialogHeader>

        <DiscountForm
          key={listing._id}
          listing={listing}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

