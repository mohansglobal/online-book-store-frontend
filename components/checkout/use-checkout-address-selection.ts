"use client";

import { useState } from "react";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  DualAddressInput,
  DualAddressResponse,
  SingleAddressResponse,
  UpdateAddressInput,
} from "@/features/addresses";

interface UseCheckoutAddressSelectionProps {
  addresses: Address[];
  defaultAddress?: Address;
  setDefaultAddress: (id: string) => Promise<SingleAddressResponse>;
  createAddress: (payload: CreateAddressInput) => Promise<SingleAddressResponse>;
  createDualAddress?: (payload: DualAddressInput) => Promise<DualAddressResponse>;
  updateAddress: (
    id: string,
    payload: UpdateAddressInput,
  ) => Promise<SingleAddressResponse>;
}

export function useCheckoutAddressSelection({
  addresses,
  defaultAddress,
  setDefaultAddress,
  createAddress,
  createDualAddress,
  updateAddress,
}: UseCheckoutAddressSelectionProps) {
  const [chosenBillingId, setChosenBillingId] = useState<string | null>(null);
  const [chosenShippingId, setChosenShippingId] = useState<string | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [modalAddressType, setModalAddressType] = useState<AddressType>("BILLING");

  // Derive preferred defaults separated by address type
  const billingAddresses = addresses.filter((a) => a.addressType === "BILLING");
  const shippingAddresses = addresses.filter((a) => a.addressType === "SHIPPING");

  const defaultBillingAddress =
    billingAddresses.find((a) => a.isDefault) || billingAddresses[0];

  const defaultShippingAddress =
    shippingAddresses.find((a) => a.isDefault) || shippingAddresses[0];

  // Purely derived selected IDs (avoids useEffect cascading renders)
  const selectedBillingId =
    chosenBillingId && addresses.some((a) => a._id === chosenBillingId)
      ? chosenBillingId
      : defaultBillingAddress?._id || defaultAddress?._id || addresses[0]?._id || null;

  const selectedShippingId =
    chosenShippingId && addresses.some((a) => a._id === chosenShippingId)
      ? chosenShippingId
      : defaultShippingAddress?._id || defaultAddress?._id || addresses[0]?._id || null;

  const selectedBillingAddress =
    addresses.find((a) => a._id === selectedBillingId) ||
    defaultBillingAddress ||
    defaultAddress ||
    null;

  const selectedShippingAddress = sameAsBilling
    ? selectedBillingAddress
    : addresses.find((a) => a._id === selectedShippingId) ||
      defaultShippingAddress ||
      selectedBillingAddress;

  const handleSelectBillingAddress = (id: string) => {
    setChosenBillingId(id);
    const target = addresses.find((a) => a._id === id);
    if (target && !target.isDefault) {
      void setDefaultAddress(id);
    }
  };

  const handleSelectShippingAddress = (id: string) => {
    setChosenShippingId(id);
    const target = addresses.find((a) => a._id === id);
    if (target && !target.isDefault) {
      void setDefaultAddress(id);
    }
  };

  const handleOpenAddModal = (type: AddressType = "BILLING") => {
    setAddressToEdit(null);
    setModalAddressType(type);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setModalAddressType(address.addressType);
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (
    payload: CreateAddressInput,
    addressId?: string,
  ): Promise<SingleAddressResponse> => {
    if (addressId) {
      const res = await updateAddress(addressId, payload);
      if (res?.data?._id) {
        if (payload.addressType === "SHIPPING") {
          setChosenShippingId(res.data._id);
        } else {
          setChosenBillingId(res.data._id);
        }
      }
      return res;
    }

    const res = await createAddress(payload);
    if (res?.data?._id) {
      if (payload.addressType === "SHIPPING") {
        setChosenShippingId(res.data._id);
        setSameAsBilling(false);
      } else {
        setChosenBillingId(res.data._id);
      }
    }
    return res;
  };

  const handleDualAddressSubmit = async (
    payload: DualAddressInput,
  ): Promise<DualAddressResponse | void> => {
    if (!createDualAddress) {
      return;
    }

    const res = await createDualAddress(payload);
    if (res?.data) {
      const billingId = res.data.billingAddress._id;
      const shippingId = res.data.shippingAddress._id;

      setChosenBillingId(billingId);
      setChosenShippingId(shippingId);
      setSameAsBilling(payload.sameAsBilling);
    }
    return res;
  };

  return {
    billingAddresses,
    shippingAddresses,
    selectedBillingId,
    selectedShippingId,
    selectedBillingAddress,
    selectedShippingAddress,
    sameAsBilling,
    setSameAsBilling,
    handleSelectBillingAddress,
    handleSelectShippingAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    addressToEdit,
    modalAddressType,
    handleOpenAddModal,
    handleEditAddress,
    handleAddressSubmit,
    handleDualAddressSubmit,
  };
}
