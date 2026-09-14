export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id?: string;
    payment_id?: string;
  };
}

export interface RazorpayPaymentFailedResponse {
  error: RazorpayPaymentErrorResponse;
}

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayTheme {
  color?: string;
  backdrop_color?: string;
}

export interface RazorpayModalOptions {
  backdropclose?: boolean;
  escape?: boolean;
  handleback?: boolean;
  confirm_close?: boolean;
  animation?: boolean;
  ondismiss?: () => void;
}

export interface RazorpayRetryOptions {
  enabled?: boolean;
}

export interface RazorpayCheckoutOptions {
  key?: string;
  amount: number;
  order_id: string;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: RazorpayTheme;
  modal?: RazorpayModalOptions;
  retry?: RazorpayRetryOptions;
}

export interface InternalRazorpayCheckoutOptions
  extends RazorpayCheckoutOptions {
  key: string;
  currency: string;
  name: string;
  handler: (response: RazorpayPaymentSuccessResponse) => void;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
  on(
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailedResponse) => void,
  ): void;
}

export type RazorpayCheckoutResult =
  | {
      success: true;
      status: "success";
      response: RazorpayPaymentSuccessResponse;
    }
  | {
      success: false;
      status: "failed";
      error: string;
      details: RazorpayPaymentErrorResponse;
    }
  | {
      success: false;
      status: "cancelled";
      error: string;
    };

declare global {
  interface Window {
    Razorpay?: new (
      options: InternalRazorpayCheckoutOptions,
    ) => RazorpayInstance;
  }
}
