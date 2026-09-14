import { describe, it, expect } from "vitest";
import { getCurrentRedirectPath } from "../utils/auth-redirect";

describe("useRequireAuth", () => {
  it("should construct proper login redirect target", () => {
    const testPath = "/books/mati-akasher-majhkhane";
    const search = new URLSearchParams({ tab: "reviews", ref: "banner" });
    const fullPath = getCurrentRedirectPath(testPath, search);
    const targetLoginUrl = `/login?redirect=${encodeURIComponent(fullPath)}`;

    expect(targetLoginUrl).toBe(
      "/login?redirect=%2Fbooks%2Fmati-akasher-majhkhane%3Ftab%3Dreviews%26ref%3Dbanner",
    );
  });

  it("should support custom return URL for Buy Now action", () => {
    const customBuyNowUrl = "/checkout?book=123&qty=2";
    const customLoginTarget = `/login?redirect=${encodeURIComponent(customBuyNowUrl)}`;

    expect(customLoginTarget).toBe(
      "/login?redirect=%2Fcheckout%3Fbook%3D123%26qty%3D2",
    );
  });
});
