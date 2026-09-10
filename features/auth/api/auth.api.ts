import { apiClient, isApiClientError } from "@/lib/api";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginInput,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterInput,
} from "../types/auth.types";

// register new user account
export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", input, {
    skipAuthRefresh: true,
  });
}

// authenticate existing user
export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", input, {
    skipAuthRefresh: true,
  });
}

// refresh expired access token using http-only refresh cookie
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  return apiClient.post<RefreshTokenResponse>("/auth/refresh-token", undefined, {
    skipAuthRefresh: true,
  });
}

// logout current authenticated user session
export async function logoutUser(): Promise<LogoutResponse> {
  return apiClient.post<LogoutResponse>("/auth/logout", undefined, {
    skipAuthRefresh: true,
  });
}

// get current authenticated user profile
export async function getCurrentUser(options?: {
  signal?: AbortSignal;
}): Promise<CurrentUserResponse | null> {
  try {
    return await apiClient.get<CurrentUserResponse>("/auth/me", {
      signal: options?.signal,
      skipAuthRefresh: true,
    });
  } catch (err: unknown) {
    if (isApiClientError(err) && (err.status === 401 || err.status === 403)) {
      return null;
    }
    throw err;
  }
}

