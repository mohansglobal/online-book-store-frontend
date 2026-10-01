"use client";

import React from "react";
import {
  SingleAddressModal,
  type SingleAddressModalProps,
} from "./single-address-modal";

export type ShippingAddressModalProps = Omit<
  SingleAddressModalProps,
  "addressType"
>;

export function ShippingAddressModal(props: ShippingAddressModalProps) {
  return <SingleAddressModal {...props} addressType="SHIPPING" />;
}
