import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckoutAddressSelection } from "@/components/checkout/use-checkout-address-selection";
import type { Address } from "@/features/addresses";

describe("useCheckoutAddressSelection", () => {
  const billingAddr: Address = {
    _id: "addr_billing_1",
    user: "u1",
    addressType: "BILLING",
    fullName: "Billing User",
    email: "billing@example.com",
    mobileNumber: "9876543210",
    streetAddress: "123 Billing Rd",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700001",
    country: "India",
    isDefault: true,
  };

  const shippingAddr: Address = {
    _id: "addr_shipping_1",
    user: "u1",
    addressType: "SHIPPING",
    fullName: "Shipping User",
    email: "shipping@example.com",
    mobileNumber: "9123456780",
    streetAddress: "456 Shipping Ave",
    city: "Howrah",
    state: "West Bengal",
    postalCode: "711101",
    country: "India",
    isDefault: false,
  };
  
  const mockSetDefault = vi.fn();
  const mockCreateAddress = vi.fn();
  const mockUpdateAddress = vi.fn();

  it("resolves distinct billing and shipping addresses by type", () => {
    const { result } = renderHook(() =>
      useCheckoutAddressSelection({
        addresses: [shippingAddr, billingAddr],
        defaultAddress: shippingAddr,
        setDefaultAddress: mockSetDefault,
        createAddress: mockCreateAddress,
        updateAddress: mockUpdateAddress,
      }),
    );

    // Billing id should resolve to billing address, not shipping default
    expect(result.current.selectedBillingId).toBe("addr_billing_1");
    expect(result.current.selectedBillingAddress?._id).toBe("addr_billing_1");

    // When sameAsBilling is true, shipping address matches billing
    expect(result.current.sameAsBilling).toBe(true);
    expect(result.current.selectedShippingAddress?._id).toBe("addr_billing_1");

    // When toggled to false, shipping address resolves to shippingAddr
    act(() => {
      result.current.setSameAsBilling(false);
    });

    expect(result.current.selectedShippingId).toBe("addr_shipping_1");
    expect(result.current.selectedShippingAddress?._id).toBe("addr_shipping_1");
  });

  it("sets chosenShippingId and disables sameAsBilling when shipping address is created", async () => {
    const newShippingAddr: Address = {
      ...shippingAddr,
      _id: "new_shipping_id",
      fullName: "New Shipping User",
    };

    mockCreateAddress.mockResolvedValueOnce({
      success: true,
      data: newShippingAddr,
    });

    const { result, rerender } = renderHook(
      ({ addresses }) =>
        useCheckoutAddressSelection({
          addresses,
          defaultAddress: billingAddr,
          setDefaultAddress: mockSetDefault,
          createAddress: mockCreateAddress,
          updateAddress: mockUpdateAddress,
        }),
      {
        initialProps: { addresses: [billingAddr] },
      },
    );

    expect(result.current.sameAsBilling).toBe(true);

    await act(async () => {
      await result.current.handleAddressSubmit({
        addressType: "SHIPPING",
        fullName: "New Shipping User",
        email: "ship@example.com",
        mobileNumber: "9876543210",
        streetAddress: "New Ship St",
        city: "Kolkata",
        state: "West Bengal",
        postalCode: "700001",
        country: "India",
      });
    });

    // Simulate TanStack Query updating addresses list
    rerender({ addresses: [billingAddr, newShippingAddr] });

    expect(result.current.sameAsBilling).toBe(false);
    expect(result.current.selectedShippingId).toBe("new_shipping_id");
  });

  it("sets both chosenBillingId and chosenShippingId atomically via handleDualAddressSubmit", async () => {
    const mockCreateDualAddress = vi.fn();
    const newBillingAddr: Address = {
      ...billingAddr,
      _id: "dual_billing_id",
      fullName: "Dual Billing User",
    };
    const newShippingAddr: Address = {
      ...shippingAddr,
      _id: "dual_shipping_id",
      fullName: "Dual Shipping User",
    };

    mockCreateDualAddress.mockResolvedValueOnce({
      success: true,
      message: "Billing and shipping addresses created successfully",
      data: {
        billingAddress: newBillingAddr,
        shippingAddress: newShippingAddr,
      },
    });

    const { result, rerender } = renderHook(
      ({ addresses }) =>
        useCheckoutAddressSelection({
          addresses,
          defaultAddress: billingAddr,
          setDefaultAddress: mockSetDefault,
          createAddress: mockCreateAddress,
          createDualAddress: mockCreateDualAddress,
          updateAddress: mockUpdateAddress,
        }),
      {
        initialProps: { addresses: [billingAddr] },
      },
    );

    await act(async () => {
      await result.current.handleDualAddressSubmit({
        sameAsBilling: false,
        billing: {
          fullName: "Dual Billing User",
          email: "billing@example.com",
          mobileNumber: "9876543210",
          streetAddress: "123 Billing Rd",
          city: "Kolkata",
          state: "West Bengal",
          postalCode: "700001",
          country: "India",
        },
        shipping: {
          fullName: "Dual Shipping User",
          email: "shipping@example.com",
          mobileNumber: "9123456780",
          streetAddress: "456 Shipping Ave",
          city: "Howrah",
          state: "West Bengal",
          postalCode: "711101",
          country: "India",
        },
      });
    });

    rerender({ addresses: [newBillingAddr, newShippingAddr] });

    expect(result.current.sameAsBilling).toBe(false);
    expect(result.current.selectedBillingId).toBe("dual_billing_id");
    expect(result.current.selectedShippingId).toBe("dual_shipping_id");
  });
});
