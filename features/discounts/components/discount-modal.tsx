// Modal dialog for applying, scheduling, or removing listing discounts
"use client";

import React from "react";
import { Tag, Loader2, AlertCircle, Trash2 } from "lucide-react";
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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { resolveCoverUrl } from "@/lib/image-url";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";
import type { DiscountType } from "../types/discount-types";
import { DiscountBookSummary } from "./discount-book-summary";
import { DiscountScheduleFields } from "./discount-schedule-fields";
import { useDiscountForm } from "../hooks/use-discount-form";

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

  const coverUrl = resolveCoverUrl(listing.coverImage || listing.book?.coverImage);

  const {
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
  } = useDiscountForm({ listing, onClose });

  return (
    <>
      <DiscountBookSummary
        coverUrl={coverUrl}
        titleEn={titleEn}
        author={author}
        mrp={mrp}
        hasDiscount={hasDiscount}
        currentSellingPrice={currentSellingPrice}
        campaignName={existingSchedule?.campaignName}
      />

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label className={LABEL_CLASS}>Discount Type</Label>

          <RadioGroup
            value={discountType}
            onValueChange={(val) => setDiscountType(val as DiscountType)}
            className="grid grid-cols-2 gap-2.5"
          >
            <div
              onClick={() => setDiscountType("PERCENTAGE")}
              className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                discountType === "PERCENTAGE"
                  ? "border-accent bg-accent/5 text-foreground"
                  : "border-border hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <RadioGroupItem value="PERCENTAGE" id="type-percentage" />

              <Label htmlFor="type-percentage" className="cursor-pointer text-xs font-medium">
                Percentage (%) Off
              </Label>
            </div>

            <div
              onClick={() => setDiscountType("FLAT")}
              className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                discountType === "FLAT"
                  ? "border-accent bg-accent/5 text-foreground"
                  : "border-border hover:bg-surface-hover text-muted-foreground"
              }`}
            >
              <RadioGroupItem value="FLAT" id="type-flat" />

              <Label htmlFor="type-flat" className="cursor-pointer text-xs font-medium">
                Flat Amount (₹) Off
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="discountValue" className={LABEL_CLASS}>
              {isPercentage ? "Percentage Off (%)" : "Amount Off (₹)"}
            </Label>

            {discountValue > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDiscountValue(0)}
                className="h-auto p-0 text-[10px] text-destructive hover:bg-transparent hover:underline cursor-pointer font-medium"
              >
                Clear to 0 (No discount)
              </Button>
            )}
          </div>

          <Input
            id="discountValue"
            type="number"
            min={0}
            max={maxDiscountValue}
            value={discountValue}
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

        <DiscountScheduleFields
          isScheduled={isScheduled}
          onIsScheduledChange={setIsScheduled}
          campaignName={campaignName}
          onCampaignNameChange={setCampaignName}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />

        <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 p-3.5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
              {isScheduled ? "Promotional Price Preview" : "New Selling Price"}
            </p>

            <p className="text-xs text-muted-foreground">
              {discountValue === 0
                ? "Full MRP price (No discount)"
                : `Buyer saves ₹${discountAmount} (${calculatedSavingsPct}%)`}
            </p>
          </div>

          <p className="font-sans text-xl font-bold text-accent">
            ₹{calculatedSellingPrice}
          </p>
        </div>
      </div>

      <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        {hasDiscount ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveDiscount}
            disabled={isSaving}
            className="h-10 cursor-pointer text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive transition-colors gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove Discount
          </Button>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 cursor-pointer text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            disabled={isSaving || !isValid}
            className="h-10 cursor-pointer bg-accent text-white hover:bg-accent-hover text-xs font-semibold"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </span>
            ) : isScheduled ? (
              "Schedule Discount"
            ) : discountValue === 0 ? (
              "Save (No Discount)"
            ) : (
              "Apply Discount"
            )}
          </Button>
        </div>
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
      <DialogContent className="max-w-md p-6 sm:rounded-2xl bg-surface border-border max-h-[90vh] overflow-y-auto">
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
