import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SellerOrdersView } from "@/features/seller/components/orders/seller-orders-view";
import { AdminTopNav } from "@/components/books/components/AdminTopNav";
import { RecentOrdersFeed } from "@/features/seller/components/recent-orders-feed";
import * as sellerApi from "@/features/seller/api/seller.api";
import type { SellerOrdersResponse, SellerRecentOrdersResponse } from "@/features/seller/types/seller.types";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/seller-orders",
}));

vi.mock("@/features/auth", () => ({
  useCurrentUser: () => ({ data: { name: "Seller Mohan", role: "SELLER" } }),
  useLogoutModalStore: (selector: (state: { open: () => void }) => unknown) =>
    selector({ open: vi.fn() }),
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

const mockOrdersResponse: SellerOrdersResponse = {
  success: true,
  message: "Seller orders retrieved successfully",
  data: [
    {
      _id: "ord_101",
      orderNumber: "ORD-9842",
      orderStatus: "PROCESSING",
      overallOrderStatus: "PROCESSING",
      sellerSubtotalInPaise: 65000,
      paymentStatus: "PAID",
      paymentMethod: "ONLINE_PAY",
      createdAt: "2026-09-28T08:30:00Z",
      buyer: {
        _id: "usr_1",
        name: "Rahim Chowdhury",
        email: "rahim@example.com",
      },
      shippingAddress: {
        fullName: "Rahim Chowdhury",
        mobileNumber: "+919876543210",
        streetAddress: "123 Green Road",
        city: "Dhaka",
        state: "Dhaka Division",
        postalCode: "1205",
        country: "Bangladesh",
      },
      items: [
        {
          _id: "item_1",
          bookListing: "lst_1",
          book: "bk_1",
          title: "Gitanjali (Rabindranath Tagore)",
          priceInPaise: 65000,
          quantity: 1,
          subtotalInPaise: 65000,
          status: "PROCESSING",
        },
      ],
    },
    {
      _id: "ord_102",
      orderNumber: "ORD-9843",
      orderStatus: "DELIVERED",
      overallOrderStatus: "DELIVERED",
      sellerSubtotalInPaise: 120000,
      paymentStatus: "PAID",
      paymentMethod: "CASH_ON_DELIVERY",
      createdAt: "2026-09-25T11:00:00Z",
      buyer: {
        _id: "usr_2",
        name: "Sunita Roy",
        email: "sunita@example.com",
      },
      shippingAddress: {
        fullName: "Sunita Roy",
        mobileNumber: "+919876543211",
        streetAddress: "45 Salt Lake",
        city: "Kolkata",
        state: "West Bengal",
        postalCode: "700064",
        country: "India",
      },
      items: [
        {
          _id: "item_2",
          bookListing: "lst_2",
          book: "bk_2",
          title: "Pather Panchali",
          priceInPaise: 120000,
          quantity: 1,
          subtotalInPaise: 120000,
          status: "DELIVERED",
        },
      ],
    },
  ],
  meta: {
    page: 1,
    limit: 20,
    total: 2,
    totalPages: 1,
  },
};

describe("Seller Orders View & Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders AdminTopNav with active orders tab pointing to /seller-orders", () => {
    render(<AdminTopNav activeTab="orders" />, { wrapper: createTestWrapper() });

    const ordersTabLink = screen.getByRole("link", { name: /orders/i });
    expect(ordersTabLink).toBeInTheDocument();
    expect(ordersTabLink).toHaveAttribute("href", "/seller-orders");
    expect(ordersTabLink).toHaveAttribute("aria-current", "page");
  });

  it("renders View All Orders link pointing to /seller-orders in RecentOrdersFeed", () => {
    const mockRecentOrders: SellerRecentOrdersResponse = {
      success: true,
      message: "Success",
      data: {
        summary: {
          month: "September 2026",
          totalOrdersInMonth: 10,
          totalSellerEarningsInRupees: 5000,
          totalSellerEarningsInPaise: 500000,
        },
        recentOrders: [],
      },
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };

    vi.spyOn(sellerApi, "getSellerRecentOrders").mockResolvedValue(mockRecentOrders);

    render(<RecentOrdersFeed />, { wrapper: createTestWrapper() });

    const viewAllLink = screen.getByRole("link", { name: /view all orders/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute("href", "/seller-orders");
  });

  it("renders SellerOrdersView with filter sidebar and order cards", async () => {
    vi.spyOn(sellerApi, "getSellerOrders").mockResolvedValue(mockOrdersResponse);

    render(<SellerOrdersView />, { wrapper: createTestWrapper() });

    // Header & Filter Sidebar
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/order id, buyer name/i)).toBeInTheDocument();
    expect(screen.getByText("Fulfillment Status")).toBeInTheDocument();
    expect(screen.getByText("Date Placed")).toBeInTheDocument();
    expect(screen.getByText("Payment Method")).toBeInTheDocument();

    // Order cards loaded from API
    await waitFor(() => {
      expect(screen.getByText("#ORD-9842")).toBeInTheDocument();
      expect(screen.getByText("#ORD-9843")).toBeInTheDocument();
    });

    expect(screen.getByText("Rahim Chowdhury")).toBeInTheDocument();
    expect(screen.getByText("Gitanjali (Rabindranath Tagore)")).toBeInTheDocument();
    expect(screen.getByText("Sunita Roy")).toBeInTheDocument();
    expect(screen.getByText("Pather Panchali")).toBeInTheDocument();

    // Earnings check
    expect(screen.getByText("650.00")).toBeInTheDocument();
    expect(screen.getByText("1,200.00")).toBeInTheDocument();
  });

  it("filters orders client-side when search text is entered", async () => {
    vi.spyOn(sellerApi, "getSellerOrders").mockResolvedValue(mockOrdersResponse);

    render(<SellerOrdersView />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText("#ORD-9842")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/order id, buyer name/i);
    fireEvent.change(searchInput, { target: { value: "Sunita" } });

    // Only Sunita's order should remain
    expect(screen.getByText("#ORD-9843")).toBeInTheDocument();
    expect(screen.queryByText("#ORD-9842")).not.toBeInTheDocument();
  });

  it("opens status dialog when Update Status button is clicked", async () => {
    vi.spyOn(sellerApi, "getSellerOrders").mockResolvedValue(mockOrdersResponse);

    render(<SellerOrdersView />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText("#ORD-9842")).toBeInTheDocument();
    });

    const updateButtons = screen.getAllByRole("button", { name: /update status/i });
    fireEvent.click(updateButtons[0]);

    // Modal opens showing Order #ORD-9842
    await waitFor(() => {
      expect(screen.getByText("Order #ORD-9842")).toBeInTheDocument();
    });
  });

  it("renders empty state illustration and message when no orders are found", async () => {
    vi.spyOn(sellerApi, "getSellerOrders").mockResolvedValue({
      success: true,
      message: "No orders",
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
    });

    render(<SellerOrdersView />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByAltText(/illustration of empty orders/i)).toBeInTheDocument();
      expect(screen.getByText(/no orders yet/i)).toBeInTheDocument();
    });
  });
});
