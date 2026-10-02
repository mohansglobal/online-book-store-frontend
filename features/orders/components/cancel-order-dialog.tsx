// Cancel order modal dialog using UI component library primitives
"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCancelOrderMutation } from "../mutations/use-cancel-order-mutation";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery time is too long",
  "Need to change shipping address / payment",
  "Other reason",
];

interface CancelOrderDialogProps {
  orderId: string;

  orderNumber?: string;

  open: boolean;

  onOpenChange: (open: boolean) => void;

  targetItem?: {
    id: string;

    title: string;
  };
}

export function CancelOrderDialog({
  orderId,
  orderNumber,
  open,
  onOpenChange,
  targetItem,
}: CancelOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  const cancelMutation = useCancelOrderMutation();

  const handleConfirmCancel = () => {
    const itemIds = targetItem?.id ? [targetItem.id] : undefined;

    cancelMutation.mutate(
      { orderId, itemIds, reason: selectedReason },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const isItemCancellation = Boolean(targetItem?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:rounded-2xl">
        <AlertTriangle
          aria-hidden
          className="pointer-events-none absolute -top-4 -right-3 size-32 rotate-12 text-destructive opacity-[0.05]"
        />

        <DialogHeader className="relative z-10 text-left">
          <DialogTitle className="text-base font-bold text-foreground">
            {isItemCancellation
              ? `Cancel Item: ${targetItem?.title}`
              : `Cancel Order #${orderNumber || orderId}`}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {isItemCancellation
              ? "Are you sure you want to cancel this item? Other items in your order will continue fulfillment."
              : "Are you sure you want to cancel this order? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 space-y-3 py-2">
          <Label className="text-xs font-semibold text-foreground block">
            Reason for cancellation
          </Label>

          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-1.5"
          >
            {CANCEL_REASONS.map((reason, index) => {
              const itemId = `reason-${index}`;

              return (
                <div
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? "border-accent bg-accent/5 text-foreground font-semibold"
                      : "border-border/70 bg-surface-soft/50 text-muted-foreground hover:bg-surface-soft"
                  }`}
                >
                  <RadioGroupItem value={reason} id={itemId} />

                  <Label htmlFor={itemId} className="cursor-pointer text-xs">
                    {reason}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            If already paid online, your refund will be automatically initiated to the original payment method.
          </div>
        </div>

        <DialogFooter className="relative z-10 mt-2 flex flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelMutation.isPending}
            className="cursor-pointer rounded-xl text-xs font-semibold"
          >
            {isItemCancellation ? "Keep Item" : "Keep Order"}
          </Button>

          <Button
            type="button"
            onClick={handleConfirmCancel}
            disabled={cancelMutation.isPending}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 size={13} className="animate-spin" />

                <span>Cancelling...</span>
              </>
            ) : (
              <span>{isItemCancellation ? "Cancel Item" : "Cancel Order"}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
