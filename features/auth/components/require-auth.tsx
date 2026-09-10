// declarative conditional auth rendering component (UX presentation only)
"use client";

import React from "react";
import { useCurrentUser } from "../hooks/use-current-user";

export type RequireAuthProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
};

/**
 * Declaratively renders children only if the user is authenticated.
 * Used for conditional rendering (e.g., Review Form vs Sign-in prompt).
 * Does not perform automatic side-effect redirects.
 */
export function RequireAuth({
  children,
  fallback = null,
  loadingFallback = null,
}: RequireAuthProps) {
  const { data: user, isLoading } = useCurrentUser();
  const isAuthenticated = Boolean(user);

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
