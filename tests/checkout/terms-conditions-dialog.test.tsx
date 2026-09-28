import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TermsConditionsDialog } from "@/components/checkout/terms-conditions-dialog";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";

describe("TermsConditionsDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders terms and conditions modal content when open", () => {
    const handleOpenChange = vi.fn();
    const handleAccept = vi.fn();

    render(
      <TermsConditionsDialog
        open={true}
        onOpenChange={handleOpenChange}
        onAccept={handleAccept}
      />,
    );

    expect(screen.getByRole("heading", { name: "Terms & Conditions" })).toBeInTheDocument();
    expect(
      screen.getByText("Standard terms governing order fulfillment and purchases."),
    ).toBeInTheDocument();
    expect(screen.getByText("1. Orders & Pricing")).toBeInTheDocument();
    expect(screen.getByText("2. Shipping & Delivery")).toBeInTheDocument();
    expect(screen.getByText("3. Cancellation & Returns")).toBeInTheDocument();
    expect(screen.getByText("4. Payment & Privacy")).toBeInTheDocument();
  });

  it("handles close button click", () => {
    const handleOpenChange = vi.fn();

    render(
      <TermsConditionsDialog
        open={true}
        onOpenChange={handleOpenChange}
      />,
    );

    const [closeBtn] = screen.getAllByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles accept terms button click", () => {
    const handleOpenChange = vi.fn();
    const handleAccept = vi.fn();

    render(
      <TermsConditionsDialog
        open={true}
        onOpenChange={handleOpenChange}
        onAccept={handleAccept}
      />,
    );

    const acceptBtn = screen.getByRole("button", { name: "Accept Terms" });
    fireEvent.click(acceptBtn);

    expect(handleAccept).toHaveBeenCalledTimes(1);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("opens modal from CheckoutOrderSummary and accepts terms", () => {
    function TestSummaryWrapper() {
      const [accepted, setAccepted] = useState(false);

      return (
        <CheckoutOrderSummary
          items={[]}
          subtotal={500}
          mrpSavings={50}
          couponCode=""
          onCouponCodeChange={vi.fn()}
          appliedCoupon={null}
          couponDiscount={0}
          onApplyPromo={vi.fn()}
          onRemovePromo={vi.fn()}
          paymentMethod="cod"
          onPaymentMethodChange={vi.fn()}
          acceptedTerms={accepted}
          onAcceptedTermsChange={setAccepted}
          isProcessing={false}
          onProceed={vi.fn()}
        />
      );
    }

    render(<TestSummaryWrapper />);

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    // Click "Terms & Conditions" link button
    const termsTrigger = screen.getByRole("button", { name: "Terms & Conditions" });
    fireEvent.click(termsTrigger);

    // Modal should now be open
    expect(screen.getByRole("heading", { name: "Terms & Conditions" })).toBeInTheDocument();

    // Click "Accept Terms" inside modal
    const acceptBtn = screen.getByRole("button", { name: "Accept Terms" });
    fireEvent.click(acceptBtn);

    // Checkbox should now be checked
    expect(checkbox.checked).toBe(true);
  });
});
