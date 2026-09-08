import { API_BASE_URL } from "@/config/env";
import { createApiErrorFromResponse, normalizeApiError } from "./api-error";
import type { HttpMethod, QueryParams, RequestOptions } from "./types";


// mutex state for 401 logout deduplication
let logoutPromise: Promise<void> | null = null;
const unauthorizedListeners = new Set<() => void>();

// mutex state for token refresh deduplication
let refreshPromise: Promise<boolean> | null = null;

// register listener for auth expiration
export function onUnauthorized(callback: () => void): () => void {
  unauthorizedListeners.add(callback);
  return () => {
    unauthorizedListeners.delete(callback);
  };
}

function notifyUnauthorized(): void {
  unauthorizedListeners.forEach((callback) => {
    try {
      callback();
    } catch (err) {
      console.error("Error in onUnauthorized listener:", err);
    }
  });
}

// build query string from params object or URLSearchParams
function buildQueryString(params?: QueryParams): string {
  if (!params) {
    return "";
  }

  if (params instanceof URLSearchParams) {
    const str = params.toString();
    return str ? `?${str}` : "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const str = searchParams.toString();
  return str ? `?${str}` : "";
}

// resolve full request url from endpoint and base url
function resolveUrl(endpoint: string, baseUrl?: string, params?: QueryParams): string {
  const queryString = buildQueryString(params);

  // if endpoint is already an absolute url
  if (/^https?:\/\//i.test(endpoint)) {
    return `${endpoint}${queryString}`;
  }

  const base = baseUrl ?? API_BASE_URL;
  const cleanBase = base.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");

  return `${cleanBase}/${cleanEndpoint}${queryString}`;
}

// deduplicated 401 logout trigger
async function triggerGlobalLogout(): Promise<void> {
  if (logoutPromise) {
    return logoutPromise;
  }

  logoutPromise = (async () => {
    try {
      const logoutUrl = resolveUrl("/auth/logout");
      await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } catch (err) {
      console.error("Global 401 logout request failed:", err);
    } finally {
      notifyUnauthorized();
      logoutPromise = null;
    }
  })();

  return logoutPromise;
}

// deduplicated access token refresh via http-only cookies
async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshUrl = resolveUrl("/auth/refresh-token");
      const response = await fetch(refreshUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Refresh token request failed with status ${response.status}`);
      }

      // backend automatically sets the updated HTTP-only accessToken cookie
      return true;
    } catch (err) {
      console.warn("Refresh token invalid or expired. Triggering global logout:", err);
      await triggerGlobalLogout();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// core http request handler
async function request<T>(
  endpoint: string,
  options: RequestOptions & { method?: HttpMethod } = {},
): Promise<T> {
  const {
    baseUrl,
    params,
    json,
    body,
    headers: customHeaders,
    skipAuthRefresh = false,
    credentials = "include",
    method = "GET",
    ...restOptions
  } = options;

  const url = resolveUrl(endpoint, baseUrl, params);
  const headers = new Headers(customHeaders);

  let finalBody: BodyInit | null | undefined = body;

  // handle json serialization
  if (json !== undefined) {
    finalBody = JSON.stringify(json);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // accept json by default
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      method,
      credentials,
      headers,
      body: finalBody,
    });

    const isAuthEndpoint =
      endpoint.includes("/auth/login") ||
      endpoint.includes("/auth/register") ||
      endpoint.includes("/auth/refresh-token") ||
      endpoint.includes("/auth/logout");

    // handle 401: attempt cookie refresh and retry request seamlessly
    if (response.status === 401 && !skipAuthRefresh && !isAuthEndpoint) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return request<T>(endpoint, {
          ...options,
          skipAuthRefresh: true,
        });
      }
    }

    // handle 204 no content or empty responses
    if (response.status === 204 || response.status === 205) {
      return undefined as unknown as T;
    }

    const contentType = response.headers.get("content-type") || "";
    let payload: unknown;

    if (contentType.includes("application/json")) {
      const text = await response.text();
      payload = text ? JSON.parse(text) : undefined;
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      throw createApiErrorFromResponse(
        response.status,
        response.statusText,
        payload,
      );
    }

    return payload as T;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

// standardized api client wrapper
export const apiClient = Object.assign(
  <T>(endpoint: string, options?: RequestOptions & { method?: HttpMethod }) =>
    request<T>(endpoint, options),
  {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, json?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, json, method: "POST" }),

    put: <T>(endpoint: string, json?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, json, method: "PUT" }),

    patch: <T>(endpoint: string, json?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, json, method: "PATCH" }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: "DELETE" }),
  },
);

