"use client";

import React, { useState } from "react";
import { Plus, Save, MapPin, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddressFormFields, type AddressFormData } from "./address-form-fields";
import { validateAddressData } from "./address-validation";
import { toast } from "sonner";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  SingleAddressResponse,
} from "@/features/addresses";

export interface SingleAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressType: AddressType;
  addressToEdit?: Address | null;
  initialUser?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  } | null;
  onSubmit?: (
    payload: CreateAddressInput,
    addressId?: string,
  ) => Promise<SingleAddressResponse | void>;
  isSubmitting?: boolean;
}

interface SingleAddressFormInnerProps {
  addressType: AddressType;
  addressToEdit?: Address | null;
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
  isSubmitting: boolean;
}

function SingleAddressFormInner({
  addressType,
  addressToEdit,
  initialUser,
  onClose,
  onSubmit,
  isSubmitting,
}: SingleAddressFormInnerProps) {
  const isEditing = Boolean(addressToEdit);
  const isShipping = addressType === "SHIPPING";
  const addressLabel = isShipping ? "Shipping Address" : "Billing Address";

  const createInitialData = (): AddressFormData => {
    if (addressToEdit) {
      return {
        addressType,
        fullName: addressToEdit.fullName,
        email: addressToEdit.email,
        mobileNumber: addressToEdit.mobileNumber,
        country: addressToEdit.country || "India",
        state: addressToEdit.state || "West Bengal",
        city: addressToEdit.city || "",
        postalCode: addressToEdit.postalCode || "",
        streetAddress: addressToEdit.streetAddress || "",
        apartment: addressToEdit.apartment || "",
        isDefault: addressToEdit.isDefault,
      };
    }

    return {
      addressType,
      fullName: initialUser?.name || "",
      email: initialUser?.email || "",
      mobileNumber: initialUser?.mobileNumber || "",
      country: "India",
      state: "West Bengal",
      city: "",
      postalCode: "",
      streetAddress: "",
      apartment: "",
      isDefault: true,
    };
  };

  const [formData, setFormData] = useState<AddressFormData>(createInitialData);

  const handleFieldChange = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErr = validateAddressData(formData, addressLabel);
    if (validationErr) {
      toast.error(validationErr);
      return;
    }

    const payload: CreateAddressInput = {
      addressType,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      country: formData.country,
      state: formData.state,
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim(),
      streetAddress: formData.streetAddress.trim(),
      apartment: formData.apartment?.trim() || undefined,
      isDefault: formData.isDefault,
    };

    try {
      await onSubmit?.(payload, addressToEdit?._id);
      toast.success(
        isEditing
          ? `${addressLabel} updated successfully!`
          : `${addressLabel} added successfully!`,
      );
      onClose();
    } catch {
      // Handled by API error toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4">
      <AddressFormFields
        formData={formData}
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
          ) : (
            <>
              <Plus size={14} />
              Save {isShipping ? "Shipping" : "Billing"} Address
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function SingleAddressModal({
  isOpen,
  onClose,
  addressType,
  addressToEdit,
  initialUser,
  onSubmit,
  isSubmitting = false,
}: SingleAddressModalProps) {
  const isEditing = Boolean(addressToEdit);
  const isShipping = addressType === "SHIPPING";

  const modalTitle = isEditing
    ? isShipping
      ? "Edit Shipping Address"
      : "Edit Billing Address"
    : isShipping
      ? "Add Shipping Address"
      : "Add Billing Address";

  const modalDescription = isShipping
    ? "Enter the delivery address where your books should be shipped."
    : "Enter your billing details for invoicing and payment receipts.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isShipping ? (
              <Truck size={20} className="text-accent shrink-0" />
            ) : (
              <MapPin size={20} className="text-accent shrink-0" />
            )}
            <DialogTitle className="font-display text-xl font-bold">
              {modalTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <SingleAddressFormInner
            key={addressToEdit?._id || `new-${addressType}`}
            addressType={addressType}
            addressToEdit={addressToEdit}
            initialUser={initialUser}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
