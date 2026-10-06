// Admin Dashboard page with dynamic time-based greeting, Total Earnings analytics, and Recent Orders feed
"use client";

import React, { useMemo } from "react";
import { Calendar } from "lucide-react";
import AdminTopNav from "../books/components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { Footer, Navbar } from "../home/components";
import { useCurrentUser } from "@/features/auth";
import {
  OrderHealthCard,
  TopSellersCard,
  TopSellingBooksCard,
  TotalEarningsCard,
  useSellerOrderHealth,
} from "@/features/seller";

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getFormattedDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function AdminDashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: healthData } = useSellerOrderHealth();

  const greeting = useMemo(() => getTimeBasedGreeting(), []);
  const formattedDate = useMemo(() => getFormattedDate(), []);

  const health = healthData?.data;

  const userName = user?.name || user?.email?.split("@")[0] || "Admin";
  const displayName = userName.split(" ")[0];

  const dynamicSubtitle = useMemo(() => {
    if (health?.totalOrders) {
      return `Monitoring ${health.totalOrders.toLocaleString("en-IN")} platform orders with ${health.delivered.percentage}% delivered and ${health.cancellationTrend.formatted}.`;
    }
    return "Here is what's happening across the platform today.";
  }, [health]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="dashboard" />

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {greeting}, {displayName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {dynamicSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-2xs transition-all duration-150 hover:border-foreground/20 hover:bg-surface-soft hover:text-foreground active:scale-[0.98]">
                <Calendar size={14} className="text-accent shrink-0" aria-hidden="true" />
                <span className="font-semibold text-foreground">{formattedDate}</span>
              </div>

              {/* <div className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 transition-all duration-150 hover:bg-emerald-500/15 active:scale-[0.98] dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Platform Live</span>
              </div> */}
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-8">
              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                <TotalEarningsCard className="md:col-span-7" />

                <OrderHealthCard className="md:col-span-5" />
              </div>

              <TopSellingBooksCard />
            </div>

            <div className="flex flex-col gap-5 lg:col-span-4">
              <TopSellersCard className="h-full" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}




