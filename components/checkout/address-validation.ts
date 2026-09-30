import type { AddressFormData } from "./address-form-fields";

// Validates required fields and format for address input data
export function validateAddressData(
  data: AddressFormData,
  label: string,
): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isIndia = data.country === "India";
  const cleanedMobile = data.mobileNumber.replace(/\D/g, "");
  const cleanedPin = data.postalCode.replace(/\s/g, "");

  if (data.fullName.trim().length < 3) {
    return `${label}: Please enter a valid full name (at least 3 characters).`;
  }

  if (!emailRegex.test(data.email.trim())) {
    return `${label}: Please enter a valid email address.`;
  }

  if (isIndia) {
    if (cleanedMobile.length !== 10 && cleanedMobile.length !== 12) {
      return `${label}: Please enter a valid 10-digit mobile number for India.`;
    }
  } else if (cleanedMobile.length < 7) {
    return `${label}: Please enter a valid mobile number.`;
  }

  if (!data.streetAddress.trim()) {
    return `${label}: Please enter the street address.`;
  }

  if (!data.city.trim()) {
    return `${label}: Please enter the city or town.`;
  }

  if (isIndia) {
    if (!/^\d{6}$/.test(cleanedPin)) {
      return `${label}: Please enter a valid 6-digit PIN code.`;
    }
  } else if (!data.postalCode.trim()) {
    return `${label}: Please enter a valid PIN / Postcode.`;
  }

  return null;
}

// Determines if the user has entered meaningful content for an address
export function isAddressMeaningfullyFilled(data: AddressFormData): boolean {
  const hasStreet = Boolean(data.streetAddress && data.streetAddress.trim().length > 0);
  const hasCity = Boolean(data.city && data.city.trim().length > 0);
  const hasPin = Boolean(data.postalCode && data.postalCode.trim().length > 0);

  return hasStreet || hasCity || hasPin;
}
