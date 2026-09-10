"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { onUnauthorized } from "@/lib/api";
import {
  authKeys,
  AuthRedirectHandler,
  LogoutAlertDialog,
  useAuthSessionStore,
} from "@/features/auth";
import { useCartSync } from "@/features/cart";

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient;
  }
}

function CartSyncHandler() {
  useCartSync();
  return null;
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
      <CartSyncHandler />
      {children}

      <LogoutAlertDialog />
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <Toaster
        position="top-right"
        closeButton
        gap={12}
        toastOptions={{
          classNames: {
            toast:
              "!bg-background !border !border-border/40 !shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:!shadow-[0_8px_30px_rgb(0,0,0,0.2)] !rounded-xl !p-4 !items-start",

            title:
              "!text-sm !font-medium !text-foreground !tracking-tight",

            description:
              "!text-[13px] !text-muted-foreground !leading-relaxed",

            icon:
              "!mt-0.5 group-data-[type=error]:!text-red-500 group-data-[type=success]:!text-emerald-500 group-data-[type=warning]:!text-amber-500 group-data-[type=info]:!text-blue-500",

            closeButton:
              "!bg-transparent !border-none !text-muted-foreground hover:!text-foreground hover:!bg-muted/50 !transition-colors !right-2 !top-2",
          },
        }}
      />
    </QueryClientProvider>
  );
}
