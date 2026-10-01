import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BillingAddressModal } from "@/components/checkout/billing-address-modal";
import { ShippingAddressModal } from "@/components/checkout/shipping-address-modal";
import type { Address } from "@/features/addresses";

const mockInitialUser = {
  name: "John Doe",
  email: "john@example.com",
  mobileNumber: "9876543210",
};

const mockBillingAddress: Address = {
  _id: "billing_addr_1",
  user: "u1",
  addressType: "BILLING",
  fullName: "Alice Billing",
  email: "alice@example.com",
  mobileNumber: "9123456789",
  country: "India",
  state: "West Bengal",
  city: "Kolkata",
  postalCode: "700001",
  streetAddress: "123 Billing Street",
  apartment: "Flat 4A",
  isDefault: true,
};

const mockShippingAddress: Address = {
  _id: "shipping_addr_1",
  user: "u1",
  addressType: "SHIPPING",
  fullName: "Bob Shipping",
  email: "bob@example.com",
  mobileNumber: "9988776655",
  country: "India",
  state: "West Bengal",
  city: "Howrah",
  postalCode: "711101",
  streetAddress: "456 Delivery Lane",
  apartment: "Building B",
  isDefault: false,
};

describe("Separate Address Modals", () => {
  describe("BillingAddressModal", () => {
    it("renders dedicated add billing address modal without shipping tabs", () => {
      render(
        <BillingAddressModal
          isOpen={true}
          onClose={vi.fn()}
          initialUser={mockInitialUser}
        />,
      );

      // Title & description specific to billing
      expect(screen.getByText("Add Billing Address")).toBeInTheDocument();
      expect(
        screen.getByText("Enter your billing details for invoicing and payment receipts."),
      ).toBeInTheDocument();

      // No tab bar or Option B shipping tabs
      expect(screen.queryByText(/Option A/i)).toBeNull();
      expect(screen.queryByText(/Option B/i)).toBeNull();
      expect(screen.queryByText(/Use as shipping address/i)).toBeNull();

      // Submit button text
      expect(
        screen.getByRole("button", { name: /Save Billing Address/i }),
      ).toBeInTheDocument();
    });

    it("pre-fills existing billing address when editing", () => {
      render(
        <BillingAddressModal
          isOpen={true}
          onClose={vi.fn()}
          addressToEdit={mockBillingAddress}
        />,
      );

      expect(screen.getByText("Edit Billing Address")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Alice Billing")).toBeInTheDocument();
      expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123 Billing Street")).toBeInTheDocument();
    });

    it("submits with addressType BILLING", async () => {
      const mockSubmit = vi.fn().mockResolvedValue({ success: true });
      const mockClose = vi.fn();

      render(
        <BillingAddressModal
          isOpen={true}
          onClose={mockClose}
          initialUser={mockInitialUser}
          onSubmit={mockSubmit}
        />,
      );

      // Fill in required address fields
      fireEvent.change(screen.getByPlaceholderText(/Building, street, and area/i), {
        target: { value: "789 Park Street" },
      });
      fireEvent.change(screen.getByPlaceholderText(/e.g. Kolkata/i), {
        target: { value: "Kolkata" },
      });
      fireEvent.change(screen.getByPlaceholderText(/e.g. 700001/i), {
        target: { value: "700016" },
      });

      const submitBtn = screen.getByRole("button", { name: /Save Billing Address/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            addressType: "BILLING",
            fullName: "John Doe",
            city: "Kolkata",
            postalCode: "700016",
            streetAddress: "789 Park Street",
          }),
          undefined,
        );
      });
    });
  });

  describe("ShippingAddressModal", () => {
    it("renders dedicated add shipping address modal without billing tabs", () => {
      render(
        <ShippingAddressModal
          isOpen={true}
          onClose={vi.fn()}
          initialUser={mockInitialUser}
        />,
      );

      // Title & description specific to shipping
      expect(screen.getByText("Add Shipping Address")).toBeInTheDocument();
      expect(
        screen.getByText("Enter the delivery address where your books should be shipped."),
      ).toBeInTheDocument();

      // No tab bar or Option A billing tabs
      expect(screen.queryByText(/Option A/i)).toBeNull();
      expect(screen.queryByText(/Option B/i)).toBeNull();

      // Submit button text
      expect(
        screen.getByRole("button", { name: /Save Shipping Address/i }),
      ).toBeInTheDocument();
    });

    it("pre-fills existing shipping address when editing", () => {
      render(
        <ShippingAddressModal
          isOpen={true}
          onClose={vi.fn()}
          addressToEdit={mockShippingAddress}
        />,
      );

      expect(screen.getByText("Edit Shipping Address")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Bob Shipping")).toBeInTheDocument();
      expect(screen.getByDisplayValue("bob@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("456 Delivery Lane")).toBeInTheDocument();
    });

    it("submits with addressType SHIPPING", async () => {
      const mockSubmit = vi.fn().mockResolvedValue({ success: true });
      const mockClose = vi.fn();

      render(
        <ShippingAddressModal
          isOpen={true}
          onClose={mockClose}
          initialUser={mockInitialUser}
          onSubmit={mockSubmit}
        />,
      );

      fireEvent.change(screen.getByPlaceholderText(/Building, street, and area/i), {
        target: { value: "321 Shipping Way" },
      });
      fireEvent.change(screen.getByPlaceholderText(/e.g. Kolkata/i), {
        target: { value: "Howrah" },
      });
      fireEvent.change(screen.getByPlaceholderText(/e.g. 700001/i), {
        target: { value: "711102" },
      });

      const submitBtn = screen.getByRole("button", { name: /Save Shipping Address/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            addressType: "SHIPPING",
            fullName: "John Doe",
            city: "Howrah",
            postalCode: "711102",
            streetAddress: "321 Shipping Way",
          }),
          undefined,
        );
      });
    });
  });
});
