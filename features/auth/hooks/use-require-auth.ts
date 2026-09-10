// action-level authentication requirement hook for public pages
"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "./use-current-user";
import { getCurrentRedirectPath } from "../utils/auth-redirect";
import type { User } from "../types/auth.types";

export type WithAuthOptions = {
  returnUrl?: string;
  onUnauthenticated?: () => void;
};

export interface UseRequireAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectToLogin: (customReturnUrl?: string) => void;
  withAuth: <Args extends unknown[]>(
    action: (...args: Args) => void | Promise<void>,
    options?: WithAuthOptions,
  ) => (...args: Args) => void;
}

/**
 * Hook for action-level authentication gating on public and hybrid pages
 * (e.g. Add to Wishlist, Buy Now, Write Review, Contact Seller).
 */
export function useRequireAuth(): UseRequireAuthReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user = null, isLoading } = useCurrentUser();

  const isAuthenticated = Boolean(user);

  const redirectToLogin = useCallback(
    (customReturnUrl?: string) => {
      const returnUrl =
        customReturnUrl || getCurrentRedirectPath(pathname, searchParams);
      const target = `/login?redirect=${encodeURIComponent(returnUrl)}`;
      router.push(target);
    },
    [pathname, router, searchParams],
  );

  const withAuth = useCallback(
    <Args extends unknown[]>(
      action: (...args: Args) => void | Promise<void>,
      options?: WithAuthOptions,
    ) => {
      return (...args: Args) => {
        // Guard: While auth state is resolving, avoid executing action or false redirect
        if (isLoading) {
          return;
        }

        if (!isAuthenticated) {
          options?.onUnauthenticated?.();
          redirectToLogin(options?.returnUrl);
          return;
        }

        action(...args);
      };
    },
    [isAuthenticated, isLoading, redirectToLogin],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    redirectToLogin,
    withAuth,
  };
}
