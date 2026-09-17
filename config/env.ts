
// Application environment configuration.
// All environment variables should be accessed through this module.

const rawDataSource = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim().toLowerCase();
const rawApiEnabled =
  process.env.NEXT_PUBLIC_ENABLE_API ?? process.env.NEXT_PUBLIC_API_ENABLED;

// Determine mock mode vs API mode:
// 1. Explicit NEXT_PUBLIC_DATA_SOURCE="mock" enables mock mode.
// 2. Explicit NEXT_PUBLIC_DATA_SOURCE="api" enables API mode.
// 3. Fallback to NEXT_PUBLIC_ENABLE_API: "false" / "0" enables mock mode.
// 4. Default is API mode ("api") when not specified.
const isMockMode =
  rawDataSource === "mock" ||
  rawApiEnabled === "false" ||
  rawApiEnabled === "0";

const isApiEnabled = !isMockMode; 
const dataSource: "mock" | "api" = isMockMode ? "mock" : "api";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "9hgtwJBroT3NCHO31Z3YlmGx",
  isMockMode,
  isApiEnabled,
  dataSource,
} as const;

export const API_BASE_URL = env.apiBaseUrl;
export const IS_MOCK_MODE = env.isMockMode;
export const IS_API_ENABLED = env.isApiEnabled;
export const DATA_SOURCE = env.dataSource;

// Page-wise API integration flags and helpers
export {
  PAGE_INTEGRATION_FLAGS,
  isPageApiEnabled,
  getEndpointPageKey,
  shouldEndpointUseApi,
  type PageIntegrationKey,
  type PageIntegrationConfig,
} from "./page-integration";


