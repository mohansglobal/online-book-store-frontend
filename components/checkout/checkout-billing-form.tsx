"use client";

import React from "react";
import { Plus, MapPin } from "lucide-react";
import { AddressCard } from "./address-card";
import type { Address } from "@/features/addresses";

interface CheckoutBillingFormProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onOpenAddModal: () => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  sameAsBilling: boolean;
  onSameAsBillingChange: (checked: boolean) => void;
}

export function CheckoutBillingForm({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddModal,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  sameAsBilling,
  onSameAsBillingChange,
}: CheckoutBillingFormProps) {
  return (
    <section className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-xs">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center justify-center gap-2">
            <MapPin size={18} className="text-accent" />
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Billing & Contact Details
            </h2>
          </div>
        </div>

        {/* Address Content */}
        {addresses.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Billing Address
              </p>
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline cursor-pointer"
              >
                <Plus size={13} />
                Add New Address
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 gap-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  isSelected={selectedAddressId === address._id}
                  onSelect={() => onSelectAddress(address._id)}
                  onEdit={onEditAddress}
                  onDelete={onDeleteAddress}
                  onSetDefault={onSetDefaultAddress}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Address State */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center bg-surface-soft/40">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin size={22} />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              No Saved Addresses Found
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Add your billing address once to pre-fill it automatically for all your future orders.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-accent-hover cursor-pointer"
            >
              <Plus size={14} />
              Add New Address
            </button>
          </div>
        )}
      </div>

      {/* Same as Billing Checkbox */}
      <div className="mt-5 border-t border-border pt-3">
        <label className="group flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => onSameAsBillingChange(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded accent-accent"
          />
          <span className="text-xs font-semibold text-text-secondary group-hover:text-foreground">
            Shipping address is the same as Billing address
          </span>
        </label>
      </div>
    </section>
  );
}
