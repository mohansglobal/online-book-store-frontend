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

  it("makes network requests when IS_API_ENABLED is true and IS_MOCK_MODE is false", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: true,
      IS_MOCK_MODE: false,
      DATA_SOURCE: "api",
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: true,
        isMockMode: false,
        dataSource: "api",
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

  it("strictly throws ApiClientError and NEVER falls back to mock when API fails in API mode", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: true,
      IS_MOCK_MODE: false,
      DATA_SOURCE: "api",
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: true,
        isMockMode: false,
        dataSource: "api",
      },
    }));

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => JSON.stringify({ success: false, message: "Database failure" }),
    });
    global.fetch = mockFetch;

    const { apiClient } = await import("./api-client");
    const { isApiClientError } = await import("./api-error");

    let thrownError: unknown;
    try {
      await apiClient.get("/listings");
    } catch (err) {
      thrownError = err;
    }

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(isApiClientError(thrownError)).toBe(true);
    if (isApiClientError(thrownError)) {
      expect(thrownError.status).toBe(500);
      expect(thrownError.message).toBe("Database failure");
    }
  });

  it("serves mock data locally and does not invoke fetch when IS_MOCK_MODE is true", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: false,
      IS_MOCK_MODE: true,
      DATA_SOURCE: "mock",
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: false,
        isMockMode: true,
        dataSource: "mock",
      },
    }));

    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const { apiClient } = await import("./api-client");

    const result = await apiClient.get<any>("/categories");

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  it("blocks requests immediately and does not call fetch when IS_API_ENABLED is false and IS_MOCK_MODE is false", async () => {
    vi.doMock("@/config/env", () => ({
      API_BASE_URL: "http://localhost:5000/api/v1",
      IS_API_ENABLED: false,
      IS_MOCK_MODE: false,
      DATA_SOURCE: "api",
      env: {
        apiBaseUrl: "http://localhost:5000/api/v1",
        razorpayKeyId: "test_key",
        isApiEnabled: false,
        isMockMode: false,
        dataSource: "api",
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
});

