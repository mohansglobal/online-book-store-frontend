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

export type UploadProfileImageData = {
  user: User;
  imageUrl: string;
  publicId?: string;
};

export type UploadProfileImageResponse = {
  success: boolean;
  message: string;
  data: UploadProfileImageData;
};

export type RemoveProfileImageResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type SendPhoneOtpInput = {
  mobileNumber?: string;
};

export type SendPhoneOtpData = {
  success: boolean;
  message: string;
  alreadySent?: boolean;
};

export type SendPhoneOtpResponse = {
  success: boolean;
  message: string;
  data: SendPhoneOtpData;
};

export type VerifyPhoneOtpInput = {
  mobileNumber?: string;
  otp: string;
};

export type VerifyPhoneOtpData = {
  success: boolean;
  message: string;
  user?: User;
};

export type VerifyPhoneOtpResponse = {
  success: boolean;
  message: string;
  data: VerifyPhoneOtpData;
};
