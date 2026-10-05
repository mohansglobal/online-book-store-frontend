"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { isApiClientError, onUnauthorized } from "@/lib/api";
import {
  authKeys,
  AuthRedirectHandler,
  LogoutAlertDialog,
  useAuthSessionStore,
  useUserStore,
} from "@/features/auth";
import { useCartSync } from "@/features/cart";
import { useWishlistSync } from "@/features/wishlist";

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient;
  }
}

function CartSyncHandler() {
  useCartSync();
  return null;
}

function WishlistSyncHandler() {
  useWishlistSync();
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
            retry: (failureCount, error) => {
              if (isApiClientError(error) && error.code === "API_DISABLED") {
                return false;
              }
              return failureCount < 3;
            },
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
      const existingUser = queryClient.getQueryData(authKeys.me());

      if (existingUser) {
        useUserStore.getState().clearUser();
        queryClient.setQueryData(authKeys.me(), null);
        queryClient.removeQueries({
          predicate: (query) => {
            const firstKey = query.queryKey[0];
            return (
              firstKey === "orders" ||
              firstKey === "cart" ||
              firstKey === "wishlist" ||
              firstKey === "addresses" ||
              firstKey === "profile" ||
              firstKey === "seller"
            );
          },
        });
        useAuthSessionStore.getState().setSessionExpired(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartSyncHandler />
      <WishlistSyncHandler />
      {children}

      <LogoutAlertDialog />
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <Toaster
        position="top-right"
        closeButton
        duration={2000}
        gap={12}

        toastOptions={{
          classNames: {
            toast:
              "!relative !bg-background !border !border-border/40 !shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:!shadow-[0_8px_30px_rgb(0,0,0,0.2)] !rounded-xl !p-3.5 !pr-10 !items-center",

            title:
              "!text-sm !font-medium !text-foreground !tracking-tight",

            description:
              "!text-[13px] !text-muted-foreground !leading-relaxed",

            icon:
              "!mt-0 group-data-[type=error]:!text-red-500 group-data-[type=success]:!text-emerald-500 group-data-[type=warning]:!text-amber-500 group-data-[type=info]:!text-blue-500",

            closeButton:
              "!absolute !top-1/2 !-translate-y-1/2 !right-2.5 !left-auto !bottom-auto !bg-transparent !border-none !text-muted-foreground hover:!text-foreground hover:!bg-muted/50 !rounded-md !p-1 !transition-colors cursor-pointer",
          },
        }}
      />
    </QueryClientProvider>
  );
}
