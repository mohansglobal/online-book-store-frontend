// Modal dialog for bulk applying or removing discounts across all or specific listings using UI components
"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Layers, Loader2, Trash2, Calendar, Info } from "lucide-react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  useApplyBulkDiscountMutation,
  useRemoveBulkDiscountMutation,
} from "@/features/books";
import type {
  BulkDiscountTargetType,
  ListingDiscountType,
} from "@/features/books/types/listing.types";

interface BulkDiscountModalProps {
  isOpen: boolean;

  onClose: () => void;

  selectedListingIds: string[];

  totalListingCount: number;

  initialMode?: "apply" | "remove";
}

const LABEL_CLASS =
  "text-[10px] font-bold uppercase tracking-wider text-muted-foreground";

export function BulkDiscountModal({
  isOpen,
  onClose,
  selectedListingIds,
  totalListingCount,
  initialMode = "apply",
}: BulkDiscountModalProps) {
  const [mode, setMode] = useState<"apply" | "remove">(initialMode);

  const defaultTarget: BulkDiscountTargetType =
    selectedListingIds.length > 0 ? "SPECIFIC" : "ALL";

  const [targetType, setTargetType] =
    useState<BulkDiscountTargetType>(defaultTarget);

  const [discountType, setDiscountType] =
    useState<ListingDiscountType>("PERCENTAGE");

  const [discountValue, setDiscountValue] = useState<number>(0);

  const [isScheduled, setIsScheduled] = useState(false);

  const [campaignName, setCampaignName] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const applyBulkMutation = useApplyBulkDiscountMutation();

  const removeBulkMutation = useRemoveBulkDiscountMutation();

  const isPercentage = discountType === "PERCENTAGE";

  const isSaving = applyBulkMutation.isPending || removeBulkMutation.isPending;

  const targetCount =
    targetType === "ALL" ? totalListingCount : selectedListingIds.length;

  const dateRangeValue: DateRange | undefined = useMemo(() => {
    if (!startDate) return undefined;

    return {
      from: new Date(startDate),
      to: endDate ? new Date(endDate) : undefined,
    };
  }, [startDate, endDate]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      setStartDate("");

      setEndDate("");

      return;
    }

    setStartDate(format(range.from, "yyyy-MM-dd"));

    if (range.to) {
      setEndDate(format(range.to, "yyyy-MM-dd"));
    } else {
      setEndDate("");
    }
  };

  const isDatesInvalid =
    isScheduled &&
    (!startDate || !endDate || new Date(startDate) > new Date(endDate));

  const isValueInvalid =
    mode === "apply" && (discountValue <= 0 || (isPercentage && discountValue > 99));

  const handleApplyBulk = async () => {
    if (isValueInvalid) {
      toast.error(
        isPercentage
          ? "Percentage discount must be between 1% and 99%."
          : "Flat discount must be greater than 0.",
      );

      return;
    }

    if (isDatesInvalid) {
      toast.error("Please provide valid start and end dates for scheduled promotion.");

      return;
    }

    try {
      const formattedStartDate =
        isScheduled && startDate ? new Date(startDate).toISOString() : undefined;

      const formattedEndDate =
        isScheduled && endDate
          ? new Date(`${endDate}T23:59:59.999Z`).toISOString()
          : undefined;

      const response = await applyBulkMutation.mutateAsync({
        targetType,
        listingIds: targetType === "SPECIFIC" ? selectedListingIds : undefined,
        discountType,
        discountValue,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        campaignName: isScheduled && campaignName.trim() ? campaignName.trim() : undefined,
      });

      const message = response.message || "Bulk discount applied successfully";

      toast.success(message);

      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to apply bulk discount";

      toast.error(errorMessage);
    }
  };

  const handleRemoveBulk = async () => {
    try {
      const response = await removeBulkMutation.mutateAsync({
        targetType,
        listingIds: targetType === "SPECIFIC" ? selectedListingIds : undefined,
      });

      const message = response.message || "Bulk discounts removed successfully";

      toast.success(message);

      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove bulk discounts";

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl bg-surface border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" />
            Bulk Manage Discounts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Action Mode Radio Group */}
          <div className="space-y-1.5">
            <Label className={LABEL_CLASS}>Action Mode</Label>

            <RadioGroup
              value={mode}
              onValueChange={(val) => setMode(val as "apply" | "remove")}
              className="grid grid-cols-2 gap-2"
            >
              <div
                onClick={() => setMode("apply")}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  mode === "apply"
                    ? "border-accent bg-accent/5 text-foreground"
                    : "border-border hover:bg-surface-hover text-muted-foreground"
                }`}
              >
                <RadioGroupItem value="apply" id="mode-apply" />

                <Label htmlFor="mode-apply" className="cursor-pointer text-xs font-semibold">
                  Apply / Schedule
                </Label>
              </div>

              <div
                onClick={() => setMode("remove")}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  mode === "remove"
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-border hover:bg-surface-hover text-muted-foreground"
                }`}
              >
                <RadioGroupItem value="remove" id="mode-remove" />

                <Label htmlFor="mode-remove" className="cursor-pointer text-xs font-semibold">
                  Remove Discounts
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Target Scope Radio Group */}
          <div className="space-y-1.5">
            <Label className={LABEL_CLASS}>Target Scope</Label>

            <RadioGroup
              value={targetType}
              onValueChange={(val) => setTargetType(val as BulkDiscountTargetType)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              <div
                onClick={() => setTargetType("ALL")}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  targetType === "ALL"
                    ? "border-accent bg-accent/5 text-foreground"
                    : "border-border hover:bg-surface-hover text-muted-foreground"
                }`}
              >
                <RadioGroupItem value="ALL" id="target-all" />

                <Label htmlFor="target-all" className="cursor-pointer text-xs font-medium">
                  All Listings ({totalListingCount})
                </Label>
              </div>

              <div
                onClick={() => {
                  if (selectedListingIds.length > 0) setTargetType("SPECIFIC");
                }}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors ${
                  selectedListingIds.length === 0
                    ? "opacity-50 cursor-not-allowed border-border"
                    : targetType === "SPECIFIC"
                      ? "border-accent bg-accent/5 text-foreground cursor-pointer"
                      : "border-border hover:bg-surface-hover text-muted-foreground cursor-pointer"
                }`}
              >
                <RadioGroupItem
                  value="SPECIFIC"
                  id="target-specific"
                  disabled={selectedListingIds.length === 0}
                />

                <Label
                  htmlFor="target-specific"
                  className={`text-xs font-medium ${
                    selectedListingIds.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  Selected Only ({selectedListingIds.length})
                </Label>
              </div>
            </RadioGroup>
          </div>

          {mode === "apply" ? (
            <>
              {/* Discount Type Radio Group */}
              <div className="space-y-1.5">
                <Label className={LABEL_CLASS}>Discount Type</Label>

                <RadioGroup
                  value={discountType}
                  onValueChange={(val) => setDiscountType(val as ListingDiscountType)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div
                    onClick={() => setDiscountType("PERCENTAGE")}
                    className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                      discountType === "PERCENTAGE"
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-border hover:bg-surface-hover text-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="PERCENTAGE" id="bulk-type-pct" />

                    <Label htmlFor="bulk-type-pct" className="cursor-pointer text-xs font-medium">
                      % Off MRP
                    </Label>
                  </div>

                  <div
                    onClick={() => setDiscountType("FLAT")}
                    className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                      discountType === "FLAT"
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-border hover:bg-surface-hover text-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="FLAT" id="bulk-type-flat" />

                    <Label htmlFor="bulk-type-flat" className="cursor-pointer text-xs font-medium">
                      Flat ₹ Off MRP
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Discount Value */}
              <div className="space-y-1.5">
                <Label htmlFor="bulkDiscountValue" className={LABEL_CLASS}>
                  {isPercentage ? "Percentage Off (%)" : "Flat Amount Off (₹)"}
                </Label>

                <Input
                  id="bulkDiscountValue"
                  type="number"
                  min={1}
                  max={isPercentage ? 99 : 10000}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                  className="h-10 text-xs"
                />
              </div>

              {/* Schedule Promotion with Switch and DateRangePicker */}
              <div className="space-y-3 rounded-xl border border-border/80 bg-surface-soft/40 p-3.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="bulkIsScheduledSwitch"
                    className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    Schedule Promotion (Date-Wise Window)
                  </Label>

                  <Switch
                    id="bulkIsScheduledSwitch"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                </div>

                {isScheduled && (
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <div className="space-y-1.5">
                      <Label htmlFor="bulkCampaignName" className={LABEL_CLASS}>
                        Campaign Name (Optional)
                      </Label>

                      <Input
                        id="bulkCampaignName"
                        type="text"
                        placeholder="e.g. Festive Mega Sale"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className={LABEL_CLASS}>Promotion Date Range</Label>

                      <DateRangePicker
                        value={dateRangeValue}
                        onChange={handleDateRangeChange}
                        placeholder="Select start and end dates"
                        minDate={new Date()}
                      />
                    </div>

                    <div className="flex items-start gap-1.5 rounded-lg bg-accent/5 border border-accent/15 p-2.5 text-[11px] text-muted-foreground">
                      <Info className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />

                      <p>
                        Declarative promotional pricing is evaluated dynamically. During this window,
                        the promotional price replaces the base price. Outside the window, it reverts to normal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-foreground space-y-2">
              <p className="font-semibold text-destructive flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" />
                Remove Discounts Confirmation
              </p>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                This will remove active discounts and scheduled promotions from{" "}
                <strong>{targetCount} listing(s)</strong>. Their selling prices will be restored
                to their standard MRP.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 h-10 cursor-pointer text-xs"
          >
            Cancel
          </Button>

          {mode === "apply" ? (
            <Button
              type="button"
              onClick={handleApplyBulk}
              disabled={isSaving || isValueInvalid || isDatesInvalid}
              className="flex-1 h-10 cursor-pointer bg-accent text-white hover:bg-accent-hover text-xs font-semibold"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Applying to {targetCount}...
                </span>
              ) : (
                `Apply to ${targetCount} Listings`
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleRemoveBulk}
              disabled={isSaving || targetCount === 0}
              className="flex-1 h-10 cursor-pointer bg-destructive text-white hover:bg-destructive/90 text-xs font-semibold"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Removing...
                </span>
              ) : (
                `Remove from ${targetCount} Listings`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
