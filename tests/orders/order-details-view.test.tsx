import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderDetailsView } from "@/features/orders/components/order-details-view";
import type { Order } from "@/features/orders/types/order.types";

// Mock CategoryBanner
vi.mock("@/components/categories/components/CategoryBanner", () => ({
  CategoryBanner: ({ categoryName }: { categoryName: string }) => (
    <div data-testid="category-banner">{categoryName}</div>
  ),
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="mock-image" />
  ),
}));

// Mock useOrderDetailQuery hook
vi.mock("@/features/orders/queries/use-order-detail-query", () => ({
  useOrderDetailQuery: vi.fn(),
}));

import { useOrderDetailQuery } from "@/features/orders/queries/use-order-detail-query";

const mockOrderDetail: Order = {
  _id: "67d3fa89b33a8274092b71ab",
  orderNumber: "ORD-987654",
  items: [
    {
      bookListing: "book_1",
      title: "Clean Code",
      priceInPaise: 45000,
      quantity: 2,
      subtotalInPaise: 90000,
      coverImage: "/assets/cover-code.jpg",
    },
    {
      bookListing: "book_2",
      title: "The Pragmatic Programmer",
      priceInPaise: 60000,
      quantity: 1,
      subtotalInPaise: 60000,
    },
  ],
  subtotalInPaise: 150000,
  deliveryChargeInPaise: 5000,
  couponDiscountInPaise: 10000,
  couponCode: "SAVE100",
  totalAmountInPaise: 145000,
  paymentMethod: "ONLINE_PAY",
  orderStatus: "SHIPPED",
  paymentStatus: "PAID",
  refundStatus: "NONE",
  shippingAddress: {
    fullName: "Jane Doe",
    mobileNumber: "9876543210",
    streetAddress: "42 Galaxy Way",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
  },
  billingAddress: {
    fullName: "Jane Doe",
    mobileNumber: "9876543210",
    streetAddress: "42 Galaxy Way",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
  },
  billingSameAsShipping: true,
  createdAt: "2026-09-10T12:00:00.000Z",
};

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("OrderDetailsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders CategoryBanner with 'Order Details'", () => {
    vi.mocked(useOrderDetailQuery).mockReturnValue({
      data: { success: true, message: "Order found", data: mockOrderDetail },
      isLoading: false,
      isError: false,
    } as any);

    renderWithClient(<OrderDetailsView orderId="67d3fa89b33a8274092b71ab" />);

    expect(screen.getByTestId("category-banner")).toHaveTextContent(
      "Order Details",
    );
  });

  it("renders order details correctly when data is loaded", () => {
    vi.mocked(useOrderDetailQuery).mockReturnValue({
      data: { success: true, message: "Order found", data: mockOrderDetail },
      isLoading: false,
      isError: false,
    } as any);

    renderWithClient(<OrderDetailsView orderId="67d3fa89b33a8274092b71ab" />);

    expect(screen.getByText("ORD-987654")).toBeInTheDocument();
    expect(screen.getAllByText("Shipped").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Clean Code/)).toBeInTheDocument();
    expect(screen.getByText(/The Pragmatic Programmer/)).toBeInTheDocument();
    expect(screen.getByText(/View all items/i)).toBeInTheDocument();
    expect(screen.getByText("Delivery Address")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    expect(screen.getByText("Discount (SAVE100)")).toBeInTheDocument();
    expect(screen.getByText("Back to My Orders")).toBeInTheDocument();
  });

  it("shows not found state on error or missing order", () => {
    vi.mocked(useOrderDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    renderWithClient(<OrderDetailsView orderId="invalid_id" />);

    expect(screen.getByTestId("category-banner")).toHaveTextContent(
      "Order Details",
    );
    expect(screen.getByText("Order Not Found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to orders/i })).toBeInTheDocument();
  });

  it("shows cancelled message if order status is CANCELLED", () => {
    const cancelledOrder: Order = {
      ...mockOrderDetail,
      orderStatus: "CANCELLED",
    };

    vi.mocked(useOrderDetailQuery).mockReturnValue({
      data: { success: true, message: "Order found", data: cancelledOrder },
      isLoading: false,
      isError: false,
    } as any);

    renderWithClient(<OrderDetailsView orderId="67d3fa89b33a8274092b71ab" />);

    expect(screen.getByText("This order has been cancelled.")).toBeInTheDocument();
  });
});
