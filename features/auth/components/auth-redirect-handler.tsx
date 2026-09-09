"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthSessionStore } from "../stores/use-auth-session-store";
import { getCurrentRedirectPath } from "../utils/auth-redirect";

export function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSessionExpired = useAuthSessionStore((state) => state.isSessionExpired);
  const resetSession = useAuthSessionStore((state) => state.resetSession);

  useEffect(() => {
    if (!isSessionExpired) {
      return;
    }

    resetSession();

    // Prevent redirect loops if the user is already on an auth page
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (!isAuthPage) {
      const redirectTarget = getCurrentRedirectPath(pathname, searchParams);
      const targetUrl = `/login?redirect=${encodeURIComponent(redirectTarget)}`;

      router.replace(targetUrl);
    }
  }, [isSessionExpired, pathname, resetSession, router, searchParams]);

  return null;
}
