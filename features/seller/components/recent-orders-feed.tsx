"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, RefreshCw, PackageCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropshippingImg from "@/assets/Dropshipping.png";
import { useSellerRecentOrders } from "../queries/use-seller-recent-orders";
import { RecentOrderRow } from "./recent-order-row";
import { RecentOrdersSkeleton } from "./recent-orders-skeleton";

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

export function RecentOrdersFeed() {
  const currentMonthNum = String(new Date().getMonth() + 1).padStart(2, "0");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthNum);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const queryMonth = `${currentYear}-${selectedMonth}`;

  const { data, isLoading, isError, refetch } = useSellerRecentOrders({
    month: queryMonth,
    limit: 8,
  });

  const recentOrders = data?.data?.recentOrders ?? [];
  const selectedOption = MONTH_OPTIONS.find((m) => m.value === selectedMonth);
  const selectedMonthLabel = selectedOption
    ? `${selectedOption.label} ${currentYear}`
    : queryMonth;

  return (
    <aside className="flex h-full flex-col lg:col-span-4">
      <div className="relative overflow-hidden flex h-full flex-1 flex-col justify-between rounded-3xl border border-border/40 bg-background p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        {/* Background Rotated Watermark Icon */}
        <PackageCheck
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
        />

        <div className="relative z-10 flex flex-col justify-between flex-1 h-full">

          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Recent Orders
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Live fulfillment feed
              </p>
            </div>


            <DropdownMenu
              open={isMonthDropdownOpen}
              onOpenChange={setIsMonthDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Select month"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-soft/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span>{selectedOption?.label ?? "Month"}</span>

                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${isMonthDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="max-h-60 w-36 overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-lg custom-scrollbar z-50"
              >
                {MONTH_OPTIONS.map((item) => {
                  const isSelected = selectedMonth === item.value;

                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => {
                        setSelectedMonth(item.value);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-xs transition-colors ${isSelected
                        ? "bg-accent/10 font-bold text-accent"
                        : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                        }`}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          <div className="flex flex-1 flex-col min-h-0">
            {isLoading && <RecentOrdersSkeleton />}

            {isError && (
              <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-rose-500">Failed to load recent orders</p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  Retry
                </button>
              </div>
            )}

            {!isLoading && !isError && recentOrders.length > 0 && (
              <div className="mt-1 flex-1 min-h-0 divide-y divide-border/40 overflow-y-auto custom-scrollbar pr-1">
                {recentOrders.map((order) => (
                  <RecentOrderRow key={order.orderId} order={order} />
                ))}
              </div>
            )}

            {!isLoading && !isError && recentOrders.length === 0 && (
              <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
                <div className="relative mb-3 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-accent/5 blur-xl"
                  />
                  <Image
                    src={DropshippingImg}
                    alt="No orders found"
                    width={300}
                    height={300}
                    className="pointer-events-none mx-auto h-auto select-none object-contain"
                    priority
                  />
                </div>

                <p className="text-lg font-semibold text-foreground">No recent orders</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  No orders found for {selectedMonthLabel}.
                </p>
              </div>
            )}
          </div>


          <div className="mt-4 border-t border-border/40 pt-4">
            <Link
              href="/inventory"
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98]"
            >
              <span>View All Orders</span>
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
