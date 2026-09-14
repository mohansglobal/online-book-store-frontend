"use client";

import React from "react";
import { Edit2, Trash2, Check, Phone, Mail } from "lucide-react";
import type { Address } from "@/features/addresses";

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isDeleting?: boolean;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
}: AddressCardProps) {
  // Combine address parts into a single string to save vertical space
  const fullAddressString = [
    address.apartment,
    address.streetAddress,
    address.city,
    `${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      onClick={onSelect}
      className={`group relative flex cursor-pointer flex-col rounded-md border px-3 py-2 transition-all duration-200 ${
        isSelected
          ? "border-accent bg-accent/[0.03] shadow-sm ring-1 ring-accent"
          : "border-border bg-surface hover:border-accent/40"
      }`}
    >
      {/* Top Row: Radio, Name, Badges, and Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <div
            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isSelected
                ? "border-accent bg-accent text-white"
                : "border-border bg-background group-hover:border-accent/60"
            }`}
          >
            {isSelected && <Check size={8} strokeWidth={3} />}
          </div>

          <span className="truncate text-[13px] font-semibold leading-none text-foreground">
            {address.fullName}
          </span>

          <div className="ml-1 flex shrink-0 items-center gap-1.5">
            {address.isDefault && (
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                DEFAULT
              </span>
            )}
            <span className="rounded bg-muted px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
              {address.addressType}
            </span>
          </div>
        </div>

        {/* Actions moved to header */}
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-accent"
          >
            <Edit2 size={11} />
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address._id);
            }}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Address Body & Bottom Row */}
      <div className="ml-5 mt-0.5">
        <p 
          className="line-clamp-1 text-[11px] text-muted-foreground" 
          title={fullAddressString}
        >
          {fullAddressString}
        </p>

        <div className="mt-1 flex items-center justify-between text-[10px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {address.mobileNumber && (
              <span className="flex items-center gap-1 font-mono text-muted-foreground">
                <Phone size={9} className="text-accent" />
                {address.mobileNumber}
              </span>
            )}
            {address.email && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Mail size={9} className="text-accent" />
                {address.email}
              </span>
            )}
          </div>

          {!address.isDefault && onSetDefault && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address._id);
              }}
              className="shrink-0 cursor-pointer font-medium text-accent hover:underline"
            >
              Set Default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}