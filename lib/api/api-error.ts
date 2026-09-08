import type { ApiError } from "./types";

// application error class adhering to predictable error shape
export class ApiClientError extends Error implements ApiError {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string[]>;
  readonly details?: unknown;
  readonly isApiClientError = true;

  constructor({
    status,
    code,
    message,
    fieldErrors,
    details,
  }: ApiError) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.details = details;

    // restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

// type guard to check if error is ApiClientError
export function isApiClientError(error: unknown): error is ApiClientError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isApiClientError" in error &&
    (error as Record<string, unknown>).isApiClientError === true
  );
}

// extract and normalize structured validation field errors
function extractFieldErrors(
  payload: Record<string, unknown>,
): Record<string, string[]> | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  // case 1: fieldErrors is record of strings or array of strings
  if (payload.fieldErrors && typeof payload.fieldErrors === "object" && !Array.isArray(payload.fieldErrors)) {
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(payload.fieldErrors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        result[key] = value.map(String);
      } else if (typeof value === "string") {
        result[key] = [value];
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  // case 2: errors object { fieldName: "msg" | ["msg"] }
  if (payload.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)) {
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(payload.errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        result[key] = value.map(String);
      } else if (typeof value === "string") {
        result[key] = [value];
      } else if (value && typeof value === "object" && "message" in value) {
        // mongoose validation error shape: errors.field.message
        result[key] = [String((value as { message: unknown }).message)];
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  // case 3: errors array [{ field: "email", message: "Invalid email" }]
  if (Array.isArray(payload.errors)) {
    const result: Record<string, string[]> = {};
    for (const item of payload.errors) {
      if (item && typeof item === "object") {
        const field = "field" in item ? String(item.field) : "path" in item ? String(item.path) : "general";
        const msg = "message" in item ? String(item.message) : "msg" in item ? String(item.msg) : JSON.stringify(item);
        if (!result[field]) {
          result[field] = [];
        }
        result[field].push(msg);
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  return undefined;
}

// create ApiClientError from http response and payload
export function createApiErrorFromResponse(
  status: number,
  statusText: string,
  payload: unknown,
): ApiClientError {
  let message = statusText || `Request failed with status ${status}`;
  let code: string | undefined;
  let fieldErrors: Record<string, string[]> | undefined;
  let details: unknown = payload;

  if (typeof payload === "string" && payload.trim().length > 0) {
    message = payload;
  } else if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (typeof obj.message === "string" && obj.message.trim().length > 0) {
      message = obj.message;
    } else if (typeof obj.error === "string" && obj.error.trim().length > 0) {
      message = obj.error;
    }

    if (typeof obj.code === "string") {
      code = obj.code;
    }

    fieldErrors = extractFieldErrors(obj);
    details = obj.details ?? obj;
  }

  return new ApiClientError({
    status,
    code,
    message,
    fieldErrors,
    details,
  });
}

// normalize any error into ApiClientError
export function normalizeApiError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred",
): ApiClientError {
  if (isApiClientError(error)) {
    return error;
  }

  if (error instanceof Error) {
    // Handle network / abort errors
    if (error.name === "AbortError") {
      return new ApiClientError({
        status: 0,
        code: "REQUEST_ABORTED",
        message: "The request was aborted.",
        details: error,
      });
    }

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return new ApiClientError({
        status: 0,
        code: "NETWORK_ERROR",
        message: "Unable to connect to the server. Please check your network connection.",
        details: error,
      });
    }

    return new ApiClientError({
      status: 500,
      code: "UNKNOWN_ERROR",
      message: error.message || fallbackMessage,
      details: error,
    });
  }

  return new ApiClientError({
    status: 500,
    code: "UNKNOWN_ERROR",
    message: fallbackMessage,
    details: error,
  });
}
