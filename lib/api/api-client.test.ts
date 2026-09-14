import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("apiClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("makes network requests when IS_API_ENABLED is true", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: true,
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: true,
      },
    }));

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => JSON.stringify({ success: true, data: { message: "ok" } }),
    });
    global.fetch = mockFetch;

    const { apiClient } = await import("./api-client");

    const result = await apiClient.get<{ success: boolean; data: { message: string } }>("/test-endpoint");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/v1/test-endpoint",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      }),
    );
    expect(result).toEqual({ success: true, data: { message: "ok" } });
  });

  it("blocks requests immediately and does not call fetch when IS_API_ENABLED is false", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: false,
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: false,
      },
    }));

    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { apiClient } = await import("./api-client");
    const { isApiClientError } = await import("./api-error");

    let thrownError: unknown;
    try {
      await apiClient.get("/books");
    } catch (err) {
      thrownError = err;
    }

    expect(mockFetch).not.toHaveBeenCalled();
    expect(isApiClientError(thrownError)).toBe(true);
    if (isApiClientError(thrownError)) {
      expect(thrownError.code).toBe("API_DISABLED");
      expect(thrownError.status).toBe(0);
      expect(thrownError.message).toContain("blocked because API is disabled");
    }
  });

  it("blocks POST requests without invoking fetch when IS_API_ENABLED is false", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: false,
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: false,
      },
    }));

    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { apiClient } = await import("./api-client");

    await expect(apiClient.post("/orders", { item: 1 })).rejects.toMatchObject({
      code: "API_DISABLED",
      status: 0,
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
