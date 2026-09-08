
// Application environment configuration.
//  All environment variables should be accessed through this module.

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
} as const;

export const API_BASE_URL = env.apiBaseUrl;
