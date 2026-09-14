"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  orderNumber: string;
  totalAmount: number;
  customerName?: string;
  customerEmail?: string;
  onClose: () => void;
}

export function CheckoutSuccessModal({
  isOpen,
  orderNumber,
  totalAmount,
  customerName,
  customerEmail,
  onClose,
}: CheckoutSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmed-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="animate-in w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center shadow-2xl zoom-in-95">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>

        <h3 id="order-confirmed-title" className="text-xl font-bold text-foreground">
          Order Placed Successfully!
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Thank you{customerName ? `, ${customerName}` : ""}! A confirmation email has been sent
          {customerEmail ? ` to ${customerEmail}` : ""}.
        </p>

        <div className="my-5 space-y-1.5 rounded-md border border-border bg-background p-3 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-mono font-bold text-foreground">{orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid:</span>
            <span className="font-bold font-sans text-foreground">₹{totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Delivery:</span>
            <span className="font-medium text-emerald-600">3–5 Business Days</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/orders"
            onClick={onClose}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-accent text-xs font-bold text-white uppercase transition-colors hover:bg-accent-hover shadow-sm"
          >
            <ShoppingBag size={14} />
            View My Orders
          </Link>

          <Link
            href="/books"
            onClick={onClose}
            className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-border text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground"
          >
            <span>Continue Browsing Books</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
