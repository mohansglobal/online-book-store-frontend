import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import {
  getSellerRecentOrders,
  getSellerRevenueAnalytics,
  getDailyOrdersAnalytics,
  getSellerOrders,
} from "./seller.api";
import type {
  SellerRecentOrdersParams,
  SellerRecentOrdersResponse,
  DailyOrdersAnalyticsResponse,
  SellerOrdersResponse,
} from "../types/seller.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Seller API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSellerRecentOrders", () => {
    it("should send GET /dashboard/recent-orders with default parameters", async () => {
      const mockResponse: SellerRecentOrdersResponse = {
        success: true,
        message: "Recent orders retrieved successfully",
        data: {
          summary: {
            month: "September 2026",
            totalOrdersInMonth: 128,
            totalSellerEarningsInRupees: 94820,
            totalSellerEarningsInPaise: 9482000,
          },
          recentOrders: [
            {
              orderId: "ord_101",
              orderNumber: "ORD-9842",
              customer: {
                id: "usr_1",
                name: "Rahim Chowdhury",
                email: "rahim@example.com",
              },
              orderStatus: "PENDING",
              paymentStatus: "PAID",
              paymentMethod: "ONLINE_PAY",
              createdAt: "2026-09-22T08:30:00Z",
              sellerTotalInRupees: 650,
              sellerTotalInPaise: 65000,
              sellerItemCount: 1,
              items: [
                {
                  bookListingId: "lst_1",
                  bookId: "bk_1",
                  title: "Gitanjali",
                  priceInRupees: 650,
                  priceInPaise: 65000,
                  quantity: 1,
                  subtotalInRupees: 650,
                  subtotalInPaise: 65000,
                },
              ],
            },
          ],
        },
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getSellerRecentOrders();

      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/recent-orders", {
        params: undefined,
        signal: undefined,
      });

      expect(result).toEqual(mockResponse);
      expect(result.data.recentOrders).toHaveLength(1);
      expect(result.data.recentOrders[0].orderNumber).toBe("ORD-9842");
    });

    it("should pass query params for status, page, and limit", async () => {
      const mockResponse: SellerRecentOrdersResponse = {
        success: true,
        message: "Filtered orders",
        data: {
          summary: {
            month: "September 2026",
            totalOrdersInMonth: 50,
            totalSellerEarningsInRupees: 40000,
            totalSellerEarningsInPaise: 4000000,
          },
          recentOrders: [],
        },
        meta: {
          page: 2,
          limit: 5,
          total: 15,
          totalPages: 3,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const params: SellerRecentOrdersParams = {
        status: "PROCESSING",
        page: 2,
        limit: 5,
      };

      const result = await getSellerRecentOrders(params);

      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/recent-orders", {
        params: {
          status: "PROCESSING",
          page: 2,
          limit: 5,
        },
        signal: undefined,
      });

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
    });

    it("should pass month and year params when specified", async () => {
      const mockResponse: SellerRecentOrdersResponse = {
        success: true,
        message: "Monthly orders",
        data: {
          summary: {
            month: "August 2026",
            totalOrdersInMonth: 90,
            totalSellerEarningsInRupees: 65000,
            totalSellerEarningsInPaise: 6500000,
          },
          recentOrders: [],
        },
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await getSellerRecentOrders({ month: "August", year: 2026 });

      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/recent-orders", {
        params: { month: "August", year: 2026 },
        signal: undefined,
      });
    });
  });

  describe("getSellerRevenueAnalytics", () => {
    it("should send GET /dashboard/revenue-analytics with timeframe param", async () => {
      const mockResponse = {
        success: true,
        message: "Revenue analytics retrieved",
        data: {
          timeframe: "monthly",
          currency: "INR",
          main: {
            totalRevenueInRupees: 184620,
            totalRevenueInPaise: 18462000,
            growthPercentage: 12.8,
            differenceInRupees: 20940,
            differenceInPaise: 2094000,
            isGrowthPositive: true,
            comparisonText: "₹20,940 more than last month",
            previousPeriodRevenueInRupees: 163680,
            previousPeriodRevenueInPaise: 16368000,
          },
          today: {
            todayRevenueInRupees: 8420,
            todayRevenueInPaise: 842000,
            todayOrdersCount: 11,
          },
          metrics: {
            netRevenueInRupees: 162465,
            netRevenueInPaise: 16246560,
            formattedNetRevenue: "₹1.62L",
            avgOrderValueInRupees: 742,
            avgOrderValueInPaise: 74144,
            totalOrders: 249,
            totalItemsSold: 418,
          },
          trend: {
            title: "Revenue trend",
            subtitle: "Last 7 days",
            trendTotalInRupees: 48620,
            trendTotalInPaise: 4862000,
            trendGrowthPercentage: 12.8,
            isTrendGrowthPositive: true,
            points: [
              { label: "Mon", date: "2026-09-15", revenueInRupees: 5200, revenueInPaise: 520000, orders: 7 },
            ],
          },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getSellerRevenueAnalytics({ timeframe: "monthly" });

      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/revenue-analytics", {
        params: { timeframe: "monthly" },
        signal: undefined,
      });

      expect(result.data.main.totalRevenueInRupees).toBe(184620);
      expect(result.data.metrics.formattedNetRevenue).toBe("₹1.62L");
    });
  });

  describe("getDailyOrdersAnalytics", () => {
    it("should send GET /dashboard/daily-orders with days query param", async () => {
      const mockResponse: DailyOrdersAnalyticsResponse = {
        success: true,
        statusCode: 200,
        message: "Average daily orders analytics retrieved successfully",
        data: {
          title: "Orders This Week",
          subtitle: "Average daily orders & book shipments",
          periodLabel: "Last 7 Days",
          main: {
            averageDailyOrders: 46.5,
            growthPercentage: 14.5,
            formattedGrowth: "+14.5%",
            isGrowthPositive: true,
            growthBadge: "151%",
            totalOrders: 326,
            totalShipments: 412,
            totalRevenueInRupees: 142500,
            totalRevenueInPaise: 14250000,
          },
          peak: {
            day: "Sat",
            date: "2026-09-21",
            orders: 85,
            badge: "Peak: Sat (85)",
          },
          currentPeriod: {
            startDate: "2026-09-16",
            endDate: "2026-09-22",
            totalOrders: 326,
            averageDailyOrders: 46.5,
            totalShipments: 412,
            totalRevenueInRupees: 142500,
            totalRevenueInPaise: 14250000,
            days: [
              {
                day: "Mon",
                dayFull: "Monday",
                date: "2026-09-16",
                orders: 32,
                shipments: 40,
                revenueInRupees: 12800,
                revenueInPaise: 1280000,
                isPeak: false,
              },
              {
                day: "Sat",
                dayFull: "Saturday",
                date: "2026-09-21",
                orders: 85,
                shipments: 110,
                revenueInRupees: 34000,
                revenueInPaise: 3400000,
                isPeak: true,
              },
            ],
          },
          comparison: {
            differenceInOrders: 41,
            differenceInDailyAverage: 5.8,
            growthPercentage: 14.5,
            isGrowthPositive: true,
            comparisonText: "14.5% more than previous 7 days",
          },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getDailyOrdersAnalytics({ days: 7 });

      expect(apiClient.get).toHaveBeenCalledWith("/dashboard/daily-orders", {
        params: { days: 7 },
        signal: undefined,
      });

      expect(result.data.main.averageDailyOrders).toBe(46.5);
      expect(result.data.peak.day).toBe("Sat");
      expect(result.data.currentPeriod.days).toHaveLength(2);
      expect(result.data.currentPeriod.days[1].isPeak).toBe(true);
    });
  });

  describe("getSellerOrders", () => {
    it("should send GET /orders/seller with default parameters", async () => {
      const mockResponse: SellerOrdersResponse = {
        success: true,
        message: "Seller orders retrieved successfully",
        data: [
          {
            _id: "ord_999",
            orderNumber: "ORD-2026-9999",
            orderStatus: "CONFIRMED",
            overallOrderStatus: "CONFIRMED",
            sellerSubtotalInPaise: 120000,
            paymentMethod: "ONLINE_PAY",
            paymentStatus: "PAID",
            buyer: {
              _id: "buyer_1",
              name: "Ananya Roy",
              email: "ananya@example.com",
            },
            shippingAddress: {
              fullName: "Ananya Roy",
              mobileNumber: "+919876543210",
              streetAddress: "12 Park Street",
              city: "Kolkata",
              state: "West Bengal",
              postalCode: "700016",
              country: "India",
            },
            items: [
              {
                bookListing: "lst_1",
                title: "Rabindranath Tagore Omnibus",
                priceInPaise: 120000,
                quantity: 1,
                subtotalInPaise: 120000,
                status: "CONFIRMED",
              },
            ],
            createdAt: "2026-09-28T10:00:00.000Z",
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getSellerOrders();

      expect(apiClient.get).toHaveBeenCalledWith("/orders/seller", {
        params: undefined,
        signal: undefined,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].orderNumber).toBe("ORD-2026-9999");
      expect(result.data[0].sellerSubtotalInPaise).toBe(120000);
    });

    it("should pass query params for status, dateRange, and page", async () => {
      const mockResponse: SellerOrdersResponse = {
        success: true,
        message: "Filtered seller orders",
        data: [],
        meta: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const params = {
        status: "PROCESSING",
        dateRange: "last7days",
        page: 2,
        limit: 10,
      };

      const result = await getSellerOrders(params);

      expect(apiClient.get).toHaveBeenCalledWith("/orders/seller", {
        params: {
          status: "PROCESSING",
          dateRange: "last7days",
          page: 2,
          limit: 10,
        },
        signal: undefined,
      });

      expect(result.meta.page).toBe(2);
      expect(result.meta.total).toBe(25);
    });
  });
});
