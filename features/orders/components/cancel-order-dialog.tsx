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
}

export function CancelOrderDialog({
  orderId,
  orderNumber,
  open,
  onOpenChange,
}: CancelOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const cancelMutation = useCancelOrderMutation();

  const handleConfirmCancel = () => {
    cancelMutation.mutate(
      { orderId, reason: selectedReason },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:rounded-2xl">
        <AlertTriangle
          aria-hidden
          className="pointer-events-none absolute -top-4 -right-3 size-32 rotate-12 text-destructive opacity-[0.05]"
        />

        <DialogHeader className="relative z-10 text-left">
          {/* <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle size={20} />
          </div> */}
          <DialogTitle className="text-base font-bold text-foreground">
            Cancel Order #{orderNumber || orderId}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 space-y-3 py-2">
          <label className="text-xs font-semibold text-foreground block">
            Reason for cancellation
          </label>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                  selectedReason === reason
                    ? "border-accent bg-accent/5 text-foreground font-semibold"
                    : "border-border/70 bg-surface-soft/50 text-muted-foreground hover:bg-surface-soft"
                }`}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-accent text-accent"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
            If already paid online, your refund will be automatically initiated to the original payment method.
          </div>
        </div>

        <DialogFooter className="relative z-10 mt-2 flex flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={cancelMutation.isPending}
            className="cursor-pointer rounded-xl border border-border bg-surface-soft px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={cancelMutation.isPending}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-60"
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Cancel Order</span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
