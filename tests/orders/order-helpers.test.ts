import { describe, it, expect } from "vitest";
import {
  formatOrderDate,
  formatOrderPrice,
  getOrderStatusGroup,
  matchesTabFilter,
  getStatusBadgeConfig,
  formatItemsSummary,
  filterOrdersByDateRange,
} from "@/features/orders/utils/order-helpers";
import type { Order, OrderItem, OrderStatus } from "@/features/orders/types/order.types";

describe("Order Helpers", () => {
  describe("formatOrderDate", () => {
    it("formats ISO date string into readable day, month, year format", () => {
      const date = "2021-05-10T12:00:00.000Z";
      const formatted = formatOrderDate(date);
      expect(formatted).toMatch(/10 May 2021/);
    });

    it("returns 'Recent' for missing or invalid dates", () => {
      expect(formatOrderDate(undefined)).toBe("Recent");
      expect(formatOrderDate("invalid-date")).toBe("Recent");
    });
  });

  describe("formatOrderPrice", () => {
    it("converts paise to formatted INR currency string", () => {
      expect(formatOrderPrice(1250000)).toBe("₹ 12,500");
      expect(formatOrderPrice(899900)).toBe("₹ 8,999");
      expect(formatOrderPrice(0)).toBe("₹ 0");
    });
  });

  describe("getOrderStatusGroup & matchesTabFilter", () => {
    it("maps backend statuses to the 3 main groups correctly", () => {
      expect(getOrderStatusGroup("DELIVERED")).toBe("DELIVERED");
      expect(getOrderStatusGroup("CANCELLED")).toBe("CANCELLED");
      expect(getOrderStatusGroup("PENDING")).toBe("IN_PROGRESS");
      expect(getOrderStatusGroup("CONFIRMED")).toBe("IN_PROGRESS");
      expect(getOrderStatusGroup("SHIPPED")).toBe("IN_PROGRESS");
      expect(getOrderStatusGroup("PROCESSING")).toBe("IN_PROGRESS");
    });

    it("matches tab filter appropriately", () => {
      expect(matchesTabFilter("CONFIRMED", "ALL")).toBe(true);
      expect(matchesTabFilter("CONFIRMED", "IN_PROGRESS")).toBe(true);
      expect(matchesTabFilter("CONFIRMED", "DELIVERED")).toBe(false);
      expect(matchesTabFilter("DELIVERED", "DELIVERED")).toBe(true);
      expect(matchesTabFilter("CANCELLED", "CANCELLED")).toBe(true);
    });
  });

  describe("getStatusBadgeConfig", () => {
    it("returns green badge for DELIVERED", () => {
      const config = getStatusBadgeConfig("DELIVERED");
      expect(config.label).toBe("Delivered");
      expect(config.dotBg).toBe("bg-emerald-500");
    });

    it("returns rose badge for CANCELLED", () => {
      const config = getStatusBadgeConfig("CANCELLED");
      expect(config.label).toBe("Cancelled");
      expect(config.dotBg).toBe("bg-rose-500");
    });

    it("returns specific title case badge for statuses", () => {
      const confirmedConfig = getStatusBadgeConfig("CONFIRMED");
      expect(confirmedConfig.label).toBe("Confirmed");
      expect(confirmedConfig.dotBg).toBe("bg-teal-500");

      const processingConfig = getStatusBadgeConfig("PROCESSING");
      expect(processingConfig.label).toBe("Processing");
      expect(processingConfig.dotBg).toBe("bg-indigo-500");

      const pendingConfig = getStatusBadgeConfig("PENDING");
      expect(pendingConfig.label).toBe("Pending");
      expect(pendingConfig.dotBg).toBe("bg-amber-500");
    });
  });

  describe("formatItemsSummary", () => {
    it("returns single title and 0 extra count when 1 item", () => {
      const items: OrderItem[] = [
        {
          bookListing: "1",
          title: "Two-seater wooden polished dinning table",
          priceInPaise: 899900,
          quantity: 1,
          subtotalInPaise: 899900,
        },
      ];
      const result = formatItemsSummary(items);
      expect(result.mainTitles).toEqual(["Two-seater wooden polished dinning table"]);
      expect(result.extraCount).toBe(0);
    });

    it("returns up to 3 titles and counts remaining items as extra", () => {
      const items: OrderItem[] = [
        { bookListing: "1", title: "Blue & pink Silk Saree", priceInPaise: 500000, quantity: 1, subtotalInPaise: 500000 },
        { bookListing: "2", title: "Linen Kurta", priceInPaise: 300000, quantity: 1, subtotalInPaise: 300000 },
        { bookListing: "3", title: "Printed black & white short kurti", priceInPaise: 250000, quantity: 1, subtotalInPaise: 250000 },
        { bookListing: "4", title: "Embroidered Dupatta", priceInPaise: 100000, quantity: 1, subtotalInPaise: 100000 },
        { bookListing: "5", title: "Cotton Pants", priceInPaise: 100000, quantity: 1, subtotalInPaise: 100000 },
      ];
      const result = formatItemsSummary(items, 3);
      expect(result.mainTitles).toHaveLength(3);
      expect(result.extraCount).toBe(2);
    });
  });

  describe("filterOrdersByDateRange", () => {
    const mockOrder = (createdAt: string): Order =>
      ({
        _id: "ord_1",
        orderNumber: "ORD-001",
        items: [],
        subtotalInPaise: 100000,
        deliveryChargeInPaise: 0,
        couponDiscountInPaise: 0,
        totalAmountInPaise: 100000,
        paymentMethod: "ONLINE_PAY",
        orderStatus: "DELIVERED" as OrderStatus,
        paymentStatus: "PAID",
        shippingAddress: {} as any,
        billingAddress: {} as any,
        billingSameAsShipping: true,
        createdAt,
      }) as Order;

    it("returns all orders when range is ALL_TIME", () => {
      const orders = [
        mockOrder("2020-01-01T00:00:00Z"),
        mockOrder("2024-01-01T00:00:00Z"),
      ];
      expect(filterOrdersByDateRange(orders, "ALL_TIME")).toHaveLength(2);
    });

    it("filters orders by recent days correctly", () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const oldDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

      const orders = [mockOrder(recentDate), mockOrder(oldDate)];
      const filtered = filterOrdersByDateRange(orders, "last30days");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].createdAt).toBe(recentDate);
    });
  });
});

