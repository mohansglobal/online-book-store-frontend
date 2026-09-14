// Order API client functions matching /api/v1/orders backend endpoints
import { apiClient } from "@/lib/api";
import type {
  CreateOrderInput,
  CreateOrderResponse,
  Order,
  OrdersQueryParams,
  OrdersResponse,
} from "../types/order.types";

//Place a new order with address references, payment method, and promo code.
//POST /api/v1/orders

export async function createOrder(
  payload: CreateOrderInput,
): Promise<CreateOrderResponse> {
  return apiClient.post<CreateOrderResponse>("/orders", payload);
}


//Fetch list of orders for the authenticated customer.
//GET /api/v1/orders

export async function getOrders(
  params?: OrdersQueryParams,
  options?: { signal?: AbortSignal },
): Promise<OrdersResponse> {
  return apiClient.get<OrdersResponse>("/orders", {
    params: params as Record<string, string | number | undefined>,
    signal: options?.signal,
  });
}

// Fetch single order details by ID
// GET /api/v1/orders/:id
export async function getOrderById(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<CreateOrderResponse> {
  return apiClient.get<CreateOrderResponse>(`/orders/${id}`, {
    signal: options?.signal,
  });
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Cancel an order
// POST /api/v1/orders/:id/cancel
export async function cancelOrder(
  orderId: string,
  reason?: string,
): Promise<CancelOrderResponse> {
  return apiClient.post<CancelOrderResponse>(`/orders/${orderId}/cancel`, {
    reason,
  });
}



export interface VerifyPaymentPayload {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: Order;
}

// Verify or record a completed payment with the backend.
// POST /api/v1/orders/:id/verify-payment
export async function verifyOrderPayment(
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse | null> {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = payload;
    return await apiClient.post<VerifyPaymentResponse>(
      `/orders/${orderId}/verify-payment`,
      {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      },
    );
  } catch {
    return null;
  }
}

export interface InitiateRazorpayOrderInput {
  items?: { bookListing: string; quantity: number }[];
  couponCode?: string;
  shippingAddressId?: string;
  billingSameAsShipping?: boolean;
}

export interface InitiateRazorpayOrderData {
  razorpayOrderId: string;
  amountInPaise: number;
  currency: string;
  keyId?: string;
}

export interface InitiateRazorpayOrderResponse {
  success: boolean;
  message?: string;
  data: InitiateRazorpayOrderData;
}

// Initiate Razorpay gateway order on the server before launching checkout modal
// POST /api/v1/orders/razorpay-order
export async function initiateRazorpayOrder(
  payload?: InitiateRazorpayOrderInput,
): Promise<InitiateRazorpayOrderResponse> {
  return apiClient.post<InitiateRazorpayOrderResponse>(
    "/orders/razorpay-order",
    payload || {},
  );
}


