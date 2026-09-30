"use client";

// Hook for managing checkout product quantities for Cart and Buy-Now modes
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { checkoutKeys } from "@/features/checkout";

interface UseCheckoutQuantityProps {
  isBuyNow: boolean;
  updateQuantity?: (bookListingId: string, quantity: number) => Promise<void>;
}

export function useCheckoutQuantity({
  isBuyNow,
  updateQuantity,
}: UseCheckoutQuantityProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = useCallback(
    async (bookListingId: string, quantity: number) => {
      if (quantity < 1) return;

      if (isBuyNow) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("quantity", String(quantity));
        router.replace(`/checkout?${params.toString()}`, { scroll: false });
        return;
      }

      try {
        setIsUpdating(true);
        if (updateQuantity) {
          await updateQuantity(bookListingId, quantity);
        }
        await queryClient?.invalidateQueries({ queryKey: checkoutKeys.all });
      } finally {
        setIsUpdating(false);
      }
    },
    [isBuyNow, searchParams, router, updateQuantity, queryClient],
  );

  return {
    handleUpdateQuantity,
    isUpdating,
  };
}
