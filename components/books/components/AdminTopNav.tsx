"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  BookPlus,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { useCurrentUser } from "@/features/auth";

export type AdminTab =
  | "dashboard"
  | "orders"
  | "inventory"
  | "add-book"
  | "add-author"
  | "discounts"
  | "contents"
  | "category";

interface AdminTopNavProps {
  activeTab: AdminTab;
}

interface AdminNavItem {
  id: AdminTab;
  label: string;
  href: string;
  icon: LucideIcon;
}

const SELLER_NAV_ITEMS: readonly AdminNavItem[] = [
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
    id: "discounts",
    label: "Discounts",
    href: "/manage-discounts",
    icon: Tag,
  },
];

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "category",
    label: "Category",
    href: "/admin-categories",
    icon: FolderTree,
  },
  {
    id: "add-author",
    label: "Add Author",
    href: "/add-author",
    icon: UserPlus,
  },
  {
    id: "contents",
    label: "Contents",
    href: "/contents",
    icon: FileText,
  },
];

export function AdminTopNav({ activeTab }: AdminTopNavProps) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const activeTabStr: string = activeTab;

  const isAdminPath =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/contents") ||
    pathname.startsWith("/add-author") ||
    pathname.startsWith("/admin-categories") ||
    activeTabStr === "contents" ||
    activeTabStr === "add-author" ||
    activeTabStr === "category";

  const isSellerPath =
    pathname.startsWith("/seller-orders") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/add-book") ||
    pathname.startsWith("/manage-discounts");

  const isAdmin = user
    ? user.role === "ADMIN" || isAdminPath
    : isAdminPath || (!isSellerPath && (activeTabStr === "contents" || activeTabStr === "add-author" || activeTabStr === "category"));

  const navItems = isAdmin ? ADMIN_NAV_ITEMS : SELLER_NAV_ITEMS;

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3.5 shadow-sm sm:p-4 md:flex-row">
      {/* Brand */}
      <div className="flex shrink-0 items-center gap-3 md:min-w-[120px]">
        <Link
          href={isAdmin ? "/admin-dashboard" : "/dashboard"}
          title={isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
          aria-label={isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent text-white shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.96]"
        >
          <BookOpen size={20} aria-hidden="true" />
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="relative mx-auto flex items-center justify-center gap-1 overflow-x-auto rounded-xl border border-border bg-background p-1"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative z-10 inline-flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "font-semibold text-accent"
                  : "text-text-secondary hover:bg-surface hover:text-foreground hover:shadow-2xs"
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
                className={isActive ? "text-accent" : "opacity-75"}
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
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-text-secondary transition-all duration-200 hover:border-accent hover:bg-surface-soft hover:text-accent active:scale-[0.95]"
        >
          <Bell size={16} aria-hidden="true" />

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
