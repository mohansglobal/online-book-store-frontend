const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise: Promise<boolean> | null = null;

/**
 * Loads Razorpay Checkout SDK once.
 * Multiple simultaneous calls reuse the same Promise, preventing duplicate script tags.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.getElementById(
      RAZORPAY_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      const loaded = Boolean(window.Razorpay);
      if (!loaded) {
        razorpayScriptPromise = null;
      }
      resolve(loaded);
    };

    const handleError = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function resetRazorpayScriptCacheForTesting(): void {
  razorpayScriptPromise = null;
}
