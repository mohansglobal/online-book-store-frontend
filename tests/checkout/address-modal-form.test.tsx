import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddressModalForm } from "@/components/checkout/address-modal-form";

describe("AddressModalForm - Billing & Shipping separation", () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits BOTH Option A (billing) and Option B (shipping) when user fills both tabs", async () => {
    mockOnSubmit.mockResolvedValue({ success: true });

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        defaultType="BILLING"
        onSubmit={mockOnSubmit}
      />,
    );

    // 1. In Billing tab, enter Option A
    const fullNameInput = screen.getByPlaceholderText("e.g. Soumya Roy");
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const mobileInput = screen.getByPlaceholderText("+91 or 10-digit number");
    const cityInput = screen.getByPlaceholderText("e.g. Kolkata");
    const pinInput = screen.getByPlaceholderText("e.g. 700001");
    const streetInput = screen.getByPlaceholderText("Building, street, and area");

    fireEvent.change(fullNameInput, { target: { value: "Billing Option A" } });
    fireEvent.change(emailInput, { target: { value: "billing@example.com" } });
    fireEvent.change(mobileInput, { target: { value: "9876543210" } });
    fireEvent.change(cityInput, { target: { value: "Kolkata" } });
    fireEvent.change(pinInput, { target: { value: "700001" } });
    fireEvent.change(streetInput, { target: { value: "123 Billing Street" } });

    // 2. Click the Shipping Address tab
    const shippingTab = screen.getByRole("button", { name: /shipping address/i });
    fireEvent.click(shippingTab);

    // 3. In Shipping tab, type Option B
    fireEvent.change(screen.getByPlaceholderText("e.g. Soumya Roy"), {
      target: { value: "Shipping Option B" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "shipping@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("+91 or 10-digit number"), {
      target: { value: "9123456780" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Kolkata"), {
      target: { value: "Howrah" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 700001"), {
      target: { value: "711101" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building, street, and area"), {
      target: { value: "456 Shipping Lane" },
    });

    // 4. Click Save Both Addresses
    const saveButton = screen.getByRole("button", { name: /save both addresses/i });
    fireEvent.click(saveButton);

    // 5. Verify that BOTH Option A and Option B are submitted!
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(2);
    });

    expect(mockOnSubmit).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        addressType: "BILLING",
        fullName: "Billing Option A",
        streetAddress: "123 Billing Street",
        city: "Kolkata",
        postalCode: "700001",
      }),
    );

    expect(mockOnSubmit).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        addressType: "SHIPPING",
        fullName: "Shipping Option B",
        streetAddress: "456 Shipping Lane",
        city: "Howrah",
        postalCode: "711101",
      }),
    );

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("submits single billing address when useAsShipping remains checked", async () => {
    mockOnSubmit.mockResolvedValue({ success: true });

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        defaultType="BILLING"
        onSubmit={mockOnSubmit}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("e.g. Soumya Roy"), {
      target: { value: "Single Billing User" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("+91 or 10-digit number"), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Kolkata"), {
      target: { value: "Kolkata" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 700001"), {
      target: { value: "700001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building, street, and area"), {
      target: { value: "789 Single Street" },
    });

    const saveButton = screen.getByRole("button", { name: /save address/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        addressType: "BILLING",
        fullName: "Single Billing User",
        streetAddress: "789 Single Street",
      }),
    );

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("submits atomically via onDualSubmit with separate billing and shipping payloads", async () => {
    const mockOnDualSubmit = vi.fn().mockResolvedValue({ success: true });

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        defaultType="BILLING"
        onDualSubmit={mockOnDualSubmit}
      />,
    );

    // Enter Option A in Billing
    fireEvent.change(screen.getByPlaceholderText("e.g. Soumya Roy"), {
      target: { value: "Option A Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "optiona@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("+91 or 10-digit number"), {
      target: { value: "9800000001" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Kolkata"), {
      target: { value: "Kolkata" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 700001"), {
      target: { value: "700001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building, street, and area"), {
      target: { value: "Option A Street 123" },
    });

    // Switch to Shipping tab
    fireEvent.click(screen.getByRole("button", { name: /shipping address/i }));

    // Enter Option B in Shipping
    fireEvent.change(screen.getByPlaceholderText("e.g. Soumya Roy"), {
      target: { value: "Option B Name" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "optionb@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("+91 or 10-digit number"), {
      target: { value: "9800000002" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Kolkata"), {
      target: { value: "Mumbai" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 700001"), {
      target: { value: "400001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building, street, and area"), {
      target: { value: "Option B Street 456" },
    });

    // Click Save Both Addresses
    fireEvent.click(screen.getByRole("button", { name: /save both addresses/i }));

    await waitFor(() => {
      expect(mockOnDualSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnDualSubmit).toHaveBeenCalledWith({
      sameAsBilling: false,
      billing: expect.objectContaining({
        fullName: "Option A Name",
        email: "optiona@example.com",
        mobileNumber: "9800000001",
        city: "Kolkata",
        postalCode: "700001",
        streetAddress: "Option A Street 123",
      }),
      shipping: expect.objectContaining({
        fullName: "Option B Name",
        email: "optionb@example.com",
        mobileNumber: "9800000002",
        city: "Mumbai",
        postalCode: "400001",
        streetAddress: "Option B Street 456",
      }),
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("submits atomically via onDualSubmit with sameAsBilling: true when shipping is unchecked", async () => {
    const mockOnDualSubmit = vi.fn().mockResolvedValue({ success: true });

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        defaultType="BILLING"
        onDualSubmit={mockOnDualSubmit}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("e.g. Soumya Roy"), {
      target: { value: "Option A Only" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "optiona@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("+91 or 10-digit number"), {
      target: { value: "9800000001" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Kolkata"), {
      target: { value: "Kolkata" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 700001"), {
      target: { value: "700001" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building, street, and area"), {
      target: { value: "Option A Street 123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save address/i }));

    await waitFor(() => {
      expect(mockOnDualSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnDualSubmit).toHaveBeenCalledWith({
      sameAsBilling: true,
      billing: expect.objectContaining({
        fullName: "Option A Only",
        streetAddress: "Option A Street 123",
      }),
      shipping: undefined,
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("clears shipping fields cleanly and switches to shipping tab when unchecking use billing as shipping", async () => {
    const mockOnDualSubmit = vi.fn().mockResolvedValue({ success: true });

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        defaultType="BILLING"
        onDualSubmit={mockOnDualSubmit}
      />,
    );

    // 1. Enter Billing Address Option A
    const fullNameInput = screen.getByPlaceholderText("e.g. Soumya Roy") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("name@example.com") as HTMLInputElement;
    const mobileInput = screen.getByPlaceholderText("+91 or 10-digit number") as HTMLInputElement;
    const cityInput = screen.getByPlaceholderText("e.g. Kolkata") as HTMLInputElement;
    const pinInput = screen.getByPlaceholderText("e.g. 700001") as HTMLInputElement;
    const streetInput = screen.getByPlaceholderText("Building, street, and area") as HTMLInputElement;

    fireEvent.change(fullNameInput, { target: { value: "Option A Person" } });
    fireEvent.change(emailInput, { target: { value: "optiona@example.com" } });
    fireEvent.change(mobileInput, { target: { value: "9800000001" } });
    fireEvent.change(cityInput, { target: { value: "Kolkata" } });
    fireEvent.change(pinInput, { target: { value: "700001" } });
    fireEvent.change(streetInput, { target: { value: "Option A Street 123" } });

    // 2. Uncheck the "Use billing address as shipping address" checkbox
    const checkbox = screen.getByRole("checkbox", {
      name: /use billing address as shipping address/i,
    });
    fireEvent.click(checkbox);

    // 3. Verify shipping fields are completely clean/empty, not polluted with Option A data!
    expect(fullNameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(mobileInput.value).toBe("");
    expect(cityInput.value).toBe("");
    expect(pinInput.value).toBe("");
    expect(streetInput.value).toBe("");

    // 4. Fill Option B in clean shipping tab
    fireEvent.change(fullNameInput, { target: { value: "Option B Person" } });
    fireEvent.change(emailInput, { target: { value: "optionb@example.com" } });
    fireEvent.change(mobileInput, { target: { value: "9800000002" } });
    fireEvent.change(cityInput, { target: { value: "Mumbai" } });
    fireEvent.change(pinInput, { target: { value: "400001" } });
    fireEvent.change(streetInput, { target: { value: "Option B Street 456" } });

    // 5. Submit
    fireEvent.click(screen.getByRole("button", { name: /save both addresses/i }));

    await waitFor(() => {
      expect(mockOnDualSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnDualSubmit).toHaveBeenCalledWith({
      sameAsBilling: false,
      billing: expect.objectContaining({
        fullName: "Option A Person",
        streetAddress: "Option A Street 123",
        city: "Kolkata",
      }),
      shipping: expect.objectContaining({
        fullName: "Option B Person",
        streetAddress: "Option B Street 456",
        city: "Mumbai",
      }),
    });
  });

  it("edits a specific billing address cleanly without showing type selector or duplicating data", async () => {
    const mockBillingAddress = {
      _id: "billing_edit_123",
      user: "u1",
      addressType: "BILLING" as const,
      fullName: "Existing Billing User",
      email: "existing@example.com",
      mobileNumber: "9876543210",
      streetAddress: "123 Old Billing Road",
      apartment: "Apt 1",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India",
      isDefault: true,
    };

    render(
      <AddressModalForm
        isOpen={true}
        onClose={mockOnClose}
        addressToEdit={mockBillingAddress}
        onSubmit={mockOnSubmit}
      />,
    );

    // 1. Verify title is "Edit Billing Address"
    expect(screen.getByText("Edit Billing Address")).toBeInTheDocument();

    // 2. Verify pre-filled data
    const streetInput = screen.getByPlaceholderText("Building, street, and area") as HTMLInputElement;
    expect(streetInput.value).toBe("123 Old Billing Road");

    // 3. Verify no pseudo-tabs/type selector buttons are shown
    expect(screen.queryByRole("button", { name: /^billing address$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^shipping address$/i })).not.toBeInTheDocument();

    // 4. Update street address
    fireEvent.change(streetInput, { target: { value: "456 New Billing Road" } });

    // 5. Submit changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        addressType: "BILLING",
        fullName: "Existing Billing User",
        streetAddress: "456 New Billing Road",
      }),
      "billing_edit_123",
    );

    expect(mockOnClose).toHaveBeenCalled();
  });
});
