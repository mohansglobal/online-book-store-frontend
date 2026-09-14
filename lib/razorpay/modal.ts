import { env } from "@/config/env";
import { loadRazorpayScript } from "./loader";
import type {
  InternalRazorpayCheckoutOptions,
  RazorpayCheckoutOptions,
  RazorpayCheckoutResult,
  RazorpayPaymentErrorResponse,
} from "./types";

const DEFAULT_CURRENCY = "INR";
const DEFAULT_BUSINESS_NAME = "Indo Bangla Books";
const DEFAULT_THEME_COLOR = "#2563eb";

export function validateCheckoutOptions(
  options: RazorpayCheckoutOptions,
): void {
  if (!options.order_id?.trim()) {
    throw new Error("Razorpay order ID is required.");
  }

  if (
    !Number.isInteger(options.amount) ||
    options.amount <= 0
  ) {
    throw new Error(
      "Razorpay amount must be a positive integer in paise.",
    );
  }
}

export function getRazorpayKey(customKey?: string): string {
  const key = customKey?.trim() || env.razorpayKeyId?.trim();

  if (!key) {
    throw new Error("Razorpay Key ID is not configured.");
  }

  return key;
}

/**
 * Opens Razorpay Standard Checkout modal.
 * Resolves with success, failed, or cancelled result.
 */
export async function openRazorpayModal(
  options: RazorpayCheckoutOptions,
): Promise<RazorpayCheckoutResult> {
  if (typeof window === "undefined") {
    throw new Error(
      "Razorpay Checkout can only be opened in the browser.",
    );
  }

  validateCheckoutOptions(options);

  const key = getRazorpayKey(options.key);
  const isLoaded = await loadRazorpayScript();
  const RazorpayClass = typeof window !== "undefined" ? window.Razorpay : undefined;

  if (!isLoaded || !RazorpayClass) {
    throw new Error(
      "Unable to load Razorpay payment gateway. Please check your network connection.",
    );
  }

  return new Promise<RazorpayCheckoutResult>((resolve) => {
    let isSettled = false;
    let lastPaymentError: RazorpayPaymentErrorResponse | null = null;

    const settle = (result: RazorpayCheckoutResult) => {
      if (isSettled) return;
      isSettled = true;
      resolve(result);
    };

    const { modal, theme, ...checkoutOptions } = options;

    const razorpayOptions: InternalRazorpayCheckoutOptions = {
      ...checkoutOptions,
      key,
      currency: options.currency ?? DEFAULT_CURRENCY,
      name: options.name ?? DEFAULT_BUSINESS_NAME,
      theme: {
        color: DEFAULT_THEME_COLOR,
        ...theme,
      },
      modal: {
        ...modal,
        ondismiss: () => {
          modal?.ondismiss?.();

          if (lastPaymentError) {
            settle({
              success: false,
              status: "failed",
              error:
                lastPaymentError.description ||
                "Payment failed. Please try again.",
              details: lastPaymentError,
            });
            return;
          }

          settle({
            success: false,
            status: "cancelled",
            error: "Payment was cancelled.",
          });
        },
      },
      handler: (response) => {
        settle({
          success: true,
          status: "success",
          response,
        });
      },
    };

    const razorpay = new RazorpayClass(razorpayOptions);

    razorpay.on("payment.failed", (response) => {
      lastPaymentError = response.error;
    });

    razorpay.open();
  });
}
