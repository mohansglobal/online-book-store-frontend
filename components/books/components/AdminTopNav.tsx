"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Bell,
    BookOpen,
    BookPlus,
    LayoutDashboard,
    Package,
    ShoppingBag,
    Tag,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

export type AdminTab =
    | "dashboard"
    | "orders"
    | "inventory"
    | "add-book"
    | "add-author"
    | "discounts";

interface AdminTopNavProps {
    activeTab: AdminTab;
}

interface AdminNavItem {
    id: AdminTab;
    label: string;
    href: string;
    icon: LucideIcon;
}

const NAV_ITEMS: readonly AdminNavItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        id: "orders",
        label: "Orders",
        href: "/seller-orders",
        icon: ShoppingBag,
    },
    {
        id: "inventory",
        label: "Inventory",
        href: "/inventory",
        icon: Package,
    },
    {
        id: "add-book",
        label: "Add Book",
        href: "/add-book",
        icon: BookPlus,
    },
    {
        id: "add-author",
        label: "Add Author",
        href: "/add-author",
        icon: UserPlus,
    },
    {
        id: "discounts",
        label: "Discounts",
        href: "/manage-discounts",
        icon: Tag,
    },
];

export function AdminTopNav({
    activeTab,
}: AdminTopNavProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3.5 shadow-sm sm:p-4 md:flex-row">
            {/* Brand */}
            <div className="flex shrink-0 items-center gap-3 md:min-w-[120px]">
                <Link
                    href="/dashboard"
                    title="Admin Dashboard"
                    aria-label="Admin Dashboard"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent text-white shadow-sm transition-colors hover:bg-accent-hover"
                >
                    <BookOpen
                        size={20}
                        aria-hidden="true"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav
                aria-label="Admin navigation"
                className="relative mx-auto flex items-center justify-center gap-1 overflow-x-auto rounded-xl border border-border bg-background p-1"
            >
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        activeTab === item.id;

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-current={
                                isActive ? "page" : undefined
                            }
                            className={`relative z-10 inline-flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${isActive
                                ? "font-semibold text-accent"
                                : "text-text-secondary hover:bg-surface/30 hover:text-foreground"
                                }`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="adminNavActiveTabIndicator"
                                    className="absolute inset-0 -z-10 rounded-lg border border-border/60 bg-surface shadow-sm"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 32,
                                    }}
                                />
                            )}

                            <Icon
                                size={15}
                                aria-hidden="true"
                                className={
                                    isActive
                                        ? "text-accent"
                                        : "opacity-75"
                                }
                            />

                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Admin Actions */}
            <div className="flex shrink-0 items-center justify-end gap-3 md:min-w-[120px]">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition-all hover:border-accent hover:text-accent"
                >
                    <Bell
                        size={16}
                        aria-hidden="true"
                    />

                    <span
                        aria-hidden="true"
                        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500"
                    />
                </button>
            </div>
        </div>
    );
}

export default AdminTopNav;


