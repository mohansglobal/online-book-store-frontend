"use client";

import { useState } from "react";
import type {
  Address,
  AddressType,
  CreateAddressInput,
  SingleAddressResponse,
  UpdateAddressInput,
} from "@/features/addresses";

interface UseCheckoutAddressSelectionProps {
  addresses: Address[];
  defaultAddress?: Address;
  setDefaultAddress: (id: string) => Promise<SingleAddressResponse>;
  createAddress: (payload: CreateAddressInput) => Promise<SingleAddressResponse>;
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
  updateAddress,
}: UseCheckoutAddressSelectionProps) {
  const [chosenBillingId, setChosenBillingId] = useState<string | null>(null);
  const [chosenShippingId, setChosenShippingId] = useState<string | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [modalAddressType, setModalAddressType] = useState<AddressType>("BILLING");

  // Purely derived selected IDs (avoids useEffect cascading renders)
  const selectedBillingId =
    chosenBillingId && addresses.some((a) => a._id === chosenBillingId)
      ? chosenBillingId
      : defaultAddress?._id || addresses[0]?._id || null;

  const selectedShippingId =
    chosenShippingId && addresses.some((a) => a._id === chosenShippingId)
      ? chosenShippingId
      : defaultAddress?._id || addresses[0]?._id || null;

  const selectedBillingAddress =
    addresses.find((a) => a._id === selectedBillingId) || defaultAddress || null;

  const selectedShippingAddress = sameAsBilling
    ? selectedBillingAddress
    : addresses.find((a) => a._id === selectedShippingId) || selectedBillingAddress;

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
  ) => {
    if (addressId) {
      const res = await updateAddress(addressId, payload);
      if (res?.data?._id) {
        if (payload.addressType === "SHIPPING" && !sameAsBilling) {
          setChosenShippingId(res.data._id);
        } else {
          setChosenBillingId(res.data._id);
        }
      }
    } else {
      const res = await createAddress(payload);
      if (res?.data?._id) {
        if (payload.addressType === "SHIPPING" && !sameAsBilling) {
          setChosenShippingId(res.data._id);
        } else {
          setChosenBillingId(res.data._id);
        }
      }
    }
  };

  return {
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
  };
}
