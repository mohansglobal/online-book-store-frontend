// Server-side authentication and role guard utilities for Next.js App Router
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/config/env";
import { DEFAULT_ROLE_HOME } from "../constants/auth.constants";
import type { CurrentUserResponse, User, UserRole } from "../types/auth.types";


export async function getServerCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    if (!cookieHeader) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as CurrentUserResponse;
    return json.data ?? null;
  } catch (error) {
    // If it's a dynamic server usage error or Next.js redirect, rethrow it so Next.js handles route dynamism correctly
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      (error.digest === "DYNAMIC_SERVER_USAGE" || String(error.digest).startsWith("NEXT_"))
    ) {
      throw error;
    }
    return null;
  }
}



export async function requireAuth(returnUrl?: string): Promise<User> {
  const user = await getServerCurrentUser();

  if (!user) {
    const redirectUrl = returnUrl
      ? `/login?redirect=${encodeURIComponent(returnUrl)}`
      : "/login";
    redirect(redirectUrl);
  }

  return user;
}



export async function requireRole(
  allowedRoles: UserRole | readonly UserRole[],
  returnUrl?: string,
): Promise<User> {
  const user = await getServerCurrentUser();

  if (!user) {
    const redirectUrl = returnUrl
      ? `/login?redirect=${encodeURIComponent(returnUrl)}`
      : "/login";
    redirect(redirectUrl);
  }

  const isAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user.role)
    : user.role === allowedRoles;

  if (!isAllowed) {
    const fallback = DEFAULT_ROLE_HOME[user.role] || "/";
    redirect(fallback);
  }

  return user;
}
