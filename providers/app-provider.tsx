"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { onUnauthorized } from "@/lib/api";
import {
  authKeys,
  LogoutAlertDialog,
  useAuthSessionStore,
} from "@/features/auth";

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient;
  }
}

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__TANSTACK_QUERY_CLIENT__ = queryClient;
    }

    // clear auth query cache and signal session expiration on global 401 unauthorized
    const unsubscribe = onUnauthorized(() => {
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      useAuthSessionStore.getState().setSessionExpired(true);
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <LogoutAlertDialog />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

