"use client";

import React from "react";
import { ScrollText, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
}

export function TermsConditionsDialog({
  open,
  onOpenChange,
  onAccept,
}: TermsConditionsDialogProps) {
  const handleAccept = () => {
    onAccept?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <ScrollText size={18} className="text-accent" />
            <DialogTitle className="text-base font-bold text-foreground">
              Terms & Conditions
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Standard terms governing order fulfillment and purchases.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] divide-y divide-border/40 overflow-y-auto pr-1 text-xs text-muted-foreground">
          <div className="py-2.5 first:pt-1">
            <h4 className="font-semibold text-foreground mb-1">
              1. Orders & Pricing
            </h4>
            <p className="leading-relaxed">
              All listings and pricing are verified before order processing. We reserve the right to correct any inadvertent typographic pricing errors.
            </p>
          </div>

          <div className="py-2.5">
            <h4 className="font-semibold text-foreground mb-1">
              2. Shipping & Delivery
            </h4>
            <p className="leading-relaxed">
              Delivery timelines range between 3 to 7 business days depending on location and courier availability. Tracking details are provided upon dispatch.
            </p>
          </div>

          <div className="py-2.5">
            <h4 className="font-semibold text-foreground mb-1">
              3. Cancellation & Returns
            </h4>
            <p className="leading-relaxed">
              Items may be cancelled prior to shipment. Defective, damaged, or incorrect books are eligible for replacement or return within 7 days of delivery.
            </p>
          </div>

          <div className="py-2.5">
            <h4 className="font-semibold text-foreground mb-1">
              4. Payment & Privacy
            </h4>
            <p className="leading-relaxed">
              Online transactions are securely encrypted. Your personal and shipping details are used solely to fulfill and track your order.
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck size={14} className="text-accent" />
            <span>Secure Checkout</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAccept}
              className="bg-accent text-xs font-semibold text-white hover:bg-accent-hover"
            >
              Accept Terms
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
