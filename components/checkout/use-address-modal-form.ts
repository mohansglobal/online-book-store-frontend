"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  validateAddressData,
  isAddressMeaningfullyFilled,
} from "./address-validation";
import type { AddressFormData } from "./address-form-fields";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  DualAddressInput,
  DualAddressResponse,
  SingleAddressResponse,
} from "@/features/addresses";

interface UseAddressModalFormProps {
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
}

export function useAddressModalForm({
  addressToEdit,
  defaultType,
  initialUser,
  onClose,
  onSubmit,
  onDualSubmit,
}: UseAddressModalFormProps) {
  const isEditing = Boolean(addressToEdit);
  const resolvedType = addressToEdit?.addressType || defaultType;

  const [activeTab, setActiveTab] = useState<AddressType>(resolvedType);

  const createInitialData = (type: AddressType): AddressFormData => {
    if (addressToEdit) {
      return {
        addressType: type,
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
      addressType: type,
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

  const createCleanShippingData = (): AddressFormData => ({
    addressType: "SHIPPING",
    fullName: "",
    email: "",
    mobileNumber: "",
    country: "India",
    state: "West Bengal",
    city: "",
    postalCode: "",
    streetAddress: "",
    apartment: "",
    isDefault: false,
  });

  // Dedicated single address state for editing
  const [editData, setEditData] = useState<AddressFormData>(() =>
    createInitialData(resolvedType),
  );

  // Separate states for creating new addresses
  const [billingData, setBillingData] = useState<AddressFormData>(() =>
    createInitialData("BILLING"),
  );

  const [shippingData, setShippingData] = useState<AddressFormData>(() =>
    createCleanShippingData(),
  );

  const [useAsShipping, setUseAsShipping] = useState<boolean>(
    defaultType === "BILLING",
  );

  const currentData = isEditing
    ? editData
    : activeTab === "BILLING"
      ? billingData
      : shippingData;

  const handleFieldChange = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K],
  ) => {
    if (isEditing) {
      setEditData((prev) => ({ ...prev, [field]: value }));
      return;
    }

    if (field === "addressType") {
      setActiveTab(value as AddressType);
      return;
    }

    if (activeTab === "BILLING") {
      setBillingData((prev) => ({ ...prev, [field]: value }));
    } else {
      setUseAsShipping(false);
      setShippingData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleToggleSameAsBilling = (checked: boolean) => {
    setUseAsShipping(checked);

    if (checked) {
      setActiveTab("BILLING");
    } else {
      setShippingData(createCleanShippingData());
      setActiveTab("SHIPPING");
    }
  };

  const handleTabChange = (tab: AddressType) => {
    setActiveTab(tab);

    if (tab === "SHIPPING" && useAsShipping) {
      setUseAsShipping(false);
      setShippingData(createCleanShippingData());
    }
  };

  const toCreatePayload = (data: AddressFormData): CreateAddressInput => ({
    addressType: data.addressType,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    mobileNumber: data.mobileNumber.trim(),
    country: data.country,
    state: data.state,
    city: data.city.trim(),
    postalCode: data.postalCode.trim(),
    streetAddress: data.streetAddress.trim(),
    apartment: data.apartment?.trim() || undefined,
    isDefault: data.isDefault,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && addressToEdit) {
      const err = validateAddressData(currentData, "Address");
      if (err) {
        toast.error(err);
        return;
      }

      const payload = toCreatePayload(currentData);
      try {
        await onSubmit?.(payload, addressToEdit._id);
        onClose();
      } catch {
        // Handled by mutation toast
      }
      return;
    }

    // Validate billing address (Option A)
    const billingErr = validateAddressData(billingData, "Billing Address");
    if (billingErr) {
      setActiveTab("BILLING");
      toast.error(billingErr);
      return;
    }

    // If separate shipping is used, validate shipping address (Option B)
    if (!useAsShipping) {
      const shippingErr = validateAddressData(shippingData, "Shipping Address");
      if (shippingErr) {
        setActiveTab("SHIPPING");
        toast.error(shippingErr);
        return;
      }
    }

    // When dual submit is available, submit atomically to POST /api/v1/addresses/dual
    if (onDualSubmit) {
      const billingPayload = toCreatePayload({
        ...billingData,
        addressType: "BILLING",
      });

      const shippingPayload = useAsShipping
        ? undefined
        : toCreatePayload({
            ...shippingData,
            addressType: "SHIPPING",
            isDefault: false,
          });

      const dualPayload: DualAddressInput = {
        sameAsBilling: useAsShipping,
        billing: billingPayload,
        shipping: shippingPayload,
      };

      try {
        await onDualSubmit(dualPayload);
        onClose();
      } catch {
        // Handled by mutation toast
      }
      return;
    }

    // Fallback if only single onSubmit is provided
    try {
      const billingPayload = toCreatePayload({
        ...billingData,
        addressType: "BILLING",
      });

      if (!useAsShipping) {
        const shippingPayload = toCreatePayload({
          ...shippingData,
          addressType: "SHIPPING",
          isDefault: false,
        });

        await onSubmit?.(billingPayload);
        await onSubmit?.(shippingPayload);
        toast.success("Billing and shipping addresses saved successfully!");
      } else {
        await onSubmit?.(billingPayload);
      }

      onClose();
    } catch {
      // Handled by mutation toast
    }
  };

  const isSeparateMode =
    !isEditing &&
    !useAsShipping &&
    (isAddressMeaningfullyFilled(shippingData) || activeTab === "SHIPPING");

  const billingFilled = isAddressMeaningfullyFilled(billingData);

  return {
    isEditing,
    activeTab,
    setActiveTab,
    handleTabChange,
    currentData,
    useAsShipping,
    isSeparateMode,
    billingFilled,
    handleFieldChange,
    handleToggleSameAsBilling,
    handleSubmit,
  };
}
