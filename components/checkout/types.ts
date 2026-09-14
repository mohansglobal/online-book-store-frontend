export type PaymentMethod = "online" | "cod";

export interface AddressDetails {
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  address: string;
  flatNo: string;
  postcode: string;
}

export const COUNTRIES = [
  "India",
  "Bangladesh",
  "United States",
  "United Kingdom",
] as const;

export const INDIAN_STATES = [
  "West Bengal",
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
] as const;

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
] as const;

export function getStatesList(country: string): readonly string[] {
  return country === "Bangladesh" ? BANGLADESH_DIVISIONS : INDIAN_STATES;
}
