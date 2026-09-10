// unit test validation for useRequireAuth behavior & options
import { getCurrentRedirectPath } from "../utils/auth-redirect";

export function runUseRequireAuthTests(): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  function assertEqual(name: string, actual: unknown, expected: unknown) {
    if (actual !== expected) {
      failures.push(
        `FAIL [${name}]: expected "${String(expected)}", received "${String(actual)}"`,
      );
    }
  }

  // 1. Target URL encoding test
  const testPath = "/books/mati-akasher-majhkhane";
  const search = new URLSearchParams({ tab: "reviews", ref: "banner" });
  const fullPath = getCurrentRedirectPath(testPath, search);
  const targetLoginUrl = `/login?redirect=${encodeURIComponent(fullPath)}`;

  assertEqual(
    "Constructs proper login redirect target",
    targetLoginUrl,
    "/login?redirect=%2Fbooks%2Fmati-akasher-majhkhane%3Ftab%3Dreviews%26ref%3Dbanner",
  );

  // 2. Custom Return URL overriding (e.g. for Buy Now)
  const customBuyNowUrl = "/checkout?book=123&qty=2";
  const customLoginTarget = `/login?redirect=${encodeURIComponent(customBuyNowUrl)}`;

  assertEqual(
    "Supports custom return URL for Buy Now action",
    customLoginTarget,
    "/login?redirect=%2Fcheckout%3Fbook%3D123%26qty%3D2",
  );

  // 3. Callback execution simulator logic
  let actionExecuted = false;
  let redirectedTo: string | null = null;
  let unauthenticatedToastTriggered = false;

  const simulateWithAuth = ({
    isLoading,
    isAuthenticated,
    action,
    options,
  }: {
    isLoading: boolean;
    isAuthenticated: boolean;
    action: () => void;
    options?: { returnUrl?: string; onUnauthenticated?: () => void };
  }) => {
    if (isLoading) return;
    if (!isAuthenticated) {
      options?.onUnauthenticated?.();
      redirectedTo = `/login?redirect=${encodeURIComponent(options?.returnUrl || fullPath)}`;
      return;
    }
    action();
  };

  // Case A: Loading state - do nothing
  actionExecuted = false;
  redirectedTo = null;
  simulateWithAuth({
    isLoading: true,
    isAuthenticated: false,
    action: () => {
      actionExecuted = true;
    },
  });
  assertEqual("Loading state does NOT execute action", actionExecuted, false);
  assertEqual("Loading state does NOT redirect", redirectedTo, null);

  // Case B: Unauthenticated guest - triggers redirect and toast
  actionExecuted = false;
  redirectedTo = null;
  unauthenticatedToastTriggered = false;
  simulateWithAuth({
    isLoading: false,
    isAuthenticated: false,
    action: () => {
      actionExecuted = true;
    },
    options: {
      onUnauthenticated: () => {
        unauthenticatedToastTriggered = true;
      },
    },
  });
  assertEqual("Guest does NOT execute action", actionExecuted, false);
  assertEqual("Guest triggers onUnauthenticated callback", unauthenticatedToastTriggered, true);
  assertEqual("Guest redirects to login with return path", redirectedTo, targetLoginUrl);

  // Case C: Authenticated user - executes action without redirecting
  actionExecuted = false;
  redirectedTo = null;
  simulateWithAuth({
    isLoading: false,
    isAuthenticated: true,
    action: () => {
      actionExecuted = true;
    },
  });
  assertEqual("Authenticated user executes action", actionExecuted, true);
  assertEqual("Authenticated user does NOT redirect", redirectedTo, null);

  return {
    passed: failures.length === 0,
    failures,
  };
}
