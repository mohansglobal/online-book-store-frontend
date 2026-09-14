"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { useOrderDetailQuery } from "../queries/use-order-detail-query";
import { OrderDetailsHeader } from "./order-details-header";
import { OrderTrackingProgress } from "./order-tracking-progress";
import { OrderAddressPayment } from "./order-address-payment";

interface OrderDetailsViewProps {
  orderId: string;
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { data: response, isLoading, isError } = useOrderDetailQuery(orderId);
  const order = response?.data;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      {/* 3D Carousel Category Banner */}
      <CategoryBanner categoryName="Order Details" compact />

      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Top Back Navigation */}
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} /> Back to My Orders
            </Link>
          </div>


          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="h-44 w-full animate-pulse rounded-2xl border border-border/70 bg-surface/60" />
              <div className="h-48 w-full animate-pulse rounded-2xl border border-border/70 bg-surface/60" />
            </div>
          )}

          {/* Error / Not Found State */}
          {!isLoading && (isError || !order) && (
            <div className="rounded-2xl border border-destructive/20 bg-surface/90 p-8 text-center shadow-xs">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle size={28} />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Order Not Found
              </h2>
              <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                We couldn&apos;t retrieve the details for order #{orderId}.
              </p>
              <div className="mt-5">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-accent-hover"
                >
                  <ArrowLeft size={14} /> Back to Orders
                </Link>
              </div>
            </div>
          )}

          {/* Order Details Content */}
          {!isLoading && !isError && order && (
            <div className="space-y-4">
              {/* Header and Tracking in the Same Row */}
              <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                  {/* Left: Order Info & Actions */}
                  <div className="min-w-0 flex-1">
                    <OrderDetailsHeader order={order} />
                  </div>

                  {/* Vertical separator on large screens */}
                  <div className="hidden lg:block h-14 w-px bg-border shrink-0" />

                  {/* Right: Tracking Progress Stepper */}
                  <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 pt-2 lg:pt-0 border-t border-border lg:border-t-0">
                    <OrderTrackingProgress orderStatus={order.orderStatus} />
                  </div>
                </div>
              </div>

              {/* Address & Payment Grid */}
              <OrderAddressPayment order={order} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
