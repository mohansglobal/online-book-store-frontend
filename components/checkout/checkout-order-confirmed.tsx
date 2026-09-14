"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import orderPlacedAnimation from "@/assets/Order Placed.json";

// Dynamic import of Lottie to prevent SSR hydration mismatch
const Lottie = dynamic(
  () => import("lottie-react").then((mod) => mod.Lottie),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-surface-soft/60 animate-pulse" />
    ),
  }
);

export interface CheckoutOrderConfirmedProps {
  isOpen?: boolean;
  orderNumber?: string;
  onClose?: () => void;
}

export function CheckoutOrderConfirmed({
  isOpen = true,
  orderNumber,
  onClose,
}: CheckoutOrderConfirmedProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose?.();
          router.replace("/orders");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, router, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-md border-border bg-background p-6 text-center shadow-2xl sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Order Confirmed</DialogTitle>
          <DialogDescription>
            Your book order has been successfully placed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated Lottie Graphic */}
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center overflow-hidden sm:h-56 sm:w-56">
            <Lottie
              src={orderPlacedAnimation}
              autoplay
              loop
              className="h-full w-full object-contain"
            />
          </div>

          {/* Confirmed title */}
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Order Confirmed!
          </h2>

          {/* Order reference if available */}
          {orderNumber && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Order #{orderNumber}</span>
            </div>
          )}

          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            Thank you for your purchase! Your book order has been successfully placed.
          </p>

          {/* 5-second countdown indicator */}
          <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span>
              Redirecting to orders in{" "}
              <strong className="font-mono font-bold text-foreground">{countdown}s</strong>
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/orders"
              replace
              onClick={onClose}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-accent px-5 text-xs font-bold text-white uppercase shadow-sm transition-colors hover:bg-accent-hover"
            >
              <ShoppingBag size={14} />
              <span>View Orders</span>
            </Link>
            <Link
              href="/books"
              replace
              onClick={onClose}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 text-xs font-semibold text-foreground transition-colors hover:bg-surface-soft"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

