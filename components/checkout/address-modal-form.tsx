"use client";

import React from "react";
import { Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressFormFields } from "./address-form-fields";
import { AddressModalTabs } from "./address-modal-tabs";
import { useAddressModalForm } from "./use-address-modal-form";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  DualAddressInput,
  DualAddressResponse,
  SingleAddressResponse,
} from "@/features/addresses";

interface AddressModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address | null;
  defaultType?: AddressType;
  initialUser?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  } | null;
  onSubmit?: (
    payload: CreateAddressInput,
    addressId?: string,
  ) => Promise<SingleAddressResponse | void>;
  onDualSubmit?: (
    payload: DualAddressInput,
  ) => Promise<DualAddressResponse | void>;
  isSubmitting?: boolean;
}

interface AddressFormInnerProps {
  addressToEdit?: Address | null;
  defaultType: AddressType;
  initialUser?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  } | null;
  onClose: () => void;
  onSubmit?: (
    payload: CreateAddressInput,
    addressId?: string,
  ) => Promise<SingleAddressResponse | void>;
  onDualSubmit?: (
    payload: DualAddressInput,
  ) => Promise<DualAddressResponse | void>;
  isSubmitting: boolean;
}

function AddressFormInner({
  addressToEdit,
  defaultType,
  initialUser,
  onClose,
  onSubmit,
  onDualSubmit,
  isSubmitting,
}: AddressFormInnerProps) {
  const {
    isEditing,
    activeTab,
    handleTabChange,
    currentData,
    useAsShipping,
    isSeparateMode,
    billingFilled,
    handleFieldChange,
    handleToggleSameAsBilling,
    handleSubmit,
  } = useAddressModalForm({
    addressToEdit,
    defaultType,
    initialUser,
    onClose,
    onSubmit,
    onDualSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4">
      {!isEditing && (
        <AddressModalTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          billingFilled={billingFilled}
          useAsShipping={useAsShipping}
          onToggleUseAsShipping={handleToggleSameAsBilling}
        />
      )}

      <AddressFormFields
        formData={currentData}
        onChange={handleFieldChange}
        showTypeSelector={false}
      />

      <div className="mt-5 flex gap-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 rounded-md border border-border bg-background text-xs font-semibold text-foreground hover:bg-surface-soft transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-10 rounded-md bg-accent text-xs font-bold text-white uppercase hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isEditing ? (
            <>
              <Save size={14} />
              Save Changes
            </>
          ) : isSeparateMode ? (
            <>
              <Save size={14} />
              Save Both Addresses
            </>
          ) : (
            <>
              <Plus size={14} />
              Save Address
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function AddressModalForm({
  isOpen,
  onClose,
  addressToEdit,
  defaultType = "BILLING",
  initialUser,
  onSubmit,
  onDualSubmit,
  isSubmitting = false,
}: AddressModalFormProps) {
  const isEditing = Boolean(addressToEdit);
  const resolvedType = addressToEdit?.addressType || defaultType;

  const modalTitle = isEditing
    ? resolvedType === "SHIPPING"
      ? "Edit Shipping Address"
      : "Edit Billing Address"
    : "Add Address Details";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <AddressFormInner
            key={addressToEdit?._id || `new-${defaultType}`}
            addressToEdit={addressToEdit}
            defaultType={defaultType}
            initialUser={initialUser}
            onClose={onClose}
            onSubmit={onSubmit}
            onDualSubmit={onDualSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
