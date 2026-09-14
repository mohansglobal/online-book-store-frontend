import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  validateCheckoutOptions,
  getRazorpayKey,
  openRazorpayModal,
} from "./modal";
import { loadRazorpayScript, resetRazorpayScriptCacheForTesting } from "./loader";
import type {
  InternalRazorpayCheckoutOptions,
  RazorpayInstance,
  RazorpayPaymentSuccessResponse,
  RazorpayPaymentErrorResponse,
} from "./types";

vi.mock("@/config/env", () => ({
  env: {
    razorpayKeyId: "rzp_test_mock_env_key",
  },
}));

describe("Razorpay Integration Module", () => {
  beforeEach(() => {
    resetRazorpayScriptCacheForTesting();
    const existingScript = document.getElementById("razorpay-checkout-script");
    if (existingScript) {
      existingScript.remove();
    }
    delete window.Razorpay;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validateCheckoutOptions", () => {
    it("should accept valid order_id and integer amount in paise", () => {
      expect(() =>
        validateCheckoutOptions({
          order_id: "order_123456",
          amount: 50000,
        }),
      ).not.toThrow();
    });

    it("should throw error if order_id is missing or blank", () => {
      expect(() =>
        validateCheckoutOptions({
          order_id: "",
          amount: 50000,
        }),
      ).toThrow("Razorpay order ID is required.");

      expect(() =>
        validateCheckoutOptions({
          order_id: "   ",
          amount: 50000,
        }),
      ).toThrow("Razorpay order ID is required.");
    });

    it("should throw error if amount is zero, negative, or not an integer", () => {
      expect(() =>
        validateCheckoutOptions({
          order_id: "order_123",
          amount: 0,
        }),
      ).toThrow("Razorpay amount must be a positive integer in paise.");

      expect(() =>
        validateCheckoutOptions({
          order_id: "order_123",
          amount: -100,
        }),
      ).toThrow("Razorpay amount must be a positive integer in paise.");

      expect(() =>
        validateCheckoutOptions({
          order_id: "order_123",
          amount: 49.99,
        }),
      ).toThrow("Razorpay amount must be a positive integer in paise.");
    });
  });

  describe("getRazorpayKey", () => {
    it("should prioritize customKey when provided", () => {
      const key = getRazorpayKey("rzp_custom_key_override");
      expect(key).toBe("rzp_custom_key_override");
    });

    it("should fallback to env.razorpayKeyId when customKey is not provided", () => {
      const key = getRazorpayKey();
      expect(key).toBe("rzp_test_mock_env_key");
    });
  });

  describe("loadRazorpayScript", () => {
    it("should return true immediately if window.Razorpay already exists", async () => {
      window.Razorpay = vi.fn() as unknown as typeof window.Razorpay;
      const loaded = await loadRazorpayScript();
      expect(loaded).toBe(true);
    });

    it("should append script tag if window.Razorpay is not yet loaded", async () => {
      const loadPromise = loadRazorpayScript();
      const scriptTag = document.getElementById("razorpay-checkout-script") as HTMLScriptElement;
      expect(scriptTag).not.toBeNull();
      expect(scriptTag.src).toBe("https://checkout.razorpay.com/v1/checkout.js");

      window.Razorpay = vi.fn() as unknown as typeof window.Razorpay;
      scriptTag.dispatchEvent(new Event("load"));

      const result = await loadPromise;
      expect(result).toBe(true);
    });
  });

  describe("openRazorpayModal", () => {
    it("should resolve with status: success when payment completes", async () => {
      let modalHandler: ((res: RazorpayPaymentSuccessResponse) => void) | null = null;

      window.Razorpay = class MockRazorpay implements RazorpayInstance {
        options: InternalRazorpayCheckoutOptions;
        constructor(options: InternalRazorpayCheckoutOptions) {
          this.options = options;
          modalHandler = options.handler;
        }
        open() {
          modalHandler?.({
            razorpay_payment_id: "pay_test_success_123",
            razorpay_order_id: "order_123456",
            razorpay_signature: "sig_mock_hash",
          });
        }
        on() {}
        close() {}
      };

      const result = await openRazorpayModal({
        order_id: "order_123456",
        amount: 25000,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.status).toBe("success");
        expect(result.response.razorpay_payment_id).toBe("pay_test_success_123");
        expect(result.response.razorpay_order_id).toBe("order_123456");
        expect(result.response.razorpay_signature).toBe("sig_mock_hash");
      }
    });

    it("should resolve with status: cancelled when user closes the modal without paying", async () => {
      let modalDismiss: (() => void) | undefined = undefined;

      window.Razorpay = class MockRazorpay implements RazorpayInstance {
        options: InternalRazorpayCheckoutOptions;
        constructor(options: InternalRazorpayCheckoutOptions) {
          this.options = options;
          modalDismiss = options.modal?.ondismiss;
        }
        open() {
          modalDismiss?.();
        }
        on() {}
        close() {}
      };

      const result = await openRazorpayModal({
        order_id: "order_123456",
        amount: 25000,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe("cancelled");
        expect(result.error).toBe("Payment was cancelled.");
      }
    });

    it("should resolve with status: failed when payment failed event occurs and modal closes", async () => {
      let modalDismiss: (() => void) | undefined = undefined;
      let failureHandler: ((res: { error: RazorpayPaymentErrorResponse }) => void) | null = null;

      window.Razorpay = class MockRazorpay implements RazorpayInstance {
        options: InternalRazorpayCheckoutOptions;
        constructor(options: InternalRazorpayCheckoutOptions) {
          this.options = options;
          modalDismiss = options.modal?.ondismiss;
        }
        on(event: "payment.failed", handler: (res: { error: RazorpayPaymentErrorResponse }) => void) {
          if (event === "payment.failed") {
            failureHandler = handler;
          }
        }
        open() {
          failureHandler?.({
            error: {
              code: "BAD_REQUEST_ERROR",
              description: "Card declined by bank",
              source: "gateway",
              step: "payment_authorization",
              reason: "payment_failed",
              metadata: { order_id: "order_123456", payment_id: "pay_failed_1" },
            },
          });
          modalDismiss?.();
        }
        close() {}
      };

      const result = await openRazorpayModal({
        order_id: "order_123456",
        amount: 25000,
      });

      expect(result.success).toBe(false);
      if (!result.success && result.status === "failed") {
        expect(result.status).toBe("failed");
        expect(result.error).toBe("Card declined by bank");
        expect(result.details.code).toBe("BAD_REQUEST_ERROR");
      }
    });
  });
});
