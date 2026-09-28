import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import {
  createOrder,
  getOrders,
  initiateRazorpayOrder,
  verifyOrderPayment,
  cancelOrder,
  cancelOrderItem,
  updateOrderItemFulfillment,
  type VerifyPaymentResponse,
} from "./orders.api";
import type { CreateOrderInput, Order } from "../types/order.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("Orders API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should send POST /orders with CASH_ON_DELIVERY payload", async () => {
      const codPayload: CreateOrderInput = {
        shippingAddressId: "addr_123",
        billingSameAsShipping: true,
        paymentMethod: "CASH_ON_DELIVERY",
        couponCode: "SAVE10",
      };

      const mockResponse = {
        success: true,
        message: "Order placed successfully",
        data: {
          _id: "order_abc",
          orderNumber: "ORD-2026-0001",
          orderStatus: "PLACED",
          paymentStatus: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await createOrder(codPayload);

      expect(apiClient.post).toHaveBeenCalledWith("/orders", codPayload);
      expect(result).toEqual(mockResponse);
      expect(result.data.orderNumber).toBe("ORD-2026-0001");
    });

    it("should send POST /orders with ONLINE_PAY and Razorpay credentials", async () => {
      const onlinePayload: CreateOrderInput = {
        shippingAddressId: "addr_123",
        billingSameAsShipping: false,
        billingAddressId: "addr_456",
        paymentMethod: "ONLINE_PAY",
        paymentId: "pay_xyz789",
        razorpayPaymentId: "pay_xyz789",
        razorpayOrderId: "order_rzp_123",
        razorpaySignature: "sig_mock_hash_456",
      };

      const mockResponse = {
        success: true,
        message: "Order placed successfully",
        data: {
          _id: "order_online_1",
          orderNumber: "ORD-2026-0002",
          orderStatus: "CONFIRMED",
          paymentStatus: "PAID",
          paymentMethod: "ONLINE_PAY",
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await createOrder(onlinePayload);

      expect(apiClient.post).toHaveBeenCalledWith("/orders", onlinePayload);
      expect(result.data.paymentStatus).toBe("PAID");
    });
  });

  describe("initiateRazorpayOrder", () => {
    it("should send POST /orders/razorpay-order with items and address params", async () => {
      const initiatePayload = {
        items: [{ bookListing: "listing_1", quantity: 2 }],
        couponCode: "WELCOME",
        shippingAddressId: "addr_123",
        billingSameAsShipping: true,
      };

      const mockResponse = {
        success: true,
        message: "Razorpay order initiated successfully",
        data: {
          razorpayOrderId: "order_rzp_999",
          amountInPaise: 49900,
          currency: "INR",
          keyId: "rzp_test_key_123",
        },
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await initiateRazorpayOrder(initiatePayload);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/orders/razorpay-order",
        initiatePayload,
      );
      expect(result.data.razorpayOrderId).toBe("order_rzp_999");
      expect(result.data.amountInPaise).toBe(49900);
    });

    it("should handle empty or undefined payload by posting default object", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        success: true,
        data: { razorpayOrderId: "order_rzp_auto", amountInPaise: 10000, currency: "INR" },
      });

      const result = await initiateRazorpayOrder();

      expect(apiClient.post).toHaveBeenCalledWith("/orders/razorpay-order", {});
      expect(result.data.razorpayOrderId).toBe("order_rzp_auto");
    });
  });

  describe("verifyOrderPayment", () => {
    it("should send POST /orders/:id/verify-payment with signature details", async () => {
      const verifyPayload = {
        orderId: "ord_123",
        razorpayPaymentId: "pay_abc",
        razorpayOrderId: "order_rzp_xyz",
        razorpaySignature: "hmac_signature_789",
      };

      const mockResponse: VerifyPaymentResponse = {
        success: true,
        message: "Payment verified successfully",
        data: {
          _id: "ord_123",
          orderStatus: "CONFIRMED",
          paymentStatus: "PAID",
        } as unknown as Order,
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await verifyOrderPayment(verifyPayload);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/orders/ord_123/verify-payment",
        {
          razorpayPaymentId: "pay_abc",
          razorpayOrderId: "order_rzp_xyz",
          razorpaySignature: "hmac_signature_789",
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should return null gracefully if payment verification throws an error", async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error("Verification failed"));

      const result = await verifyOrderPayment({
        orderId: "ord_fail",
        razorpayPaymentId: "pay_invalid",
      });

      expect(result).toBeNull();
    });
  });

  describe("getOrders", () => {
    it("should send GET /orders with pagination query parameters", async () => {
      const mockOrdersResponse = {
        success: true,
        message: "Orders retrieved",
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockOrdersResponse);

      const result = await getOrders({ page: 2, limit: 10, sort: "newest" });

      expect(apiClient.get).toHaveBeenCalledWith("/orders", {
        params: { page: 2, limit: 10, sort: "newest" },
        signal: undefined,
      });
      expect(result).toEqual(mockOrdersResponse);
    });
  });

  describe("cancelOrder", () => {
    it("should send POST /orders/:id/cancel with reason string", async () => {
      const mockCancelResponse = {
        success: true,
        message: "Order cancelled successfully",
        data: { _id: "ord_123", orderStatus: "CANCELLED" } as unknown as Order,
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockCancelResponse);

      const result = await cancelOrder("ord_123", "Ordered by mistake");

      expect(apiClient.post).toHaveBeenCalledWith("/orders/ord_123/cancel", {
        reason: "Ordered by mistake",
      });
      expect(result).toEqual(mockCancelResponse);
    });

    it("should send POST /orders/:id/cancel with specific itemIds for partial cancellation", async () => {
      const mockCancelResponse = {
        success: true,
        message: "Item cancelled, order is now partially cancelled",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_CANCELLED" } as unknown as Order,
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockCancelResponse);

      const result = await cancelOrder("ord_123", {
        itemIds: ["item_456"],
        reason: "Found better price",
      });

      expect(apiClient.post).toHaveBeenCalledWith("/orders/ord_123/cancel", {
        itemIds: ["item_456"],
        reason: "Found better price",
      });
      expect(result).toEqual(mockCancelResponse);
    });
  });

  describe("cancelOrderItem", () => {
    it("should send POST /orders/:id/items/:itemId/cancel", async () => {
      const mockResponse = {
        success: true,
        message: "Item cancelled successfully",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_CANCELLED" } as unknown as Order,
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await cancelOrderItem("ord_123", "item_789", "Changed mind");

      expect(apiClient.post).toHaveBeenCalledWith(
        "/orders/ord_123/items/item_789/cancel",
        { reason: "Changed mind" },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateOrderItemFulfillment", () => {
    it("should send PATCH /orders/:id/items/:itemId/fulfillment with tracking details", async () => {
      const fulfillmentPayload = {
        courier: "Blue Dart",
        trackingNumber: "BD-987654",
        trackingUrl: "https://bluedart.com/track/BD-987654",
        status: "SHIPPED" as const,
      };

      const mockResponse = {
        success: true,
        message: "Item marked as SHIPPED",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_SHIPPED" } as unknown as Order,
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await updateOrderItemFulfillment(
        "ord_123",
        "item_789",
        fulfillmentPayload,
      );

      expect(apiClient.patch).toHaveBeenCalledWith(
        "/orders/ord_123/items/item_789/fulfillment",
        fulfillmentPayload,
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
