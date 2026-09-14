"use client";

import React from "react";
import { Undo2, Info, Plus, Truck, Phone, Mail } from "lucide-react";
import { AddressCard } from "./address-card";
import type { Address } from "@/features/addresses";

interface CheckoutShippingFormProps {
  selectedBillingAddress: Address | null;
  addresses: Address[];
  selectedShippingAddressId: string | null;
  onSelectShippingAddress: (id: string) => void;
  onOpenAddModal: () => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  sameAsBilling: boolean;
  onSetSameAsBilling: (val: boolean) => void;
}

export function CheckoutShippingForm({
  selectedBillingAddress,
  addresses,
  selectedShippingAddressId,
  onSelectShippingAddress,
  onOpenAddModal,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  sameAsBilling,
  onSetSameAsBilling,
}: CheckoutShippingFormProps) {
  const fullBillingAddressString = selectedBillingAddress
    ? [
        selectedBillingAddress.apartment,
        selectedBillingAddress.streetAddress,
        selectedBillingAddress.city,
        `${selectedBillingAddress.state} ${selectedBillingAddress.postalCode}`,
        selectedBillingAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <section
      className={`flex flex-col justify-between rounded-xl border bg-surface p-5 transition-all ${
        sameAsBilling
          ? "border-border opacity-95 shadow-xs"
          : "border-accent ring-1 ring-accent/30 shadow-sm"
      }`}
    >
      <div>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-accent" />
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Shipping & Delivery
            </h2>
          </div>
          {sameAsBilling && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase dark:bg-emerald-950/60 dark:text-emerald-400">
              Same as Billing
            </span>
          )}
        </div>

        {sameAsBilling ? (
          /* Same as Billing Summary View */
          <div className="space-y-3">
            {selectedBillingAddress ? (
              <div className="rounded-md border border-border bg-surface-soft/60 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate text-[13px] font-semibold leading-none text-foreground">
                      {selectedBillingAddress.fullName}
                    </span>
                    <span className="rounded bg-muted px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivering Here
                    </span>
                  </div>
                </div>

                <div className="mt-1">
                  <p
                    className="line-clamp-1 text-[11px] text-muted-foreground"
                    title={fullBillingAddressString}
                  >
                    {fullBillingAddressString}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                    {selectedBillingAddress.mobileNumber && (
                      <span className="flex items-center gap-1 font-mono text-muted-foreground">
                        <Phone size={9} className="text-accent" />
                        {selectedBillingAddress.mobileNumber}
                      </span>
                    )}
                    {selectedBillingAddress.email && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Mail size={9} className="text-accent" />
                        {selectedBillingAddress.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-surface-soft/40 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Select or add a billing address on the left to preview shipping details.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSetSameAsBilling(false)}
              className="w-full cursor-pointer rounded-lg border border-dashed border-border py-2 text-xs font-semibold text-text-secondary transition-all hover:border-accent hover:text-accent hover:bg-surface-soft/60"
            >
              + Deliver to a different address
            </button>

            <div className="flex items-start gap-2 rounded-lg bg-blue-50/70 p-3 text-[11px] text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
              <Info size={14} className="mt-0.5 shrink-0" />
              <p>
                Books are packed securely in moisture-resistant bubble-wrap packaging and dispatched within 24–48 hours.
              </p>
            </div>
          </div>
        ) : (
          /* Separate Shipping Addresses Selection */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Delivery Address
              </p>
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline cursor-pointer"
              >
                <Plus size={13} />
                Add Shipping Address
              </button>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    isSelected={selectedShippingAddressId === address._id}
                    onSelect={() => onSelectShippingAddress(address._id)}
                    onEdit={onEditAddress}
                    onDelete={onDeleteAddress}
                    onSetDefault={onSetDefaultAddress}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center bg-surface-soft/40">
                <p className="text-xs text-muted-foreground">
                  No shipping addresses saved yet.
                </p>
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-accent-hover cursor-pointer"
                >
                  <Plus size={14} />
                  Add Shipping Address
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!sameAsBilling && (
        <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
          <button
            type="button"
            onClick={() => onSetSameAsBilling(true)}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
          >
            <Undo2 size={13} className="shrink-0" />
            <span>Revert to same as Billing address</span>
          </button>
        </div>
      )}
    </section>
  );
}
