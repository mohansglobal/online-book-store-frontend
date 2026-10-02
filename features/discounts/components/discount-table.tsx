// Table container for seller discounts list using UI components (RadioGroup & Checkbox)
"use client";

import React, { useState } from "react";
import { Tag, CheckSquare, CircleDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { DiscountRow } from "./discount-row";
import type { SellerBookListingItem } from "@/features/books/types/listing.types";

interface DiscountTableProps {
  listings: SellerBookListingItem[];

  isLoading: boolean;

  page: number;

  limit: number;

  selectedListingIds: string[];

  onToggleSelectAll: () => void;

  onToggleSelectListing: (listingId: string) => void;

  onOpenEditModal: (listing: SellerBookListingItem) => void;
}

export function DiscountTable({
  listings,
  isLoading,
  page,
  limit,
  selectedListingIds,
  onToggleSelectAll,
  onToggleSelectListing,
  onOpenEditModal,
}: DiscountTableProps) {
  const [selectionMode, setSelectionMode] = useState<"checkbox" | "radio">("checkbox");

  const visibleIds = listings.map((l) => l._id);

  const isAllVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedListingIds.includes(id));

  const selectedRadioValue = selectedListingIds[0] || "";

  const handleRadioSelect = (listingId: string) => {
    onToggleSelectListing(listingId);
  };

  const TableContent = (
    <table className="w-full text-left text-sm">
      <thead className="select-none border-b border-border bg-surface-soft/60 text-[11px] tracking-wider text-text-secondary uppercase">
        <tr>
          <th className="w-12 px-3 py-3.5 text-center">
            <div className="flex items-center justify-center gap-1">
              {selectionMode === "checkbox" ? (
                <Checkbox
                  checked={isAllVisibleSelected}
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Select all listings on this page"
                  className="cursor-pointer"
                />
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground">SEL</span>
              )}
            </div>
          </th>

          <th className="w-12 px-3 py-3.5 text-center font-bold">SL</th>

          <th className="w-20 px-4 py-3.5 font-bold">Photo</th>

          <th className="px-4 py-3.5 font-bold">ISBN</th>

          <th className="min-w-[200px] px-4 py-3.5 font-bold">Book Info</th>

          <th className="w-36 px-4 py-3.5 font-bold">Price</th>

          <th className="w-36 px-4 py-3.5 font-bold">Discount</th>

          <th className="w-36 px-4 py-3.5 font-bold">Validity</th>

          <th className="w-28 px-4 py-3.5 text-center font-bold">Status</th>

          <th className="w-36 px-4 py-3.5 pr-6 text-right font-bold">
            <div className="flex items-center justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectionMode("checkbox")}
                title="Checkbox multi-select mode"
                className={`h-6 w-6 rounded text-muted-foreground hover:text-foreground cursor-pointer ${
                  selectionMode === "checkbox" ? "bg-accent/15 text-accent font-bold" : ""
                }`}
              >
                <CheckSquare size={13} />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectionMode("radio")}
                title="Radio button single-select mode"
                className={`h-6 w-6 rounded text-muted-foreground hover:text-foreground cursor-pointer ${
                  selectionMode === "radio" ? "bg-accent/15 text-accent font-bold" : ""
                }`}
              >
                <CircleDot size={13} />
              </Button>
            </div>
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="px-3 py-4 text-center">
                <Skeleton className="h-4 w-4 mx-auto rounded" />
              </td>

              <td className="px-3 py-4 text-center">
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
                <Skeleton className="h-4 w-20" />
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

            const isSelected = selectedListingIds.includes(listing._id);

            return (
              <DiscountRow
                key={listing._id}
                listing={listing}
                index={serialNumber}
                isSelected={isSelected}
                selectionMode={selectionMode}
                onToggleSelect={onToggleSelectListing}
                onOpenEditModal={onOpenEditModal}
              />
            );
          })
        ) : (
          <tr>
            <td colSpan={10} className="py-14 text-center text-muted-foreground">
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
  );

  return (
    <div className="overflow-x-auto">
      {selectionMode === "radio" ? (
        <RadioGroup
          value={selectedRadioValue}
          onValueChange={handleRadioSelect}
          className="gap-0"
        >
          {TableContent}
        </RadioGroup>
      ) : (
        TableContent
      )}
    </div>
  );
}
