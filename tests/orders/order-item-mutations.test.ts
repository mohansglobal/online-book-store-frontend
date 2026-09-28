import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelOrder,
  cancelOrderItem,
  updateOrderItemFulfillment,
} from "@/features/orders/api/orders.api";
import {
  useCancelOrderMutation,
  useCancelOrderItemMutation,
  useUpdateOrderItemFulfillmentMutation,
} from "@/features/orders";
import type { Order } from "@/features/orders/types/order.types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/orders/api/orders.api", () => ({
  cancelOrder: vi.fn(),
  cancelOrderItem: vi.fn(),
  updateOrderItemFulfillment: vi.fn(),
}));

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe("Order Item Mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useCancelOrderMutation (Multi-item partial cancellation)", () => {
    it("calls cancelOrder with itemIds array and shows success toast", async () => {
      const mockResponse = {
        success: true,
        message: "Item cancelled successfully",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_CANCELLED" } as unknown as Order,
      };

      vi.mocked(cancelOrder).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCancelOrderMutation(), {
        wrapper: createTestWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          orderId: "ord_123",
          itemIds: ["item_1"],
          reason: "Found better price",
        });
      });

      expect(cancelOrder).toHaveBeenCalledWith("ord_123", {
        itemIds: ["item_1"],
        reason: "Found better price",
      });
      expect(toast.success).toHaveBeenCalledWith("Item cancelled successfully");
    });
  });

  describe("useCancelOrderItemMutation", () => {
    it("calls cancelOrderItem for single item and toasts success", async () => {
      const mockResponse = {
        success: true,
        message: "Item cancelled",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_CANCELLED" } as unknown as Order,
      };

      vi.mocked(cancelOrderItem).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCancelOrderItemMutation(), {
        wrapper: createTestWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          orderId: "ord_123",
          itemId: "item_999",
          reason: "Changed mind",
        });
      });

      expect(cancelOrderItem).toHaveBeenCalledWith(
        "ord_123",
        "item_999",
        "Changed mind",
      );
      expect(toast.success).toHaveBeenCalledWith("Item cancelled");
    });

    it("toasts error on mutation failure", async () => {
      vi.mocked(cancelOrderItem).mockRejectedValueOnce(
        new Error("Cannot cancel shipped item"),
      );

      const { result } = renderHook(() => useCancelOrderItemMutation(), {
        wrapper: createTestWrapper(),
      });

      await act(async () => {
        try {
          await result.current.mutateAsync({
            orderId: "ord_123",
            itemId: "item_shipped",
          });
        } catch {
          // Handled by mutation onError
        }
      });

      expect(toast.error).toHaveBeenCalledWith("Cannot cancel shipped item");
    });
  });

  describe("useUpdateOrderItemFulfillmentMutation", () => {
    it("calls updateOrderItemFulfillment with courier tracking details", async () => {
      const mockResponse = {
        success: true,
        message: "Item marked as SHIPPED",
        data: { _id: "ord_123", orderStatus: "PARTIALLY_SHIPPED" } as unknown as Order,
      };

      vi.mocked(updateOrderItemFulfillment).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(
        () => useUpdateOrderItemFulfillmentMutation(),
        { wrapper: createTestWrapper() },
      );

      await act(async () => {
        await result.current.mutateAsync({
          orderId: "ord_123",
          itemId: "item_seller_a",
          payload: {
            courier: "Blue Dart",
            trackingNumber: "BD-12345",
            status: "SHIPPED",
          },
        });
      });

      expect(updateOrderItemFulfillment).toHaveBeenCalledWith(
        "ord_123",
        "item_seller_a",
        {
          courier: "Blue Dart",
          trackingNumber: "BD-12345",
          status: "SHIPPED",
        },
      );
      expect(toast.success).toHaveBeenCalledWith("Item marked as SHIPPED");
    });
  });
});
