import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrdersPage } from "@/features/orders/components/orders-page";
import { OrderCard } from "@/features/orders/components/order-card";
import { OrderStatusTabs } from "@/features/orders/components/order-status-tabs";
import type { Order } from "@/features/orders/types/order.types";

// Mock the CategoryBanner
vi.mock("@/components/categories/components/CategoryBanner", () => ({
  CategoryBanner: ({ categoryName }: { categoryName: string }) => (
    <div data-testid="category-banner">{categoryName}</div>
  ),
}));

// Mock Next.js Image and Link
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="mock-image" />
  ),
}));

const mockOrders: Order[] = [
  {
    _id: "order_1",
    orderNumber: "ABC-6457325",
    items: [
      {
        bookListing: "1",
        title: "Blue & pink Silk Saree",
        priceInPaise: 500000,
        quantity: 1,
        subtotalInPaise: 500000,
        coverImage: "/assets/cover1.jpg",
      },
      {
        bookListing: "2",
        title: "Linen Kurta",
        priceInPaise: 300000,
        quantity: 1,
        subtotalInPaise: 300000,
      },
      {
        bookListing: "3",
        title: "Printed black & white short kurti",
        priceInPaise: 250000,
        quantity: 1,
        subtotalInPaise: 250000,
      },
      {
        bookListing: "4",
        title: "Item 4",
        priceInPaise: 100000,
        quantity: 1,
        subtotalInPaise: 100000,
      },
      {
        bookListing: "5",
        title: "Item 5",
        priceInPaise: 100000,
        quantity: 1,
        subtotalInPaise: 100000,
      },
    ],
    subtotalInPaise: 1250000,
    deliveryChargeInPaise: 0,
    couponDiscountInPaise: 0,
    totalAmountInPaise: 1250000,
    paymentMethod: "ONLINE_PAY",
    orderStatus: "PROCESSING",
    paymentStatus: "PAID",
    shippingAddress: {
      fullName: "Alice Smith",
      mobileNumber: "9876543210",
      streetAddress: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    billingAddress: {
      fullName: "Alice Smith",
      mobileNumber: "9876543210",
      streetAddress: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    billingSameAsShipping: true,
    createdAt: "2021-05-10T10:30:00.000Z",
  },
  {
    _id: "order_2",
    orderNumber: "ABC-6457326",
    items: [
      {
        bookListing: "6",
        title: "Two-seater wooden polished dinning table",
        priceInPaise: 899900,
        quantity: 1,
        subtotalInPaise: 899900,
      },
    ],
    subtotalInPaise: 899900,
    deliveryChargeInPaise: 0,
    couponDiscountInPaise: 0,
    totalAmountInPaise: 899900,
    paymentMethod: "CASH_ON_DELIVERY",
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    shippingAddress: {
      fullName: "Bob Jones",
      mobileNumber: "9876543211",
      streetAddress: "456 Oak St",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    },
    billingAddress: {
      fullName: "Bob Jones",
      mobileNumber: "9876543211",
      streetAddress: "456 Oak St",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    },
    billingSameAsShipping: true,
    createdAt: "2021-05-10T15:00:00.000Z",
  },
];

// Mock useOrdersQuery hook
vi.mock("@/features/orders/queries/use-orders-query", () => ({
  useOrdersQuery: vi.fn(),
}));

import { useOrdersQuery } from "@/features/orders/queries/use-orders-query";

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Orders UI Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("OrderCard", () => {
    it("renders order ID, price, status badge, and item titles correctly", () => {
      renderWithClient(<OrderCard order={mockOrders[0]} />);

      expect(screen.getByText("Order ID: ABC-6457325")).toBeInTheDocument();
      expect(screen.getByText("Processing")).toBeInTheDocument();
      expect(screen.getByText("₹ 12,500")).toBeInTheDocument();
      expect(screen.getByText("+4")).toBeInTheDocument(); // 5 items total: 1 shown + 4 other items in badge
      expect(screen.getByText(/& 2 more items/)).toBeInTheDocument();
    });


    it("renders single item order without extra badge", () => {
      renderWithClient(<OrderCard order={mockOrders[1]} />);

      expect(screen.getByText("Order ID: ABC-6457326")).toBeInTheDocument();
      expect(screen.getByText("Delivered")).toBeInTheDocument();
      expect(screen.getByText("₹ 8,999")).toBeInTheDocument();
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /cancel order/i })).not.toBeInTheDocument();
    });

    it("shows cancel order button for in-progress orders and opens modal on click", () => {
      renderWithClient(<OrderCard order={mockOrders[0]} />);

      const cancelBtn = screen.getByRole("button", { name: /cancel order/i });
      expect(cancelBtn).toBeInTheDocument();

      fireEvent.click(cancelBtn);

      expect(screen.getByText(/Cancel Order #ABC-6457325/i)).toBeInTheDocument();
      expect(screen.getByText(/Reason for cancellation/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Keep Order" })).toBeInTheDocument();
    });
  });

  describe("OrderStatusTabs", () => {
    it("highlights the active tab and triggers callback on click", () => {
      const handleSelect = vi.fn();
      render(
        <OrderStatusTabs selectedTab="ALL" onSelectTab={handleSelect} />,
      );

      const inProgressBtn = screen.getByRole("tab", { name: "In Progress" });
      fireEvent.click(inProgressBtn);

      expect(handleSelect).toHaveBeenCalledWith("IN_PROGRESS");
    });
  });

  describe("OrdersPage Integration", () => {
    it("renders orders list successfully", () => {
      vi.mocked(useOrdersQuery).mockReturnValue({
        data: {
          success: true,
          message: "Orders retrieved",
          data: mockOrders,
          meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        isRefetching: false,
      } as any);

      renderWithClient(<OrdersPage />);

      expect(screen.getByTestId("category-banner")).toHaveTextContent("My Orders");
      expect(screen.getByText("Order ID: ABC-6457325")).toBeInTheDocument();
      expect(screen.getByText("Order ID: ABC-6457326")).toBeInTheDocument();
    });

    it("displays empty state when no orders match filter", () => {
      vi.mocked(useOrdersQuery).mockReturnValue({
        data: {
          success: true,
          message: "Orders retrieved",
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        isRefetching: false,
      } as any);

      renderWithClient(<OrdersPage />);

      expect(screen.getByText("No Orders Placed Yet")).toBeInTheDocument();
    });
  });
});
