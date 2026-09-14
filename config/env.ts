
// Application environment configuration.
//  All environment variables should be accessed through this module.

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "9hgtwJBroT3NCHO31Z3YlmGx",
} as const;

export const API_BASE_URL = env.apiBaseUrl;
