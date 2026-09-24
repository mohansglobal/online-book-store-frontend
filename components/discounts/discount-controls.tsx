// Search and filter controls for manage discounts page
"use client";

import React from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DiscountStatusFilter } from "./discount-types";

interface DiscountControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: DiscountStatusFilter;
  onStatusFilterChange: (value: DiscountStatusFilter) => void;
  onReset: () => void;
  totalCount: number;
}

export function DiscountControls({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  totalCount,
}: DiscountControlsProps) {
  const isFiltered = Boolean(searchTerm.trim()) || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by book title, author, or ISBN..."
          className="h-10 pl-9 text-xs"
        />
      </div>

      {/* Filter Options and Reset */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-40">
          <Select
            value={statusFilter}
            onValueChange={(val) => onStatusFilterChange(val as DiscountStatusFilter)}
          >
            <SelectTrigger className="h-10 cursor-pointer text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <SlidersHorizontal size={13} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder="All Listings" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-50 border-border bg-surface">
              <SelectItem value="all" className="cursor-pointer text-xs">
                All Listings
              </SelectItem>
              <SelectItem value="discounted" className="cursor-pointer text-xs">
                Discounted Only
              </SelectItem>
              <SelectItem value="active" className="cursor-pointer text-xs">
                Active Only
              </SelectItem>
              <SelectItem value="inactive" className="cursor-pointer text-xs">
                Inactive Only
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isFiltered && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-10 gap-1.5 text-xs cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </Button>
        )}

        <div className="hidden h-5 w-px bg-border sm:block" />

        <span className="text-xs font-medium text-text-secondary tabular-nums">
          Total: <strong className="text-foreground">{totalCount}</strong>
        </span>
      </div>
    </div>
  );
}
