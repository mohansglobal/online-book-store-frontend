"use client";

import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressFormFields, type AddressFormData } from "./address-form-fields";
import type {
  Address,
  AddressType,
  CreateAddressInput,
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
  onSubmit: (payload: CreateAddressInput, addressId?: string) => Promise<void>;
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
  onSubmit: (payload: CreateAddressInput, addressId?: string) => Promise<void>;
  isSubmitting: boolean;
}

function AddressFormInner({
  addressToEdit,
  defaultType,
  initialUser,
  onClose,
  onSubmit,
  isSubmitting,
}: AddressFormInnerProps) {
  const isEditing = Boolean(addressToEdit);

  const [formData, setFormData] = useState<AddressFormData>(() => {
    if (addressToEdit) {
      return {
        addressType: addressToEdit.addressType,
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
      addressType: defaultType,
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
  });

  const handleFieldChange = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter the full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 7) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    if (!formData.streetAddress.trim()) {
      toast.error("Please enter the street address.");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter the city or town.");
      return;
    }
    if (!formData.postalCode.trim()) {
      toast.error("Please enter the PIN / Postcode.");
      return;
    }

    const payload: CreateAddressInput = {
      addressType: formData.addressType,
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
      await onSubmit(payload, addressToEdit?._id);
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4">
      <AddressFormFields
        formData={formData}
        onChange={handleFieldChange}
        showTypeSelector={true}
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
  isSubmitting = false,
}: AddressModalFormProps) {
  const isEditing = Boolean(addressToEdit);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <AddressFormInner
            key={addressToEdit?._id || "new-address"}
            addressToEdit={addressToEdit}
            defaultType={defaultType}
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
