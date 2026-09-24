// Table container for seller discounts list
"use client";

import React from "react";
import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscountRow } from "./discount-row";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";

interface DiscountTableProps {
  listings: SellerBookListingItem[];
  isLoading: boolean;
  page: number;
  limit: number;
  onOpenEditModal: (listing: SellerBookListingItem) => void;
}

export function DiscountTable({
  listings,
  isLoading,
  page,
  limit,
  onOpenEditModal,
}: DiscountTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="select-none border-b border-border bg-surface-soft/60 text-[11px] tracking-wider text-text-secondary uppercase">
          <tr>
            <th className="w-14 px-4 py-3.5 text-center font-bold">SL</th>
            <th className="w-20 px-4 py-3.5 font-bold">Photo</th>
            <th className="px-4 py-3.5 font-bold">ISBN</th>
            <th className="min-w-[200px] px-4 py-3.5 font-bold">Book Info</th>
            <th className="w-36 px-4 py-3.5 font-bold">Price</th>
            <th className="w-36 px-4 py-3.5 font-bold">Discount</th>
            <th className="w-28 px-4 py-3.5 font-bold">Validity</th>
            <th className="w-28 px-4 py-3.5 text-center font-bold">Status</th>
            <th className="w-36 px-4 py-3.5 pr-6 text-right font-bold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="px-4 py-4 text-center">
                  <Skeleton className="h-4 w-6 mx-auto" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-16 w-12 rounded-md" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-4 py-4 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </td>
                <td className="px-4 py-4 space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="px-4 py-4 text-center">
                  <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                </td>
                <td className="px-4 py-4 pr-6 text-right">
                  <Skeleton className="h-8 w-24 ml-auto rounded-md" />
                </td>
              </tr>
            ))
          ) : listings.length > 0 ? (
            listings.map((listing, index) => {
              const serialNumber = (page - 1) * limit + index + 1;

              return (
                <DiscountRow
                  key={listing._id}
                  listing={listing}
                  index={serialNumber}
                  onOpenEditModal={onOpenEditModal}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="py-14 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Tag size={32} aria-hidden="true" className="opacity-40 text-accent" />
                  <p className="text-sm font-medium text-foreground">No listings found</p>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your search criteria or add new book listings to manage discounts.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
