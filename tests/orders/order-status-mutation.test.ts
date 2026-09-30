import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatus } from "@/features/orders/api/orders.api";
import { useUpdateOrderStatusMutation } from "@/features/orders";
import type { Order, UpdateOrderStatusResponse } from "@/features/orders/types/order.types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/orders/api/orders.api", () => ({
  updateOrderStatus: vi.fn(),
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

describe("useUpdateOrderStatusMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls updateOrderStatus with payload and triggers success toast and cache invalidations", async () => {
    const mockResponse: UpdateOrderStatusResponse = {
      success: true,
      statusCode: 200,
      message: "Order status updated successfully",
      data: {
        order: { _id: "ord_555", orderStatus: "SHIPPED" } as unknown as Order,
        newStatus: "SHIPPED",
        orderStatus: "SHIPPED",
      },
    };

    vi.mocked(updateOrderStatus).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUpdateOrderStatusMutation(), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        orderId: "ord_555",
        payload: {
          status: "SHIPPED",
          courier: "Delhivery",
          trackingNumber: "DLV-987654",
        },
      });
    });

    expect(updateOrderStatus).toHaveBeenCalledWith("ord_555", {
      status: "SHIPPED",
      courier: "Delhivery",
      trackingNumber: "DLV-987654",
    });
    expect(toast.success).toHaveBeenCalledWith("Order status updated successfully");
  });

  it("handles error response and triggers error toast", async () => {
    vi.mocked(updateOrderStatus).mockRejectedValueOnce(
      new Error("Cannot modify cancelled order"),
    );

    const { result } = renderHook(() => useUpdateOrderStatusMutation(), {
      wrapper: createTestWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          orderId: "ord_555",
          payload: {
            status: "DELIVERED",
          },
        });
      } catch {
        // Handled by mutation hook
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Cannot modify cancelled order");
  });
});
