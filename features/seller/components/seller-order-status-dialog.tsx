"use client";

import Image from "next/image";
import { User, Lock, Package, Calendar, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SellerRecentOrder } from "../types/seller.types";
import { SellerOrderStatusForm } from "./seller-order-status-form";

interface SellerOrderStatusDialogProps {
  order: SellerRecentOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerOrderStatusDialog({
  order,
  open,
  onOpenChange,
}: SellerOrderStatusDialogProps) {
  if (!order) {
    return null;
  }

  const isTerminal =
    order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const earningsFormatted = `₹${(order.sellerTotalInPaise / 100).toLocaleString(
    "en-IN",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto custom-scrollbar p-6">
        <DialogHeader className="border-b border-border/40 pb-3">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base font-bold text-foreground">
              Order #{order.orderNumber}
            </DialogTitle>

            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-foreground">
              {order.orderStatus}
            </span>
          </div>

          <DialogDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>{orderDate}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Customer & Earnings Info */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-surface-soft/40 p-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {order.customer.profilePicture ? (
                <Image
                  src={order.customer.profilePicture}
                  alt={order.customer.name || "Customer"}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <User size={14} className="text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {order.customer.name || "Customer"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {order.customer.email || "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <span className="text-[11px] text-muted-foreground">Your Earnings</span>
            <div className="flex items-center font-bold text-accent text-sm">
              <IndianRupee size={13} />
              <span>{earningsFormatted.replace("₹", "")}</span>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Package size={13} />
            <span>Items ({order.sellerItemCount})</span>
          </div>

          <div className="max-h-36 divide-y divide-border/40 overflow-y-auto rounded-xl border border-border/40 bg-surface/30 p-2 custom-scrollbar">
            {order.items.map((item, idx) => {
              const key = item.itemId || item._id || item.bookListingId || `item-${idx}`;
              return (
                <div key={key} className="flex items-center justify-between py-1.5 text-xs first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate font-medium text-foreground">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₹{(item.subtotalInPaise / 100).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal state lock notification or Editable form */}
        {isTerminal ? (
          <div className="space-y-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock size={16} />
            </div>

            <div>
              <p className="text-xs font-bold text-foreground">Terminal Order State</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                This order is marked as <strong className="uppercase">{order.orderStatus}</strong> and can no longer be modified under business rules.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 w-full text-xs"
            >
              Close
            </Button>
          </div>
        ) : (
          <SellerOrderStatusForm
            order={order}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
