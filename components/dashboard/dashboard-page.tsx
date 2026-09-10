"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import {
    Calendar,
    ChevronDown,
    ChevronRight,
    Clock,
    Plus,
    SlidersHorizontal,
    TrendingUp,
} from "lucide-react";

import AdminTopNav from "../books/components/AdminTopNav";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import {
    Footer,
    Navbar,
} from "../home/components";

import author1 from "../../assets/author-1.jpg";
import author2 from "../../assets/author-2.jpg";

type RevenueTimeframe =
    | "Weekly"
    | "Monthly"
    | "Yearly";

type OrderStatus =
    | "waiting"
    | "done"
    | "failed";

interface TopAuthor {
    id: number;
    name: string;
    shortName: string;
    image: ImageProps["src"];
    sold: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    avatar: string;
    book: string;
    amount: string;
    time: string;
    status: OrderStatus;
    statusLabel: string;
}

interface WeeklyOrderData {
    day: string;
    orders: number;
}

const TIME_RANGE = "18 - 24 Sep";

const REVENUE_TIMEFRAMES: readonly RevenueTimeframe[] = [
    "Weekly",
    "Monthly",
    "Yearly",
];

const TOP_AUTHORS: readonly TopAuthor[] = [
    {
        id: 1,
        name: "Rabindranath Tagore",
        shortName: "R. Tagore",
        image: author1,
        sold: 624,
    },
    {
        id: 2,
        name: "Humayun Ahmed",
        shortName: "H. Ahmed",
        image: author2,
        sold: 518,
    },
    {
        id: 3,
        name: "Satyajit Ray",
        shortName: "Satyajit Ray",
        image:
            "https://m.media-amazon.com/images/M/MV5BNTAyOTRkY2YtZWM4NS00Yzk1LWFhZjAtYzIxZjY5NDNmZGU2XkEyXkFqcGc@._V1_.jpg",
        sold: 482,
    },
    {
        id: 4,
        name: "Arundhati Roy",
        shortName: "Arundhati Roy",
        image:
            "https://cdn.britannica.com/96/167696-050-22B2A133/Arundhati-Roy.jpg",
        sold: 395,
    },
    {
        id: 5,
        name: "R. K. Narayan",
        shortName: "R. K. Narayan",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsS5CDp911FarOEtnSk-IaPY2T-U2LEsxOMb2yz7j96UCoiHxuG7Od1uUF&s=10",
        sold: 340,
    },
];

const RECENT_ORDERS: readonly RecentOrder[] = [
    {
        id: "ORDd-9481",
        customer: "Syafanah San",
        avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        book: "Mastisker Malikana",
        amount: "₹1,450.00",
        time: "Today, 10:45 AM",
        status: "waiting",
        statusLabel: "Waiting",
    },
    {
        id: "ORD-9480",
        customer: "Devon Lane",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        book: "Khoabnama Special Edition",
        amount: "₹2,540.00",
        time: "Today, 09:15 AM",
        status: "done",
        statusLabel: "Done",
    },
    {
        id: "ORD-9479",
        customer: "Marvin McKinney",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        book: "A Fine Balance",
        amount: "₹890.00",
        time: "Yesterday",
        status: "done",
        statusLabel: "Done",
    },
    {
        id: "ORD-9478",
        customer: "Devon Lane",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        book: "The Palace of Illusions",
        amount: "₹1,120.00",
        time: "Yesterday",
        status: "done",
        statusLabel: "Done",
    },
    {
        id: "ORD-9477",
        customer: "Eleanor Pena",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        book: "Midnight's Children (Hardcover)",
        amount: "₹2,540.00",
        time: "2 days ago",
        status: "failed",
        statusLabel: "Failed",
    },
    {
        id: "ORD-9476",
        customer: "Wade Warren",
        avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80",
        book: "The God of Small Things",
        amount: "₹1,150.00",
        time: "2 days ago",
        status: "done",
        statusLabel: "Done",
    },
];

const WEEKLY_DATA: readonly WeeklyOrderData[] = [
    { day: "Mon", orders: 32 },
    { day: "Tue", orders: 45 },
    { day: "Wed", orders: 28 },
    { day: "Thu", orders: 62 },
    { day: "Fri", orders: 55 },
    { day: "Sat", orders: 85 },
    { day: "Sun", orders: 40 },
];

const MAX_ORDERS = Math.max(
    ...WEEKLY_DATA.map((item) => item.orders),
);

function getOrderStatusClasses(
    status: OrderStatus,
): string {
    if (status === "done") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
    }

    if (status === "waiting") {
        return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
    }

    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400";
}

export default function AdminDashboardPage() {
    const [
        revenueTimeframe,
        setRevenueTimeframe,
    ] =
        useState<RevenueTimeframe>(
            "Yearly",
        );

    const [
        isTimeframeOpen,
        setIsTimeframeOpen,
    ] = useState(false);

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
                            <button
                                type="button"
                                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-background active:scale-[0.98]"
                            >
                                <SlidersHorizontal
                                    size={15}
                                    aria-hidden="true"
                                />

                                Customize
                            </button>

                            <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-foreground">
                                <Calendar
                                    size={15}
                                    aria-hidden="true"
                                    className="text-accent"
                                />

                                <span>{TIME_RANGE}</span>
                            </div>

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
                                <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                Revenue
                                            </p>

                                            <h2 className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-[17px]">
                                                Money Analytics
                                            </h2>
                                        </div>

                                        {/* Timeframe Dropdown */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsTimeframeOpen(
                                                        (current) =>
                                                            !current,
                                                    )
                                                }
                                                aria-haspopup="menu"
                                                aria-expanded={
                                                    isTimeframeOpen
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-surface-soft/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-soft hover:text-foreground"
                                            >
                                                {revenueTimeframe}

                                                <ChevronDown
                                                    size={13}
                                                    aria-hidden="true"
                                                    className={`transition-transform duration-200 ${isTimeframeOpen
                                                        ? "rotate-180"
                                                        : ""
                                                        }`}
                                                />
                                            </button>

                                            {isTimeframeOpen && (
                                                <div
                                                    role="menu"
                                                    className="animate-in absolute top-full right-0 z-30 mt-2 w-28 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg fade-in zoom-in-95"
                                                >
                                                    {REVENUE_TIMEFRAMES.map(
                                                        (item) => (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                role="menuitem"
                                                                onClick={() => {
                                                                    setRevenueTimeframe(
                                                                        item,
                                                                    );

                                                                    setIsTimeframeOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                                className={`block w-full cursor-pointer px-3.5 py-2 text-left text-xs transition-colors ${revenueTimeframe ===
                                                                    item
                                                                    ? "bg-accent/10 font-bold text-accent"
                                                                    : "text-text-secondary hover:bg-surface-soft hover:text-foreground"
                                                                    }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Main Revenue */}
                                    <div className="mt-5 flex items-end justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-3xl leading-none font-bold tracking-tight text-foreground tabular-nums sm:text-[34px]">
                                                    ₹1,84,620
                                                </span>

                                                <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                    +12.8%
                                                </span>
                                            </div>

                                            <p className="mt-1.5 text-xs text-muted-foreground">
                                                ₹20,940 more than last month
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                Today
                                            </p>

                                            <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
                                                ₹8,420
                                            </p>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border py-3.5">
                                        <div className="pr-3.5">
                                            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                Net Revenue
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                                                ₹1.62L
                                            </p>
                                        </div>

                                        <div className="px-3.5">
                                            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                Avg. Order
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                                                ₹742
                                            </p>
                                        </div>

                                        <div className="pl-3.5">
                                            <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                Orders
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-foreground tabular-nums sm:text-[15px]">
                                                249
                                            </p>
                                        </div>
                                    </div>

                                    {/* Revenue Chart */}
                                    <div className="mt-5 pt-1">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-foreground">
                                                    Revenue trend
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                    Last 7 days
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs font-bold text-foreground">
                                                    ₹48,620
                                                </p>

                                                <p className="text-[9px] font-semibold text-emerald-600">
                                                    +12.4%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative h-[82px] w-full">
                                            <svg
                                                viewBox="0 0 420 80"
                                                preserveAspectRatio="none"
                                                className="h-full w-full overflow-visible"
                                                aria-hidden="true"
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="revenueArea"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="var(--color-accent)"
                                                            stopOpacity="0.22"
                                                        />

                                                        <stop
                                                            offset="100%"
                                                            stopColor="var(--color-accent)"
                                                            stopOpacity="0"
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <path
                                                    d="
                            M 0 62
                            C 30 58, 50 65, 70 55
                            S 110 35, 140 43
                            S 180 58, 210 32
                            S 250 18, 280 29
                            S 325 50, 350 35
                            S 390 20, 420 24
                            L 420 80
                            L 0 80 Z
                          "
                                                    fill="url(#revenueArea)"
                                                />

                                                <path
                                                    d="
                            M 0 62
                            C 30 58, 50 65, 70 55
                            S 110 35, 140 43
                            S 180 58, 210 32
                            S 250 18, 280 29
                            S 325 50, 350 35
                            S 390 20, 420 24
                          "
                                                    fill="none"
                                                    stroke="var(--color-accent)"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                />

                                                <circle
                                                    cx="280"
                                                    cy="29"
                                                    r="4"
                                                    fill="var(--color-accent)"
                                                    stroke="var(--color-surface)"
                                                    strokeWidth="3"
                                                />
                                            </svg>
                                        </div>

                                        <div className="mt-1 flex justify-between text-[9px] font-medium text-muted-foreground">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Weekly Orders */}
                                <section className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-7">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                                    <Clock
                                                        size={18}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <span className="font-display text-3xl font-bold text-foreground">
                                                    46.5
                                                </span>

                                                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <TrendingUp
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                    +14.5%
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Average daily orders & book
                                                shipments
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 flex-col items-end rounded-xl border border-emerald-900 bg-emerald-950 p-2.5 text-emerald-50 sm:p-3">
                                            <span className="mb-0.5 text-[10px] font-semibold tracking-wide text-emerald-400 uppercase">
                                                Growth
                                            </span>

                                            <span className="text-lg leading-none font-bold tracking-tight">
                                                151%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between rounded-xl border border-border bg-background p-4">
                                        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">
                                                    Orders This Week
                                                </span>

                                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Peak: Sat (85)
                                                </span>
                                            </div>

                                            <span className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-xs font-normal text-text-secondary">
                                                Last 7 Days
                                            </span>
                                        </div>

                                        <div className="grid flex-1 grid-cols-7 items-end gap-1.5 pt-3 pb-1 sm:gap-3">
                                            {WEEKLY_DATA.map(
                                                (data) => {
                                                    const percentage =
                                                        Math.max(
                                                            12,
                                                            Math.round(
                                                                (data.orders /
                                                                    MAX_ORDERS) *
                                                                100,
                                                            ),
                                                        );

                                                    const isPeak =
                                                        data.orders ===
                                                        MAX_ORDERS;

                                                    return (
                                                        <div
                                                            key={data.day}
                                                            className="group flex h-full flex-col items-center justify-end"
                                                        >
                                                            <span
                                                                className={`mb-1.5 font-sans text-[11px] font-semibold tabular-nums transition-colors duration-200 ${isPeak
                                                                    ? "font-bold text-accent"
                                                                    : "text-muted-foreground group-hover:text-foreground"
                                                                    }`}
                                                            >
                                                                {
                                                                    data.orders
                                                                }
                                                            </span>

                                                            <div className="flex h-36 w-full max-w-[3.25rem] items-end justify-center overflow-hidden rounded-lg border border-transparent bg-surface-soft p-0.5 transition-colors duration-200 group-hover:border-border sm:h-40">
                                                                <div
                                                                    className={`w-full rounded-md transition-all duration-300 ${isPeak
                                                                        ? "bg-accent shadow-xs"
                                                                        : "bg-accent/45 group-hover:bg-accent/75"
                                                                        }`}
                                                                    style={{
                                                                        height: `${percentage}%`,
                                                                    }}
                                                                />
                                                            </div>

                                                            <span
                                                                className={`mt-2 text-xs font-medium transition-colors duration-200 ${isPeak
                                                                    ? "font-bold text-accent"
                                                                    : "text-muted-foreground group-hover:text-foreground"
                                                                    }`}
                                                            >
                                                                {data.day}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
                                {/* Genre Breakdown */}
                                <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-4">
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                Genre Breakdown
                                            </span>

                                            <ChevronRight
                                                size={16}
                                                aria-hidden="true"
                                                className="text-muted-foreground"
                                            />
                                        </div>

                                        <div className="relative mx-auto mt-2 flex h-24 w-40 items-end justify-center">
                                            <svg
                                                viewBox="0 0 100 50"
                                                className="h-full w-full overflow-visible"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M 10 50 A 40 40 0 0 1 90 50"
                                                    fill="none"
                                                    stroke="var(--color-background)"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M 10 50 A 40 40 0 0 1 45 12"
                                                    fill="none"
                                                    stroke="var(--color-accent)"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M 48 11 A 40 40 0 0 1 80 25"
                                                    fill="none"
                                                    stroke="#10b981"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M 82 28 A 40 40 0 0 1 90 50"
                                                    fill="none"
                                                    stroke="#6366f1"
                                                    strokeWidth="12"
                                                    strokeLinecap="round"
                                                />
                                            </svg>

                                            <div className="absolute bottom-0 text-center">
                                                <span className="font-display text-2xl font-bold text-foreground">
                                                    1,420
                                                </span>

                                                <span className="mt-0.5 block text-xs tracking-wide text-muted-foreground uppercase">
                                                    Books Sold
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-2.5 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-text-secondary">
                                                    <span className="h-2 w-2 rounded-full bg-accent" />
                                                    Fiction Novels
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    580
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-text-secondary">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    Academic
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    410
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-text-secondary">
                                                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                                    Poetry & Classic
                                                </span>

                                                <span className="font-semibold text-foreground">
                                                    430
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Top Authors */}
                                <section className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm md:col-span-8">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                                    Top Author Volume
                                                </span>

                                                <h2 className="mt-0.5 text-base font-semibold text-foreground">
                                                    Top 5 Authors by Sales
                                                </h2>
                                            </div>

                                            <Link
                                                href="/authors"
                                                title="View All Authors"
                                                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent hover:underline"
                                            >
                                                View all

                                                <ChevronRight
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </div>

                                        <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                            {TOP_AUTHORS.map(
                                                (author, index) => (
                                                    <div
                                                        key={author.id}
                                                        className="group flex cursor-pointer flex-col items-center rounded-xl border border-border bg-background/50 p-3 text-center transition-all duration-200 hover:border-accent/50 hover:bg-background"
                                                    >
                                                        <div className="relative mb-2.5">
                                                            <div
                                                                className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition-transform duration-200 group-hover:scale-105 ${index === 0
                                                                    ? "border-accent shadow-xs"
                                                                    : "border-border"
                                                                    }`}
                                                            >
                                                                <Image
                                                                    src={
                                                                        author.image
                                                                    }
                                                                    alt={
                                                                        author.name
                                                                    }
                                                                    fill
                                                                    sizes="56px"
                                                                    className="object-cover"
                                                                />
                                                            </div>

                                                            <span
                                                                className={`absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${index === 0
                                                                    ? "bg-accent text-white shadow-xs"
                                                                    : "border border-border bg-surface text-foreground"
                                                                    }`}
                                                            >
                                                                {index + 1}
                                                            </span>
                                                        </div>

                                                        <span
                                                            title={author.name}
                                                            className="block max-w-full truncate text-xs font-semibold text-foreground"
                                                        >
                                                            {
                                                                author.shortName
                                                            }
                                                        </span>

                                                        <span className="mt-1 text-[11px] font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                                                            {author.sold} sold
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                                        <span>
                                            Active Authors in Catalog:{" "}
                                            <strong className="font-semibold text-foreground">
                                                48
                                            </strong>
                                        </span>

                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                            2,359 Total Copies Sold
                                        </span>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <aside className="flex h-full flex-col lg:col-span-4">
                            <div className="flex h-full flex-1 flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <div>
                                            <h2 className="text-base font-semibold text-foreground">
                                                Recent Orders
                                            </h2>

                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                Live fulfillment feed
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-text-secondary">
                                            September
                                        </span>
                                    </div>

                                    <div className="mt-1 divide-y divide-border">
                                        {RECENT_ORDERS.map(
                                            (order) => (
                                                <div
                                                    key={order.id}
                                                    className="group -mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl px-2 py-3.5 transition-colors duration-200 hover:bg-background"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                                                            <Image
                                                                src={
                                                                    order.avatar
                                                                }
                                                                alt={
                                                                    order.customer
                                                                }
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-foreground">
                                                                {
                                                                    order.customer
                                                                }
                                                            </h3>

                                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                                {
                                                                    order.book
                                                                }
                                                            </p>

                                                            <span className="mt-1 block text-xs font-medium text-text-secondary">
                                                                {
                                                                    order.amount
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end text-right">
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${getOrderStatusClasses(
                                                                order.status,
                                                            )}`}
                                                        >
                                                            {
                                                                order.statusLabel
                                                            }
                                                        </span>

                                                        <div className="mt-1.5 text-xs text-muted-foreground">
                                                            {order.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-border pt-5">
                                    <Link
                                        href="/checkout"
                                        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.98]"
                                    >
                                        View All Transactions

                                        <ChevronRight
                                            size={15}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}