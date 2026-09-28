import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderItemsList } from "@/features/orders/components/order-items-list";
import type { OrderItem } from "@/features/orders/types/order.types";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="mock-item-image" />
  ),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
  );
}

describe("OrderItemsList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems: OrderItem[] = [
    {
      _id: "item_seller_a",
      bookListing: "listing_1",
      title: "Clean Architecture",
      priceInPaise: 45000,
      quantity: 1,
      subtotalInPaise: 45000,
      status: "SHIPPED",
      seller: { _id: "seller_a", name: "Seller A Books" },
      tracking: {
        courier: "Blue Dart",
        trackingNumber: "BD-10294",
        trackingUrl: "https://bluedart.com/track/BD-10294",
      },
      estimatedDeliveryDate: "2026-10-02T00:00:00.000Z",
    },
    {
      _id: "item_seller_b",
      bookListing: "listing_2",
      title: "Designing Data-Intensive Applications",
      priceInPaise: 75000,
      quantity: 1,
      subtotalInPaise: 75000,
      status: "CONFIRMED",
      seller: { _id: "seller_b", name: "Tech Books Direct" },
      estimatedDeliveryDate: "2026-10-07T00:00:00.000Z",
    },
  ];

  it("renders packages and items with individual statuses and sellers", () => {
    renderWithClient(
      <OrderItemsList
        items={mockItems}
        orderId="ord_123"
        orderNumber="ORD-10294"
        orderStatus="PARTIALLY_SHIPPED"
      />,
    );

    expect(screen.getByText("Packages & Items in Order (2)")).toBeInTheDocument();
    expect(screen.getByText("Clean Architecture")).toBeInTheDocument();
    expect(screen.getByText("Designing Data-Intensive Applications")).toBeInTheDocument();
    expect(screen.getByText("Seller A Books")).toBeInTheDocument();
    expect(screen.getByText("Tech Books Direct")).toBeInTheDocument();
  });

  it("displays courier tracking badge and link for shipped items", () => {
    renderWithClient(
      <OrderItemsList
        items={mockItems}
        orderId="ord_123"
        orderNumber="ORD-10294"
        orderStatus="PARTIALLY_SHIPPED"
      />,
    );

    expect(screen.getByText(/Blue Dart/)).toBeInTheDocument();
    expect(screen.getByText(/#BD-10294/)).toBeInTheDocument();
  });

  it("renders Cancel Item button only for eligible non-shipped items", () => {
    renderWithClient(
      <OrderItemsList
        items={mockItems}
        orderId="ord_123"
        orderNumber="ORD-10294"
        orderStatus="PARTIALLY_SHIPPED"
        allowItemCancellation
      />,
    );

    // Only Item B (CONFIRMED) is eligible; Item A (SHIPPED) is blocked
    const cancelButtons = screen.getAllByRole("button", { name: /Cancel Item/i });
    expect(cancelButtons).toHaveLength(1);
  });

  it("opens cancel dialog for the specific targeted item when Cancel Item is clicked", () => {
    renderWithClient(
      <OrderItemsList
        items={mockItems}
        orderId="ord_123"
        orderNumber="ORD-10294"
        orderStatus="PARTIALLY_SHIPPED"
        allowItemCancellation
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: /Cancel Item/i });
    fireEvent.click(cancelBtn);

    expect(
      screen.getByText(/Cancel Item: Designing Data-Intensive Applications/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Other items in your order will continue fulfillment/),
    ).toBeInTheDocument();
  });
});
