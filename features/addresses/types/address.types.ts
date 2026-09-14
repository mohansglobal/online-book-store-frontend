// Address domain types matching backend /api/v1/addresses contracts

export type AddressType = "BILLING" | "SHIPPING";

export interface Address {
  _id: string;
  user: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAddressInput = {
  addressType?: AddressType;
  fullName: string;
  email: string;
  mobileNumber: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  apartment?: string;
  isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}

export interface SingleAddressResponse {
  success: boolean;
  message: string;
  data: Address | null;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}
