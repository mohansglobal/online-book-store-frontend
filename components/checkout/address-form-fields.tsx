"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, getStatesList } from "./types";
import type { AddressType } from "@/features/addresses";

export interface AddressFormData {
  addressType: AddressType;
  fullName: string;
  email: string;
  mobileNumber: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  apartment?: string;
  isDefault: boolean;
}

interface AddressFormFieldsProps {
  formData: AddressFormData;
  onChange: <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K],
  ) => void;
  showTypeSelector?: boolean;
}

const INPUT_BASE_CLASS =
  "h-9 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm";

export function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1 block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export function AddressFormFields({
  formData,
  onChange,
  showTypeSelector = true,
}: AddressFormFieldsProps) {
  return (
    <div className="space-y-3">
      {/* Address Type Selector */}
      {showTypeSelector && (
        <div>
          <FieldLabel required>Address Type</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange("addressType", "BILLING")}
              className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                formData.addressType === "BILLING"
                  ? "border-accent bg-accent/10 text-accent font-bold"
                  : "border-border bg-background text-muted-foreground hover:bg-surface-soft"
              }`}
            >
              Billing Address
            </button>
            <button
              type="button"
              onClick={() => onChange("addressType", "SHIPPING")}
              className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                formData.addressType === "SHIPPING"
                  ? "border-accent bg-accent/10 text-accent font-bold"
                  : "border-border bg-background text-muted-foreground hover:bg-surface-soft"
              }`}
            >
              Shipping Address
            </button>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <FieldLabel required>Full Name</FieldLabel>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="e.g. Soumya Roy"
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* Email & Mobile */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="name@example.com"
            className={INPUT_BASE_CLASS}
          />
        </div>
        <div>
          <FieldLabel required>Mobile Number</FieldLabel>
          <input
            type="tel"
            required
            value={formData.mobileNumber}
            onChange={(e) => onChange("mobileNumber", e.target.value)}
            placeholder="+91 or 10-digit number"
            className={`${INPUT_BASE_CLASS} font-mono`}
          />
        </div>
      </div>

      {/* Country & State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>Country</FieldLabel>
          <Select
            value={formData.country}
            onValueChange={(val) => {
              onChange("country", val);
              onChange("state", val === "Bangladesh" ? "Dhaka" : "West Bengal");
            }}
          >
            <SelectTrigger className="h-9 w-full border-border bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {COUNTRIES.map((c) => (
                <SelectItem
                  key={c}
                  value={c}
                  className="text-xs sm:text-sm cursor-pointer"
                >
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <FieldLabel required>State / Division</FieldLabel>
          <Select
            value={formData.state}
            onValueChange={(val) => onChange("state", val)}
          >
            <SelectTrigger className="h-9 w-full border-border bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {getStatesList(formData.country).map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className="text-xs sm:text-sm cursor-pointer"
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* City & PIN */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>City / Town</FieldLabel>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="e.g. Kolkata"
            className={INPUT_BASE_CLASS}
          />
        </div>
        <div>
          <FieldLabel required>PIN / Postcode</FieldLabel>
          <input
            type="text"
            required
            value={formData.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            placeholder="e.g. 700001"
            className={`${INPUT_BASE_CLASS} font-mono`}
          />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <FieldLabel required>Street Address</FieldLabel>
        <input
          type="text"
          required
          value={formData.streetAddress}
          onChange={(e) => onChange("streetAddress", e.target.value)}
          placeholder="Building, street, and area"
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* Apartment */}
      <div>
        <FieldLabel>Apartment / Suite / Unit (Optional)</FieldLabel>
        <input
          type="text"
          value={formData.apartment || ""}
          onChange={(e) => onChange("apartment", e.target.value)}
          placeholder="Flat 4B, Tower 2, etc."
          className={INPUT_BASE_CLASS}
        />
      </div>

      {/* Set as Default */}
      <label className="flex cursor-pointer items-center gap-2 pt-1">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => onChange("isDefault", e.target.checked)}
          className="h-4 w-4 rounded accent-accent cursor-pointer"
        />
        <span className="text-xs font-semibold text-text-secondary">
          Set as my default address
        </span>
      </label>
    </div>
  );
}
