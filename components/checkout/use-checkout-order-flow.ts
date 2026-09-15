import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/features/auth";
import type { Address } from "@/features/addresses";
import type { CheckoutIssue } from "@/features/checkout";
import {
  initiateRazorpayOrder,
  verifyOrderPayment,
  type CreateOrderInput,
  type CreateOrderResponse,
} from "@/features/orders";
import { openRazorpayModal } from "@/lib/razorpay";
import type { OrderItemDisplay } from "./order-item-row";
import type { PaymentMethod } from "./types";

export interface UseCheckoutOrderFlowProps {
  user: User | null | undefined;
  activeItems: OrderItemDisplay[];
  selectedBillingAddress: Address | null | undefined;
  selectedShippingAddress: Address | null | undefined;
  selectedBillingId: string | null;
  selectedShippingId: string | null;
  sameAsBilling: boolean;
  appliedCouponCode: string | null;
  canCheckout: boolean;
  checkoutIssues: CheckoutIssue[];
  captureSnapshot: () => void;
  handleOpenAddModal: (type: "BILLING" | "SHIPPING") => void;
  createOrder: (payload: CreateOrderInput) => Promise<CreateOrderResponse>;
  isCreatingOrder?: boolean;
  isBuyNow?: boolean;
  buyNowListingId?: string | null;
  buyNowQuantity?: number;
}

export function useCheckoutOrderFlow({
  user,
  activeItems,
  selectedBillingAddress,
  selectedShippingAddress,
  selectedBillingId,
  selectedShippingId,
  sameAsBilling,
  appliedCouponCode,
  canCheckout,
  checkoutIssues,
  captureSnapshot,
  handleOpenAddModal,
  createOrder,
  isCreatingOrder = false,
  isBuyNow = false,
  buyNowListingId = null,
  buyNowQuantity = 1,
}: UseCheckoutOrderFlowProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleProceedToPayment = async () => {
    if (isPlacingOrder || isCreatingOrder) return;

    if (!selectedBillingAddress) {
      toast.error("Please add or select a billing address to proceed.");
      handleOpenAddModal("BILLING");
      return;
    }

    if (!sameAsBilling && !selectedShippingAddress) {
      toast.error("Please select a delivery address.");
      handleOpenAddModal("SHIPPING");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    if (!canCheckout) {
      const issueMsg =
        checkoutIssues[0]?.message || "Please resolve the checkout issues to proceed.";
      toast.error(issueMsg);
      return;
    }

    const directItems =
      isBuyNow && buyNowListingId
        ? [
            {
              bookListing: buyNowListingId,
              bookListingId: buyNowListingId,
              quantity: buyNowQuantity,
            },
          ]
        : undefined;

    const basePayload: CreateOrderInput = {
      shippingAddressId:
        (sameAsBilling ? selectedBillingId : selectedShippingId) ||
        selectedBillingId!,
      billingSameAsShipping: sameAsBilling,
      ...(sameAsBilling ? {} : { billingAddressId: selectedBillingId! }),
      paymentMethod:
        paymentMethod === "cod" ? "CASH_ON_DELIVERY" : "ONLINE_PAY",
      ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
      ...(directItems ? { items: directItems } : {}),
    };

    captureSnapshot();
    setIsPlacingOrder(true);

    try {
      if (paymentMethod === "online") {
        const razorpayItems = directItems
          ? directItems
          : activeItems.map((item) => ({
              bookListing: item.bookListingId || item.id || "",
              quantity: item.quantity,
            }));

        // 1. Initiate Razorpay gateway order on the server to obtain authoritative order_id
        const gatewayRes = await initiateRazorpayOrder({
          items: razorpayItems,
          couponCode: appliedCouponCode || undefined,
          shippingAddressId:
            (sameAsBilling ? selectedBillingId : selectedShippingId) ||
            selectedBillingId ||
            undefined,
          billingSameAsShipping: sameAsBilling,
        });

        const gatewayData = gatewayRes?.data;
        if (!gatewayData?.razorpayOrderId) {
          throw new Error("Unable to initialize Razorpay payment gateway.");
        }

        // 2. Open Razorpay checkout modal with the server-generated order_id
        const rzpResult = await openRazorpayModal({
          key: gatewayData.keyId,
          order_id: gatewayData.razorpayOrderId,
          amount: gatewayData.amountInPaise,
          currency: gatewayData.currency || "INR",
          description: "Online Book Purchase",
          prefill: {
            name: selectedBillingAddress?.fullName || user?.name || "",
            email: user?.email || "",
            contact: selectedBillingAddress?.mobileNumber || user?.mobileNumber || "",
          },
          notes: {
            couponCode: appliedCouponCode || "NONE",
            itemsCount: String(activeItems.length),
          },
        });

        // 3. If payment was cancelled or failed, exit without calling order creation API
        if (!rzpResult.success) {
          toast.info(rzpResult.error || "Payment was cancelled. Order has not been placed.");
          return;
        }

        // 4. Payment succeeded: now hit the backend order creation API with payment details
        const orderPayload: CreateOrderInput = {
          ...basePayload,
          paymentId: rzpResult.response.razorpay_payment_id,
          razorpayPaymentId: rzpResult.response.razorpay_payment_id,
          razorpayOrderId: rzpResult.response.razorpay_order_id,
          razorpaySignature: rzpResult.response.razorpay_signature,
        };

        const res = await createOrder(orderPayload);
        const createdOrder = res?.data;

        if (createdOrder?.orderNumber) {
          await verifyOrderPayment({
            orderId: createdOrder._id,
            razorpayPaymentId: rzpResult.response.razorpay_payment_id,
            razorpayOrderId: rzpResult.response.razorpay_order_id,
            razorpaySignature: rzpResult.response.razorpay_signature,
          });

          setOrderNumber(createdOrder.orderNumber);
          setIsOrderComplete(true);
        }
      } else {
        // Cash On Delivery: directly create order
        const res = await createOrder(basePayload);
        const createdOrder = res?.data;

        if (createdOrder?.orderNumber) {
          setOrderNumber(createdOrder.orderNumber);
          setIsOrderComplete(true);
        }
      }
    } catch {
      // Handled by mutation toast; modal will not open on failure
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    acceptedTerms,
    setAcceptedTerms,
    isOrderComplete,
    setIsOrderComplete,
    orderNumber,
    setOrderNumber,
    isPlacingOrder,
    handleProceedToPayment,
  };
}
