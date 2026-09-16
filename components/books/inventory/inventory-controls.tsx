// Controls bar for Seller Inventory page: Search, Status Filters, and Add Product
"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { StatusFilter } from "./inventory-types";

interface InventoryControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
}

const STATUS_OPTIONS: readonly StatusFilter[] = ["all", "active", "deactive"];

export function InventoryControls({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: InventoryControlsProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-b border-border bg-surface-soft/40 p-4 sm:flex-row sm:p-5">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search
          size={16}
          aria-hidden="true"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          placeholder="Search by Title, ISBN, Author..."
          aria-label="Search products"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9 rounded-md border-border bg-background pl-9 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-accent sm:text-sm"
        />
      </div>

      {/* Filters + Add Product Button */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {STATUS_OPTIONS.map((status) => {
            const isActive = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                aria-pressed={isActive}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  isActive
                    ? "bg-accent text-white shadow-xs"
                    : "border border-border bg-background text-text-secondary hover:bg-surface-hover"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            );
          })}
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <Link
          href="/add-book"
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-accent px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent-hover hover:shadow active:scale-[0.98]"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Add Product</span>
        </Link>
      </div>
    </div>
  );
}
