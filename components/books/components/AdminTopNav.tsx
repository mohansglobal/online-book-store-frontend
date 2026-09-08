"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Bell,
    BookOpen,
    BookPlus,
    Home,
    LayoutDashboard,
    LogOut,
    Package,
    Tag,
    type LucideIcon,
} from "lucide-react";
import { useCurrentUser, useLogoutModalStore } from "@/features/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AdminTab =
    | "dashboard"
    | "inventory"
    | "add-book"
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
        id: "discounts",
        label: "Discounts",
        href: "/manage-discounts",
        icon: Tag,
    },
];

export function AdminTopNav({
    activeTab,
}: AdminTopNavProps) {
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const openLogoutModal = useLogoutModalStore((state) => state.open);

    const userAvatar = user?.profilePicture || user?.avatar;

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

                <div className="hidden h-6 w-px bg-border sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="Open admin profile"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {userAvatar ? (
                                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                    <Image
                                        src={userAvatar}
                                        alt={user?.name || "Admin profile"}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
                                    {user?.name?.charAt(0).toUpperCase() || "A"}
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-64 rounded-xl p-1.5 shadow-lg"
                    >
                        <DropdownMenuLabel className="p-3 font-normal">
                            <div className="flex items-center gap-3">
                                {userAvatar ? (
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                                        <Image
                                            src={userAvatar}
                                            alt={user?.name || "Admin profile"}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                                        {user?.name?.charAt(0).toUpperCase() || "A"}
                                    </div>
                                )}
                                <div className="flex flex-col space-y-0.5 overflow-hidden">
                                    <p className="text-sm font-semibold leading-none truncate">{user?.name || "Admin User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || "seller@indobangla.com"}</p>
                                    <span className="mt-1 w-fit rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent uppercase">
                                        {user?.role || "SELLER"}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push("/")} className="h-9 cursor-pointer rounded-lg px-2.5">
                            <Home className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            <span>Storefront Home</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openLogoutModal()}
                            className="h-9 cursor-pointer rounded-lg px-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                            <LogOut className="mr-2.5 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default AdminTopNav;


