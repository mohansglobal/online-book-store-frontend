// auth domain types and role contracts

export type UserRole = "BUYER" | "SELLER";

export type User = {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  role: UserRole;
  profilePicture?: string | null;
  avatar?: string | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: UserRole;
};

export type LoginInput = {
  mobileNumber: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
  user: User;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: LoginResponseData;
};

export type CurrentUserResponse = {
  success: boolean;
  message?: string;
  data: User;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type RefreshTokenData = {
  accessToken: string;
};

export type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: RefreshTokenData;
};

export type AuthResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user: User;
    token?: string;
  };
};
