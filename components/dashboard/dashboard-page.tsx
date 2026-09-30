"use client";

import Link from "next/link";

import {
    Calendar,
    Plus,
    SlidersHorizontal,
} from "lucide-react";

import AdminTopNav from "../books/components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { Footer, Navbar } from "../home/components";
import {
    RecentOrdersFeed,
    RevenueAnalyticsCard,
    DailyOrdersAnalyticsCard,
    GenreBreakdownCard,
    TopAuthorsCard,
} from "@/features/seller";


export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">

            <Navbar wish={0} />

            <CategoryBanner
                categoryName=""
                compact
            />

            <main className="relative z-20 -mt-8 flex-1 px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <AdminTopNav activeTab="dashboard" />

                    {/* Page Header */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                                Good morning, Mohan
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Here is what&apos;s happening with
                                your store today.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* <button
                                type="button"
                                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-background active:scale-[0.98]"
                            >
                                <SlidersHorizontal
                                    size={15}
                                    aria-hidden="true"
                                />

                                Customize
                            </button> */}

                            {/* <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground">
                                <Calendar
                                    size={15}
                                    aria-hidden="true"
                                    className="text-accent"
                                />

                                <span>{TIME_RANGE}</span>
                            </div> */}

                            <Link
                                href="/add-book"
                                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
                            >
                                <Plus
                                    size={16}
                                    aria-hidden="true"
                                />

                                Add Product
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard */}
                    <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                        {/* Left Content */}
                        <div className="flex flex-col space-y-5 lg:col-span-8">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                                {/* Revenue */}
                                <RevenueAnalyticsCard />


                                {/* Weekly Orders & 7-Day Growth */}
                                <DailyOrdersAnalyticsCard />
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                                {/* Genre Breakdown */}
                                <GenreBreakdownCard />


                                {/* Top Authors */}
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
