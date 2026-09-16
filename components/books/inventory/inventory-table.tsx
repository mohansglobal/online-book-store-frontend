// Table container for seller inventory
"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { InventoryRow } from "./inventory-row";
import { InventorySkeleton } from "./inventory-skeleton";
import type { SellerBookListingItem, StockOperation } from "@/features/books/types/listing.types";

interface InventoryTableProps {
  listings: SellerBookListingItem[];
  isLoading: boolean;
  page: number;
  limit: number;
  onUpdateStock: (listingId: string, operation: StockOperation, quantity: number, bookTitle: string) => void;
  onToggleStatus?: (listingId: string, currentStatus: boolean, bookTitle: string) => void;
  onDeleteListing?: (listingId: string, bookTitle: string) => void;
  updatingListingId?: string | null;
}

export function InventoryTable({
  listings,
  isLoading,
  page,
  limit,
  onUpdateStock,
  onToggleStatus,
  onDeleteListing,
  updatingListingId,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="select-none border-b border-border bg-surface-soft/60 text-[11px] tracking-wider text-text-secondary uppercase">
          <tr>
            <th className="w-14 px-4 py-3.5 text-center font-bold">SL</th>
            <th className="w-20 px-4 py-3.5 font-bold">Photo</th>
            <th className="px-4 py-3.5 font-bold">ISBN</th>
            <th className="min-w-[200px] px-4 py-3.5 font-bold">Book Info</th>
            <th className="w-40 px-4 py-3.5 text-center font-bold">Stock</th>
            <th className="w-32 px-4 py-3.5 text-center font-bold">Status</th>
            <th className="w-32 px-4 py-3.5 pr-6 text-right font-bold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading ? (
            <InventorySkeleton count={6} />
          ) : listings.length > 0 ? (
            listings.map((listing, index) => {
              const serialNumber = (page - 1) * limit + index + 1;

              return (
                <InventoryRow
                  key={listing._id}
                  listing={listing}
                  index={serialNumber}
                  onUpdateStock={onUpdateStock}
                  onToggleStatus={onToggleStatus}
                  onDeleteListing={onDeleteListing}
                  isUpdatingStock={updatingListingId === listing._id}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="py-12 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <BookOpen size={32} aria-hidden="true" className="opacity-40" />
                  <p className="text-sm font-medium">No products found</p>
                  <p className="text-xs">Try adjusting your search or status filter.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
