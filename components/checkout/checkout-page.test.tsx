import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import CheckoutPage from "./checkout-page";
import { useCurrentUser } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useAddresses } from "@/features/addresses";
import { useCheckoutSummaryQuery } from "@/features/checkout";
import { useCreateOrderMutation } from "@/features/orders";

const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/features/auth", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("@/features/cart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/features/addresses", () => ({
  useAddresses: vi.fn(),
}));

vi.mock("@/features/checkout", () => ({
  useCheckoutSummaryQuery: vi.fn(),
}));

vi.mock("@/features/orders", () => ({
  useCreateOrderMutation: vi.fn(),
}));

vi.mock("../categories/components/CategoryBanner", () => ({
  CategoryBanner: ({ categoryName }: { categoryName: string }) => (
    <div data-testid="category-banner">{categoryName}</div>
  ),
}));

describe("CheckoutPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateOrderMutation).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  it("should render CheckoutLoadingState when cart or addresses are loading", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(useCart).mockReturnValue({
      items: [],
      summary: { subtotal: 0, totalMrp: 0, mrpSavings: 0, totalItems: 0 },
      isLoading: true,
    } as any);

    vi.mocked(useAddresses).mockReturnValue({
      addresses: [],
      defaultAddress: null,
      isLoading: true,
      isMutating: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      setDefaultAddress: vi.fn(),
      deleteAddress: vi.fn(),
    } as any);

    vi.mocked(useCheckoutSummaryQuery).mockReturnValue({
      data: undefined,
    } as any);

    render(<CheckoutPage />);

    expect(screen.getByTestId("category-banner")).toBeInTheDocument();
    expect(screen.getByText("Preparing checkout...")).toBeInTheDocument();
  });

  it("should render CheckoutEmptyState when cart is empty and not loading", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "Test User", email: "test@example.com" } as any,
      isLoading: false,
    } as any);

    vi.mocked(useCart).mockReturnValue({
      items: [],
      summary: { subtotal: 0, totalMrp: 0, mrpSavings: 0, totalItems: 0 },
      isLoading: false,
    } as any);

    vi.mocked(useAddresses).mockReturnValue({
      addresses: [],
      defaultAddress: null,
      isLoading: false,
      isMutating: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      setDefaultAddress: vi.fn(),
      deleteAddress: vi.fn(),
    } as any);

    vi.mocked(useCheckoutSummaryQuery).mockReturnValue({
      data: undefined,
    } as any);

    render(<CheckoutPage />);

    expect(screen.getByText("Your Shopping Cart is Empty")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any books in your cart to checkout.",
      ),
    ).toBeInTheDocument();
  });

  it("should render full checkout layout with billing, shipping, and order summary when items exist", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "Test User", email: "test@example.com", mobileNumber: "9876543210" } as any,
      isLoading: false,
    } as any);

    const mockCartItems = [
      {
        id: "item_1",
        bookListingId: "listing_1",
        title: "The Great Novel",
        price: 399,
        quantity: 1,
        mrp: 499,
        coverImage: "/book.jpg",
      },
    ];

    vi.mocked(useCart).mockReturnValue({
      items: mockCartItems,
      summary: { subtotal: 399, totalMrp: 499, mrpSavings: 100, totalItems: 1 },
      isLoading: false,
    } as any);

    const mockAddress = {
      _id: "addr_1",
      userId: "user_1",
      fullName: "Test User",
      mobileNumber: "9876543210",
      apartment: "Apt 1",
      streetAddress: "123 Street",
      addressLine1: "123 Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India",
      addressType: "HOME" as const,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(useAddresses).mockReturnValue({
      addresses: [mockAddress],
      defaultAddress: mockAddress,
      isLoading: false,
      isMutating: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      setDefaultAddress: vi.fn(),
      deleteAddress: vi.fn(),
    } as any);

    vi.mocked(useCheckoutSummaryQuery).mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              bookListingId: "listing_1",
              bookId: "b1",
              title: "The Great Novel",
              author: "Author A",
              quantity: 1,
              stockAvailable: 10,
              isAvailable: true,
              mrpInPaise: 49900,
              sellingPriceInPaise: 39900,
              subtotalInPaise: 39900,
              itemDiscountInPaise: 10000,
              seller: { id: "s1", name: "Seller 1" },
            },
          ],
          pricing: {
            itemsCount: 1,
            totalQuantity: 1,
            mrpTotalInPaise: 49900,
            subtotalInPaise: 39900,
            itemDiscountInPaise: 10000,
            couponDiscountInPaise: 0,
            deliveryChargeInPaise: 5000,
            totalSavingsInPaise: 10000,
            totalAmountInPaise: 44900,
            currency: "INR",
          },
          coupon: null,
          addresses: {
            shippingAddress: mockAddress,
            billingAddress: mockAddress,
            billingSameAsShipping: true,
          },
          paymentMethods: [
            { id: "ONLINE_PAY", label: "Online Payment (UPI, Cards, NetBanking)", isAvailable: true },
            { id: "CASH_ON_DELIVERY", label: "Cash on Delivery (COD)", isAvailable: true },
          ],
          delivery: {
            estimatedMinDays: 2,
            estimatedMaxDays: 5,
          },
          checkoutState: {
            canCheckout: true,
            issues: [],
          },
        },
      },
    } as any);

    render(<CheckoutPage />);

    // Check Billing & Shipping & Summary sections
    expect(screen.getByText("Billing & Contact Details")).toBeInTheDocument();
    expect(screen.getByText("Shipping & Delivery")).toBeInTheDocument();
    expect(screen.getByText("Your Order")).toBeInTheDocument();
    expect(screen.getByText("The Great Novel")).toBeInTheDocument();
    expect(screen.getByText("Online Pay")).toBeInTheDocument();
    expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
  });

  it("should support Buy Now mode with empty user cart and query summary for direct item", () => {
    mockSearchParams.set("mode", "buy-now");
    mockSearchParams.set("listingId", "listing_bn_1");
    mockSearchParams.set("quantity", "2");

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "Test User", email: "test@example.com" } as any,
      isLoading: false,
    } as any);

    // Cart is empty!
    vi.mocked(useCart).mockReturnValue({
      items: [],
      summary: { subtotal: 0, totalMrp: 0, mrpSavings: 0, totalItems: 0 },
      isLoading: false,
    } as any);

    const mockAddress = {
      _id: "addr_1",
      userId: "user_1",
      fullName: "Test User",
      mobileNumber: "9876543210",
      streetAddress: "123 Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India",
      addressType: "HOME" as const,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(useAddresses).mockReturnValue({
      addresses: [mockAddress],
      defaultAddress: mockAddress,
      isLoading: false,
      isMutating: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      setDefaultAddress: vi.fn(),
      deleteAddress: vi.fn(),
    } as any);

    vi.mocked(useCheckoutSummaryQuery).mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              bookListingId: "listing_bn_1",
              bookId: "b_bn_1",
              title: "Direct Buy Book",
              author: "Author BN",
              quantity: 2,
              stockAvailable: 5,
              isAvailable: true,
              mrpInPaise: 100000,
              sellingPriceInPaise: 80000,
              subtotalInPaise: 80000,
              itemDiscountInPaise: 20000,
              seller: { id: "s1", name: "Seller 1" },
            },
          ],
          pricing: {
            itemsCount: 1,
            totalQuantity: 2,
            mrpTotalInPaise: 100000,
            subtotalInPaise: 80000,
            itemDiscountInPaise: 20000,
            couponDiscountInPaise: 0,
            deliveryChargeInPaise: 0,
            totalSavingsInPaise: 20000,
            totalAmountInPaise: 80000,
            currency: "INR",
          },
          coupon: null,
          addresses: {
            shippingAddress: mockAddress,
            billingAddress: mockAddress,
            billingSameAsShipping: true,
          },
          paymentMethods: [
            { id: "ONLINE_PAY", label: "Online Payment", isAvailable: true },
          ],
          delivery: {
            estimatedMinDays: 2,
            estimatedMaxDays: 4,
          },
          checkoutState: {
            canCheckout: true,
            issues: [],
          },
        },
      },
    } as any);

    render(<CheckoutPage />);

    expect(screen.getByText("Direct Buy Book")).toBeInTheDocument();
    expect(screen.getByText("Your Order")).toBeInTheDocument();

    // Verify useCheckoutSummaryQuery was called with bookListingId & quantity
    expect(useCheckoutSummaryQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        bookListingId: "listing_bn_1",
        quantity: 2,
      }),
      { enabled: true },
    );
  });

  it("should render CheckoutInvalidBuyNowState when mode is buy-now but listingId is missing", () => {
    mockSearchParams.set("mode", "buy-now");
    mockSearchParams.delete("listingId");

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { name: "Test User" } as any,
      isLoading: false,
    } as any);

    vi.mocked(useCart).mockReturnValue({
      items: [],
      summary: { subtotal: 0, totalMrp: 0, mrpSavings: 0, totalItems: 0 },
      isLoading: false,
    } as any);

    vi.mocked(useAddresses).mockReturnValue({
      addresses: [],
      defaultAddress: null,
      isLoading: false,
      isMutating: false,
      createAddress: vi.fn(),
      updateAddress: vi.fn(),
      setDefaultAddress: vi.fn(),
      deleteAddress: vi.fn(),
    } as any);

    vi.mocked(useCheckoutSummaryQuery).mockReturnValue({
      data: undefined,
    } as any);

    render(<CheckoutPage />);

    expect(screen.getByText("Invalid Checkout Request")).toBeInTheDocument();
    expect(
      screen.getByText("The direct purchase link is missing a valid product listing."),
    ).toBeInTheDocument();
  });
});
