"use client";

import { useState } from "react";
import {
  Loader2,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateOrderStatusMutation } from "@/features/orders";
import type {
  AllowedUpdateOrderStatus,
  UpdateOrderStatusInput,
} from "@/features/orders/types/order.types";
import type { SellerRecentOrder } from "../types/seller.types";

interface SellerOrderStatusFormProps {
  order: SellerRecentOrder;
  onSuccess: () => void;
  onCancel: () => void;
}

const CANCEL_REASONS = [
  "Item out of stock",
  "Damaged inventory",
  "Customer cancellation request",
  "Pricing or listing error",
];

export function SellerOrderStatusForm({
  order,
  onSuccess,
  onCancel,
}: SellerOrderStatusFormProps) {
  const mutation = useUpdateOrderStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState<AllowedUpdateOrderStatus>(
    (order.orderStatus as AllowedUpdateOrderStatus) || "PROCESSING",
  );
  const [selectedItemId, setSelectedItemId] = useState<string>("ALL");
  const [message, setMessage] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdateOrderStatusInput = {
      status: selectedStatus,
      ...(selectedItemId !== "ALL" ? { itemId: selectedItemId } : {}),
      ...(selectedStatus === "CANCELLED"
        ? {
          cancellationReason: cancellationReason.trim() || undefined,
        }
        : {}),
      ...(message.trim() ? { message: message.trim() } : {}),
    };

    try {
      await mutation.mutateAsync({
        orderId: order.orderId,
        payload,
      });

      onSuccess();
    } catch {
      // Error handled in mutation hook via toast
    }
  };

  const isCancelled = selectedStatus === "CANCELLED";
  const isPending = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Target Scope Dropdown */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Target Scope</Label>

        <Select
          value={selectedItemId}
          onValueChange={setSelectedItemId}
          disabled={isPending}
        >
          <SelectTrigger
            aria-label="Target Scope"
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-soft focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <div className="flex items-center gap-2 truncate">
              <Layers size={13} className="text-accent shrink-0" />
              <SelectValue placeholder="Select target scope" />
            </div>
          </SelectTrigger>

          <SelectContent
            position="popper"
            className="max-h-60 w-[var(--radix-select-trigger-width)] rounded-xl border border-border bg-surface p-1 shadow-xl custom-scrollbar z-50"
          >
            <SelectItem
              value="ALL"
              className="cursor-pointer rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors hover:bg-surface-soft hover:text-foreground focus:bg-accent/10 focus:text-accent"
            >
              Entire Order ({order.items.length} {order.items.length === 1 ? "item" : "items"})
            </SelectItem>

            {order.items.map((item, idx) => {
              const id = item.itemId || item._id || item.bookListingId || `item-${idx}`;

              return (
                <SelectItem
                  key={id}
                  value={id}
                  className="cursor-pointer rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-surface-soft hover:text-foreground focus:bg-accent/10 focus:text-accent"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="ml-1 text-[11px] text-muted-foreground">
                    (Qty: {item.quantity})
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Status Buttons Grid */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Update Status To</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(
            [
              { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
              { status: "PROCESSING", label: "Processing", icon: Clock, color: "text-sky-600 dark:text-sky-400" },
              { status: "SHIPPED", label: "Shipped", icon: Truck, color: "text-indigo-600 dark:text-indigo-400" },
              { status: "DELIVERED", label: "Delivered", icon: PackageCheck, color: "text-emerald-700 dark:text-emerald-300" },
              { status: "CANCELLED", label: "Cancelled", icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400" },
            ] as const
          ).map((item) => {
            const isSelected = selectedStatus === item.status;
            const Icon = item.icon;

            return (
              <button
                key={item.status}
                type="button"
                onClick={() => setSelectedStatus(item.status)}
                disabled={isPending}
                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${isSelected
                    ? "border-accent bg-accent/10 text-accent ring-1 ring-accent"
                    : "border-border bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
              >
                <Icon size={14} className={isSelected ? "text-accent" : item.color} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cancelled fields */}
      {isCancelled && (
        <div className="space-y-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Cancellation Reason
            </h4>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Inventory stock will be restored automatically upon cancellation.
          </p>

          <Input
            placeholder="Reason for cancellation..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            disabled={isPending}
            className="h-9 text-xs"
          />

          <div className="flex flex-wrap gap-1">
            {CANCEL_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setCancellationReason(r)}
                className="rounded-full border border-border/60 bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition hover:border-rose-400 hover:text-foreground"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Note / Message */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Customer Message (Optional)</Label>
        <Textarea
          placeholder="e.g. Package prepared for pickup..."
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="resize-none text-xs"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="h-9 text-xs"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="h-9 gap-1.5 bg-accent text-xs font-medium text-accent-foreground hover:bg-accent/90"
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
          <span>{isPending ? "Updating..." : "Update Status"}</span>
        </Button>
      </div>
    </form>
  );
}
