import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCheckoutQuantity } from "@/components/checkout/use-checkout-quantity";

const mockReplace = vi.fn();
const mockInvalidateQueries = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

describe("useCheckoutQuantity hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("does nothing when target quantity is less than 1", async () => {
    const updateQuantity = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useCheckoutQuantity({
        isBuyNow: false,
        updateQuantity,
      }),
    );

    await act(async () => {
      await result.current.handleUpdateQuantity("listing-1", 0);
    });

    expect(updateQuantity).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("updates URL searchParams in buy-now mode", async () => {
    mockSearchParams = new URLSearchParams("mode=buy-now&listingId=listing-123&quantity=1");
    const { result } = renderHook(() =>
      useCheckoutQuantity({
        isBuyNow: true,
      }),
    );

    await act(async () => {
      await result.current.handleUpdateQuantity("listing-123", 4);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/checkout?mode=buy-now&listingId=listing-123&quantity=4",
      { scroll: false },
    );
  });

  it("calls updateQuantity in cart mode", async () => {
    const updateQuantity = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useCheckoutQuantity({
        isBuyNow: false,
        updateQuantity,
      }),
    );

    await act(async () => {
      await result.current.handleUpdateQuantity("listing-123", 2);
    });

    expect(updateQuantity).toHaveBeenCalledWith("listing-123", 2);
  });
});
