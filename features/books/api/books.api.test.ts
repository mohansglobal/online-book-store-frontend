import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import {
  applyBulkDiscount,
  applyListingDiscount,
  removeBulkDiscount,
  removeListingDiscount,
  toggleListingStatus,
  updateListingStock,
} from "./books.api";
import type { ApplyListingDiscountInput } from "../types/listing.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Books & Listings API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("applyListingDiscount", () => {
    it("should send PATCH /listings/:id/discount with PERCENTAGE payload", async () => {
      const input: ApplyListingDiscountInput = {
        listingId: "listing_123",
        discountType: "PERCENTAGE",
        discountValue: 20,
      };

      const mockResponse = {
        success: true,
        message: "Listing discount applied and selling price updated successfully",
        data: {
          _id: "listing_123",
          id: "listing_123",
          stock: 25,
          isActive: true,
          mrpInPaise: 100000,
          sellingPriceInPaise: 80000,
          priceInPaise: 80000,
          mrp: 1000,
          price: 800,
          discountPercentage: 20,
        },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await applyListingDiscount(input);

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/listings/listing_123/discount",
        {
          discountType: "PERCENTAGE",
          discountValue: 20,
        },
        {
          signal: undefined,
        },
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.discountPercentage).toBe(20);
      expect(result.data.sellingPriceInPaise).toBe(80000);
    });

    it("should send PATCH /listings/:id/discount with FLAT discount payload and MRP update", async () => {
      const input: ApplyListingDiscountInput = {
        listingId: "listing_456",
        discountType: "FLAT",
        discountValue: 150,
        mrp: 1200,
      };

      const mockResponse = {
        success: true,
        message: "Listing discount applied and selling price updated successfully",
        data: {
          _id: "listing_456",
          id: "listing_456",
          stock: 10,
          isActive: true,
          mrpInPaise: 120000,
          sellingPriceInPaise: 105000,
          priceInPaise: 105000,
          mrp: 1200,
          price: 1050,
          discountPercentage: 13,
        },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await applyListingDiscount(input);

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/listings/listing_456/discount",
        {
          discountType: "FLAT",
          discountValue: 150,
          mrp: 1200,
        },
        {
          signal: undefined,
        },
      );
      expect(result.data.price).toBe(1050);
    });
  });

  describe("updateListingStock", () => {
    it("should send PATCH /book-listings/:id/stock with operation and quantity", async () => {
      const mockResponse = {
        success: true,
        message: "Stock updated successfully",
        data: { _id: "list_1", stock: 15 },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await updateListingStock({
        listingId: "list_1",
        operation: "increase",
        quantity: 5,
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/book-listings/list_1/stock",
        { operation: "increase", quantity: 5 },
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("toggleListingStatus", () => {
    it("should send PATCH /book-listings/:id/toggle-status", async () => {
      const mockResponse = {
        success: true,
        message: "Status updated",
        data: { _id: "list_2", isActive: false },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await toggleListingStatus({
        listingId: "list_2",
        isActive: false,
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/book-listings/list_2/toggle-status",
        { isActive: false },
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("scheduled and bulk discount APIs", () => {
    it("should send scheduled discount payload with date window and campaign", async () => {
      const mockResponse = {
        success: true,
        message: "Scheduled discount applied",
        data: { _id: "list_1" },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      await applyListingDiscount({
        listingId: "list_1",
        discountType: "PERCENTAGE",
        discountValue: 30,
        startDate: "2026-11-10T00:00:00.000Z",
        endDate: "2026-11-21T23:59:59.999Z",
        campaignName: "November Super Sale",
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/listings/list_1/discount",
        {
          discountType: "PERCENTAGE",
          discountValue: 30,
          startDate: "2026-11-10T00:00:00.000Z",
          endDate: "2026-11-21T23:59:59.999Z",
          campaignName: "November Super Sale",
        },
        { signal: undefined },
      );
    });

    it("should send DELETE /listings/:id/discount on removeListingDiscount", async () => {
      const mockResponse = {
        success: true,
        message: "Discount removed successfully",
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await removeListingDiscount("list_1");

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/listings/list_1/discount",
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should send POST /listings/discounts/bulk on applyBulkDiscount", async () => {
      const mockResponse = {
        success: true,
        message: "Bulk discount applied",
        data: { modifiedCount: 5 },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await applyBulkDiscount({
        targetType: "ALL",
        discountType: "PERCENTAGE",
        discountValue: 20,
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/listings/discounts/bulk",
        {
          targetType: "ALL",
          discountType: "PERCENTAGE",
          discountValue: 20,
        },
        { signal: undefined },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should send DELETE /listings/discounts/bulk on removeBulkDiscount", async () => {
      const mockResponse = {
        success: true,
        message: "Bulk discounts removed",
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await removeBulkDiscount({
        targetType: "SPECIFIC",
        listingIds: ["list_1", "list_2"],
      });

      expect(apiClient.delete).toHaveBeenCalledWith(
        "/listings/discounts/bulk",
        {
          json: {
            targetType: "SPECIFIC",
            listingIds: ["list_1", "list_2"],
          },
          signal: undefined,
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
