import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckoutOrderFlow } from "./use-checkout-order-flow";
import { toast } from "sonner";
import { initiateRazorpayOrder, verifyOrderPayment } from "@/features/orders";
import { openRazorpayModal } from "@/lib/razorpay";
import type { Address } from "@/features/addresses";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/features/orders", () => ({
  initiateRazorpayOrder: vi.fn(),
  verifyOrderPayment: vi.fn(),
}));

vi.mock("@/lib/razorpay", () => ({
  openRazorpayModal: vi.fn(),
}));

describe("useCheckoutOrderFlow", () => {
  const mockBillingAddress: Address = {
    _id: "addr_bill_1",
    user: "user_1",
    fullName: "John Doe",
    email: "john@example.com",
    mobileNumber: "9876543210",
    streetAddress: "123 Main St",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700001",
    country: "India",
    addressType: "BILLING",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockShippingAddress: Address = {
    _id: "addr_ship_2",
    user: "user_1",
    fullName: "John Doe Office",
    email: "john@example.com",
    mobileNumber: "9876543210",
    streetAddress: "456 Park St",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700016",
    country: "India",
    addressType: "SHIPPING",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockUser = {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    mobileNumber: "9876543210",
    role: "BUYER" as const,
  };

  const mockItems = [
    {
      id: "item_1",
      bookListingId: "listing_1",
      title: "Book Title",
      quantity: 2,
      price: 250,
      sellingPriceInPaise: 25000,
    },
  ];

  let mockCreateOrder: any;
  let mockHandleOpenAddModal: any;
  let mockCaptureSnapshot: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateOrder = vi.fn();
    mockHandleOpenAddModal = vi.fn();
    mockCaptureSnapshot = vi.fn();
  });

  it("should stop and show error toast if billing address is missing", async () => {
    const { result } = renderHook(() =>
      useCheckoutOrderFlow({
        user: mockUser,
        activeItems: mockItems,
        selectedBillingAddress: null,
        selectedShippingAddress: null,
        selectedBillingId: null,
        selectedShippingId: null,
        sameAsBilling: true,
        appliedCouponCode: null,
        canCheckout: true,
        checkoutIssues: [],
        captureSnapshot: mockCaptureSnapshot,
        handleOpenAddModal: mockHandleOpenAddModal,
        createOrder: mockCreateOrder,
      }),
    );

    await act(async () => {
      await result.current.handleProceedToPayment();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please add or select a billing address to proceed.",
    );
    expect(mockHandleOpenAddModal).toHaveBeenCalledWith("BILLING");
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it("should stop and show error toast if terms are not accepted", async () => {
    const { result } = renderHook(() =>
      useCheckoutOrderFlow({
        user: mockUser,
        activeItems: mockItems,
        selectedBillingAddress: mockBillingAddress,
        selectedShippingAddress: null,
        selectedBillingId: "addr_bill_1",
        selectedShippingId: null,
        sameAsBilling: true,
        appliedCouponCode: null,
        canCheckout: true,
        checkoutIssues: [],
        captureSnapshot: mockCaptureSnapshot,
        handleOpenAddModal: mockHandleOpenAddModal,
        createOrder: mockCreateOrder,
      }),
    );

    // terms not accepted (default false)
    await act(async () => {
      await result.current.handleProceedToPayment();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please agree to the Terms & Conditions to proceed.",
    );
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it("should successfully place Cash On Delivery (COD) order", async () => {
    const { result } = renderHook(() =>
      useCheckoutOrderFlow({
        user: mockUser,
        activeItems: mockItems,
        selectedBillingAddress: mockBillingAddress,
        selectedShippingAddress: null,
        selectedBillingId: "addr_bill_1",
        selectedShippingId: null,
        sameAsBilling: true,
        appliedCouponCode: "DISCOUNT50",
        canCheckout: true,
        checkoutIssues: [],
        captureSnapshot: mockCaptureSnapshot,
        handleOpenAddModal: mockHandleOpenAddModal,
        createOrder: mockCreateOrder,
      }),
    );

    act(() => {
      result.current.setPaymentMethod("cod");
      result.current.setAcceptedTerms(true);
    });

    mockCreateOrder.mockResolvedValueOnce({
      success: true,
      message: "Order placed",
      data: {
        _id: "order_cod_123",
        orderNumber: "ORD-COD-9999",
        orderStatus: "PLACED",
        paymentStatus: "PENDING",
        paymentMethod: "CASH_ON_DELIVERY",
      },
    });

    await act(async () => {
      await result.current.handleProceedToPayment();
    });

    expect(mockCaptureSnapshot).toHaveBeenCalled();
    expect(mockCreateOrder).toHaveBeenCalledWith({
      shippingAddressId: "addr_bill_1",
      billingSameAsShipping: true,
      paymentMethod: "CASH_ON_DELIVERY",
      couponCode: "DISCOUNT50",
    });

    expect(result.current.orderNumber).toBe("ORD-COD-9999");
    expect(result.current.isOrderComplete).toBe(true);
  });

  it("should execute full Online Payment flow via Razorpay gateway and verify signature", async () => {
    const { result } = renderHook(() =>
      useCheckoutOrderFlow({
        user: mockUser,
        activeItems: mockItems,
        selectedBillingAddress: mockBillingAddress,
        selectedShippingAddress: mockShippingAddress,
        selectedBillingId: "addr_bill_1",
        selectedShippingId: "addr_ship_2",
        sameAsBilling: false,
        appliedCouponCode: null,
        canCheckout: true,
        checkoutIssues: [],
        captureSnapshot: mockCaptureSnapshot,
        handleOpenAddModal: mockHandleOpenAddModal,
        createOrder: mockCreateOrder,
      }),
    );

    act(() => {
      result.current.setPaymentMethod("online");
      result.current.setAcceptedTerms(true);
    });

    // 1. Mock server gateway initiation
    vi.mocked(initiateRazorpayOrder).mockResolvedValueOnce({
      success: true,
      data: {
        razorpayOrderId: "order_rzp_mock_123",
        amountInPaise: 50000,
        currency: "INR",
        keyId: "rzp_test_key",
      },
    });

    // 2. Mock Razorpay checkout modal payment success
    vi.mocked(openRazorpayModal).mockResolvedValueOnce({
      success: true,
      status: "success",
      response: {
        razorpay_payment_id: "pay_rzp_987",
        razorpay_order_id: "order_rzp_mock_123",
        razorpay_signature: "sig_hmac_abc",
      },
    });

    // 3. Mock create order API
    mockCreateOrder.mockResolvedValueOnce({
      success: true,
      data: {
        _id: "order_db_777",
        orderNumber: "ORD-ONLINE-777",
        orderStatus: "CONFIRMED",
        paymentStatus: "PAID",
      },
    });

    // 4. Mock verify payment API
    vi.mocked(verifyOrderPayment).mockResolvedValueOnce({
      success: true,
      message: "Payment verified",
      data: {} as any,
    });

    await act(async () => {
      await result.current.handleProceedToPayment();
    });

    // Assert initiation
    expect(initiateRazorpayOrder).toHaveBeenCalledWith({
      items: [{ bookListing: "listing_1", quantity: 2 }],
      couponCode: undefined,
      shippingAddressId: "addr_ship_2",
      billingSameAsShipping: false,
    });

    // Assert modal opened
    expect(openRazorpayModal).toHaveBeenCalledWith(
      expect.objectContaining({
        order_id: "order_rzp_mock_123",
        amount: 50000,
      }),
    );

    // Assert order created with signature
    expect(mockCreateOrder).toHaveBeenCalledWith({
      shippingAddressId: "addr_ship_2",
      billingAddressId: "addr_bill_1",
      billingSameAsShipping: false,
      paymentMethod: "ONLINE_PAY",
      paymentId: "pay_rzp_987",
      razorpayPaymentId: "pay_rzp_987",
      razorpayOrderId: "order_rzp_mock_123",
      razorpaySignature: "sig_hmac_abc",
    });

    // Assert payment verified
    expect(verifyOrderPayment).toHaveBeenCalledWith({
      orderId: "order_db_777",
      razorpayPaymentId: "pay_rzp_987",
      razorpayOrderId: "order_rzp_mock_123",
      razorpaySignature: "sig_hmac_abc",
    });

    expect(result.current.orderNumber).toBe("ORD-ONLINE-777");
    expect(result.current.isOrderComplete).toBe(true);
  });

  it("should NOT create order in backend if customer cancels Razorpay modal", async () => {
    const { result } = renderHook(() =>
      useCheckoutOrderFlow({
        user: mockUser,
        activeItems: mockItems,
        selectedBillingAddress: mockBillingAddress,
        selectedShippingAddress: null,
        selectedBillingId: "addr_bill_1",
        selectedShippingId: null,
        sameAsBilling: true,
        appliedCouponCode: null,
        canCheckout: true,
        checkoutIssues: [],
        captureSnapshot: mockCaptureSnapshot,
        handleOpenAddModal: mockHandleOpenAddModal,
        createOrder: mockCreateOrder,
      }),
    );

    act(() => {
      result.current.setPaymentMethod("online");
      result.current.setAcceptedTerms(true);
    });

    vi.mocked(initiateRazorpayOrder).mockResolvedValueOnce({
      success: true,
      data: {
        razorpayOrderId: "order_rzp_cancel_1",
        amountInPaise: 25000,
        currency: "INR",
      },
    });

    // User cancels Razorpay modal
    vi.mocked(openRazorpayModal).mockResolvedValueOnce({
      success: false,
      status: "cancelled",
      error: "Payment was cancelled.",
    });

    await act(async () => {
      await result.current.handleProceedToPayment();
    });

    expect(toast.info).toHaveBeenCalledWith(
      "Payment was cancelled.",
    );
    expect(mockCreateOrder).not.toHaveBeenCalled();
    expect(result.current.isOrderComplete).toBe(false);
  });
});
