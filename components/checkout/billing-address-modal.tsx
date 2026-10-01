"use client";

import React from "react";
import {
  SingleAddressModal,
  type SingleAddressModalProps,
} from "./single-address-modal";

export type BillingAddressModalProps = Omit<
  SingleAddressModalProps,
  "addressType"
>;

export function BillingAddressModal(props: BillingAddressModalProps) {
  return <SingleAddressModal {...props} addressType="BILLING" />;
}
