import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import type { OrderItemDisplay } from "@/components/checkout/order-item-row";

describe("CheckoutOrderSummary - Optimistic Quantity Updates", () => {
  const initialItems: OrderItemDisplay[] = [
    {
      bookListingId: "listing-001",
      title: "Clean Architecture",
      author: "Robert C. Martin",
      price: 500,
      sellingPriceInPaise: 50000,
      quantity: 1,
      stockAvailable: 10,
      isAvailable: true,
    },
    {
      bookListingId: "listing-002",
      title: "Refactoring",
      author: "Martin Fowler",
      price: 600,
      sellingPriceInPaise: 60000,
      quantity: 2,
      stockAvailable: 5,
      isAvailable: true,
    },
  ];

  it("optimistically increments item quantity, badge count, subtotal, and total", async () => {
    let resolveUpdate: () => void = () => {};
    const mockUpdateQuantity = vi.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });
    });

    render(
      <CheckoutOrderSummary
        items={initialItems}
        subtotal={1700}
        mrpSavings={200}
        couponCode=""
        onCouponCodeChange={vi.fn()}
        appliedCoupon={null}
        couponDiscount={0}
        onApplyPromo={vi.fn()}
        onRemovePromo={vi.fn()}
        paymentMethod="online"
        onPaymentMethodChange={vi.fn()}
        acceptedTerms={true}
        onAcceptedTermsChange={vi.fn()}
        isProcessing={false}
        onProceed={vi.fn()}
        onUpdateQuantity={mockUpdateQuantity}
        deliveryCharge={50}
      />,
    );

    // Initial check: 1 + 2 = 3 items total. Total = 1700 + 50 = 1750
    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText("₹1750.00")).toBeInTheDocument();

    // Find increase button for the first item (quantity: 1)
    const increaseButtons = screen.getAllByRole("button", { name: "Increase quantity" });
    const firstItemIncrease = increaseButtons[0];

    // Click increase
    fireEvent.click(firstItemIncrease);

    // Verify onUpdateQuantity was called with listing-001 and quantity 2
    expect(mockUpdateQuantity).toHaveBeenCalledWith("listing-001", 2);

    // Optimistic UI checks: immediate change to 4 items and total 1750 + 500 = 2250 (1700 + 500 subtotal + 50 delivery)
    await waitFor(() => {
      expect(screen.getByText("4 items")).toBeInTheDocument();
      expect(screen.getByText("₹2250.00")).toBeInTheDocument();
    });

    // Resolve network request
    await act(async () => {
      resolveUpdate();
    });
  });

  it("optimistically decrements item quantity, badge count, subtotal, and total", async () => {
    let resolveUpdate: () => void = () => {};
    const mockUpdateQuantity = vi.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      });
    });

    render(
      <CheckoutOrderSummary
        items={initialItems}
        subtotal={1700}
        mrpSavings={200}
        couponCode=""
        onCouponCodeChange={vi.fn()}
        appliedCoupon={null}
        couponDiscount={0}
        onApplyPromo={vi.fn()}
        onRemovePromo={vi.fn()}
        paymentMethod="online"
        onPaymentMethodChange={vi.fn()}
        acceptedTerms={true}
        onAcceptedTermsChange={vi.fn()}
        isProcessing={false}
        onProceed={vi.fn()}
        onUpdateQuantity={mockUpdateQuantity}
        deliveryCharge={50}
      />,
    );

    // Second item has quantity 2 (price: 600)
    const decreaseButtons = screen.getAllByRole("button", { name: "Decrease quantity" });
    const secondItemDecrease = decreaseButtons[1];

    // Click decrease on second item (2 -> 1)
    fireEvent.click(secondItemDecrease);

    // Verify onUpdateQuantity was called with listing-002 and quantity 1
    expect(mockUpdateQuantity).toHaveBeenCalledWith("listing-002", 1);

    // Optimistic UI checks: 3 items -> 2 items. Total: 1750 - 600 = 1150
    await waitFor(() => {
      expect(screen.getByText("2 items")).toBeInTheDocument();
      expect(screen.getByText("₹1150.00")).toBeInTheDocument();
    });

    await act(async () => {
      resolveUpdate();
    });
  });

  it("renders authoritative totalAmount on CTA button and coupon message badge", () => {
    render(
      <CheckoutOrderSummary
        items={initialItems}
        subtotal={4000}
        totalAmount={3950}
        mrpSavings={1045}
        couponCode="FLAT50"
        onCouponCodeChange={vi.fn()}
        appliedCoupon="FLAT50"
        couponDiscount={50}
        couponMessage="Flat ₹50 off on orders above ₹300"
        isCouponValid={true}
        onApplyPromo={vi.fn()}
        onRemovePromo={vi.fn()}
        paymentMethod="online"
        onPaymentMethodChange={vi.fn()}
        acceptedTerms={true}
        onAcceptedTermsChange={vi.fn()}
        isProcessing={false}
        canCheckout={true}
        deliveryCharge={0}
        onProceed={vi.fn()}
      />,
    );

    // Coupon message badge is directly displayed
    expect(screen.getByText("Flat ₹50 off on orders above ₹300")).toBeInTheDocument();
    expect(screen.getByText("Saved ₹50.00")).toBeInTheDocument();

    // CTA button uses the authoritative total
    expect(screen.getByRole("button", { name: /Pay Securely Now • ₹3950\.00/i })).toBeInTheDocument();
  });

  it("disables CTA button and displays issues when canCheckout is false", () => {
    const issues = [
      { code: "OUT_OF_STOCK" as const, message: "Feluda Vol. 1 is currently out of stock" },
    ];

    render(
      <CheckoutOrderSummary
        items={initialItems}
        subtotal={4000}
        totalAmount={3950}
        mrpSavings={1045}
        couponCode=""
        onCouponCodeChange={vi.fn()}
        appliedCoupon={null}
        couponDiscount={0}
        onApplyPromo={vi.fn()}
        onRemovePromo={vi.fn()}
        paymentMethod="online"
        onPaymentMethodChange={vi.fn()}
        acceptedTerms={true}
        onAcceptedTermsChange={vi.fn()}
        isProcessing={false}
        canCheckout={false}
        checkoutIssues={issues}
        deliveryCharge={0}
        onProceed={vi.fn()}
      />,
    );

    // Issues alert is displayed
    expect(screen.getByText("Feluda Vol. 1 is currently out of stock")).toBeInTheDocument();

    // Button shows Resolve Issues and is disabled
    const ctaButton = screen.getByRole("button", { name: /Resolve Issues to Continue/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toBeDisabled();
  });
});

