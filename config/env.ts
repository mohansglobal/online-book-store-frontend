
// Application environment configuration.
// All environment variables should be accessed through this module.

const rawApiEnabled =
  process.env.NEXT_PUBLIC_ENABLE_API ?? process.env.NEXT_PUBLIC_API_ENABLED;

// Enabled by default (true / undefined / empty), disabled only if explicitly set to "false" or "0"
const isApiEnabled =
  rawApiEnabled === undefined || rawApiEnabled === ""
    ? true
    : rawApiEnabled !== "false" && rawApiEnabled !== "0";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "9hgtwJBroT3NCHO31Z3YlmGx",
  isApiEnabled,
} as const;

export const API_BASE_URL = env.apiBaseUrl;
export const IS_API_ENABLED = env.isApiEnabled;

