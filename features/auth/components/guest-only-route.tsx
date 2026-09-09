"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "../hooks/use-current-user";
import { getSafePostLoginRedirect } from "../utils/auth-redirect";

type GuestOnlyRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * Client-side guard for guest-only pages (e.g. login/register).
 * Redirects authenticated users to their safe return destination or default role home.
 */
export function GuestOnlyRoute({ children, fallback }: GuestOnlyRouteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading || !user) return;

    const targetUrl = getSafePostLoginRedirect({
      redirect: searchParams.get("redirect"),
      role: user.role,
    });

    router.replace(targetUrl);
  }, [isLoading, user, searchParams, router]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-accent" />
        </div>
      )
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
