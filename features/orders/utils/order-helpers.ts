import type {
  OrderStatus,
  OrderItem,
  OrderTabFilter,
  DateRangeFilterOption,
  Order,
} from "../types/order.types";

export function formatOrderDate(dateString?: string): string {
  if (!dateString) return "Recent";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
}

export function formatOrderPrice(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹ ${rupees.toLocaleString("en-IN")}`;
}

export function getOrderStatusGroup(status: OrderStatus): "IN_PROGRESS" | "DELIVERED" | "CANCELLED" {
  if (status === "DELIVERED") return "DELIVERED";
  if (status === "CANCELLED") return "CANCELLED";
  return "IN_PROGRESS";
}

export function toTitleCase(str?: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function matchesTabFilter(orderStatus: OrderStatus, tab: OrderTabFilter): boolean {
  if (tab === "ALL") return true;
  const group = getOrderStatusGroup(orderStatus);
  return group === tab;
}

export interface StatusBadgeConfig {
  label: string;
  dotBg: string;
  pillClass: string;
}

export function getStatusBadgeConfig(status: OrderStatus | string): StatusBadgeConfig {
  const upper = (status || "").toUpperCase();
  const label = toTitleCase(status);

  switch (upper) {
    case "DELIVERED":
      return {
        label: "Delivered",
        dotBg: "bg-emerald-500",
        pillClass:
          "bg-emerald-50 text-emerald-800 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        dotBg: "bg-rose-500",
        pillClass:
          "bg-rose-50 text-rose-800 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        dotBg: "bg-blue-500",
        pillClass:
          "bg-blue-50 text-blue-800 border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        dotBg: "bg-indigo-500",
        pillClass:
          "bg-indigo-50 text-indigo-800 border-indigo-200/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        dotBg: "bg-teal-500",
        pillClass:
          "bg-teal-50 text-teal-800 border-teal-200/70 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
      };
    case "PENDING":
      return {
        label: "Pending",
        dotBg: "bg-amber-500",
        pillClass:
          "bg-amber-50 text-amber-800 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
      };
    default:
      return {
        label,
        dotBg: "bg-amber-500",
        pillClass:
          "bg-amber-50 text-amber-800 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
      };
  }
}

export interface ItemSummaryResult {
  mainTitles: string[];
  extraCount: number;
}

export function formatItemsSummary(items: OrderItem[] = [], maxDisplay = 3): ItemSummaryResult {
  if (!items || items.length === 0) {
    return { mainTitles: ["Book Order"], extraCount: 0 };
  }

  const titles = items.map((it) => it.title || "Book").filter(Boolean);
  const displayed = titles.slice(0, maxDisplay);
  const extraCount = Math.max(0, items.length - maxDisplay);

  return {
    mainTitles: displayed,
    extraCount,
  };
}

export function filterOrdersByDateRange(
  orders: Order[],
  range: DateRangeFilterOption,
): Order[] {
  if (range === "ALL_TIME") return orders;

  const now = new Date();
  const nowTime = now.getTime();

  return orders.filter((order) => {
    if (!order.createdAt) return true;
    const orderDate = new Date(order.createdAt);
    const orderTime = orderDate.getTime();
    if (isNaN(orderTime)) return true;

    const diffDays = (nowTime - orderTime) / (1000 * 60 * 60 * 24);

    switch (range) {
      case "today": {
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0,
        ).getTime();
        return orderTime >= startOfToday && orderTime <= nowTime;
      }
      case "last7days":
        return diffDays <= 7;
      case "last30days":
        return diffDays <= 30;
      case "last3months":
        return diffDays <= 90;
      case "thisYear":
        return orderDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
}

