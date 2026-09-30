import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecentOrderRow } from "@/features/seller/components/recent-order-row";
import { SellerOrderStatusDialog } from "@/features/seller/components/seller-order-status-dialog";
import { updateOrderStatus } from "@/features/orders/api/orders.api";
import type { SellerRecentOrder } from "@/features/seller/types/seller.types";

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

const mockOrder: SellerRecentOrder = {
  orderId: "ord_101",
  orderNumber: "ORD-9842",
  customer: {
    id: "usr_1",
    name: "Rahim Chowdhury",
    email: "rahim@example.com",
  },
  orderStatus: "PROCESSING",
  paymentStatus: "PAID",
  paymentMethod: "ONLINE_PAY",
  createdAt: "2026-09-22T08:30:00Z",
  sellerTotalInRupees: 650,
  sellerTotalInPaise: 65000,
  sellerItemCount: 1,
  items: [
    {
      itemId: "item_1",
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
};

const mockDeliveredOrder: SellerRecentOrder = {
  ...mockOrder,
  orderId: "ord_102",
  orderStatus: "DELIVERED",
};

describe("SellerOrderStatusDialog & RecentOrderRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders order row with customer name and status", () => {
    render(<RecentOrderRow order={mockOrder} />, {
      wrapper: createTestWrapper(),
    });

    expect(screen.getByText("Rahim Chowdhury")).toBeDefined();
    expect(screen.getByText("Gitanjali")).toBeDefined();
    expect(screen.getByText("processing")).toBeDefined();
  });

  it("opens status dialog when RecentOrderRow is clicked", async () => {
    render(<RecentOrderRow order={mockOrder} />, {
      wrapper: createTestWrapper(),
    });

    const rowButton = screen.getByRole("button", {
      name: /view and manage order ord-9842/i,
    });
    fireEvent.click(rowButton);

    expect(await screen.findByText("Order #ORD-9842")).toBeDefined();
    expect(screen.getByText("Update Status To")).toBeDefined();
  });

  it("shows terminal state warning when order is DELIVERED", () => {
    const onOpenChange = vi.fn();

    render(
      <SellerOrderStatusDialog
        order={mockDeliveredOrder}
        open={true}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createTestWrapper() },
    );

    expect(screen.getByText("Terminal Order State")).toBeDefined();
    expect(
      screen.getByText(/marked as/i),
    ).toBeDefined();
    expect(screen.queryByText("Update Status To")).toBeNull();
  });

  it("does not render shipment and tracking details when status is SHIPPED", () => {
    const onOpenChange = vi.fn();

    render(
      <SellerOrderStatusDialog
        order={mockOrder}
        open={true}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createTestWrapper() },
    );

    const shippedButton = screen.getByRole("button", { name: /shipped/i });
    fireEvent.click(shippedButton);

    expect(screen.queryByText(/shipment & tracking details/i)).toBeNull();
    expect(screen.queryByPlaceholderText(/e\.g\. BlueDart Express/i)).toBeNull();
    expect(screen.queryByPlaceholderText(/e\.g\. BD-12345678/i)).toBeNull();
  });

  it("submits status update mutation with selected status and message", async () => {
    const onOpenChange = vi.fn();
    const mockSuccessResponse = {
      success: true,
      statusCode: 200,
      message: "Order status updated successfully",
      data: {
        order: { _id: "ord_101", orderStatus: "SHIPPED" },
        newStatus: "SHIPPED",
        orderStatus: "SHIPPED",
      },
    };

    vi.mocked(updateOrderStatus).mockResolvedValueOnce(
      mockSuccessResponse as never,
    );

    render(
      <SellerOrderStatusDialog
        order={mockOrder}
        open={true}
        onOpenChange={onOpenChange}
      />,
      { wrapper: createTestWrapper() },
    );

    // Click "Shipped" status button
    const shippedButton = screen.getByRole("button", { name: /shipped/i });
    fireEvent.click(shippedButton);

    // Enter optional customer message
    const messageInput = screen.getByPlaceholderText(/package prepared for pickup/i);
    fireEvent.change(messageInput, { target: { value: "Package prepared and ready" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /update status/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateOrderStatus).toHaveBeenCalledWith("ord_101", {
        status: "SHIPPED",
        message: "Package prepared and ready",
      });
    });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
