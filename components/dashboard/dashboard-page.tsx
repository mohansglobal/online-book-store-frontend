// Seller Admin Dashboard page with dynamic time-based greeting and authenticated user profile
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminTopNav from "../books/components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { Footer, Navbar } from "../home/components";
import { useCurrentUser } from "@/features/auth";
import {
  RecentOrdersFeed,
  RevenueAnalyticsCard,
  DailyOrdersAnalyticsCard,
  GenreBreakdownCard,
  TopAuthorsCard,
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

export default function AdminDashboardPage() {
  const { data: user } = useCurrentUser();

  const greeting = useMemo(() => getTimeBasedGreeting(), []);

  const userName = user?.name || user?.email?.split("@")[0] || "Seller";

  const displayName = userName.split(" ")[0];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <Navbar wish={0} />

      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <AdminTopNav activeTab="dashboard" />

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {greeting}, {displayName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {user?.role === "ADMIN"
                  ? "Here is what's happening across the platform today."
                  : "Here is what's happening with your store today."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/add-book"
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white shadow-xs transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
              >
                <Plus size={16} aria-hidden="true" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
            {/* Left Content */}
            <div className="flex flex-col space-y-5 lg:col-span-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                <RevenueAnalyticsCard />

                <DailyOrdersAnalyticsCard />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                <GenreBreakdownCard />

                <TopAuthorsCard />
              </div>
            </div>

            {/* Recent Orders */}
            <RecentOrdersFeed />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}