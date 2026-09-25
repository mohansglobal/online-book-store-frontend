// auth domain types and role contracts

export type UserRole = "BUYER" | "SELLER" | "ADMIN";


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

export type ForgotPasswordInput = {
  identifier: string;
};

export type ForgotPasswordResponseData = {
  identifier: string;
  expiresInSeconds?: number;
};

export type ForgotPasswordResponse = {
  success: boolean;
  message: string;
  data?: ForgotPasswordResponseData;
};

export type VerifyResetOtpInput = {
  identifier: string;
  otp: string;
};

export type VerifyResetOtpResponseData = {
  resetToken: string;
};

export type VerifyResetOtpResponse = {
  success: boolean;
  message: string;
  data: VerifyResetOtpResponseData;
};

export type ResetPasswordInput = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

// Account deletion info and policy
export type AccountDeletionInfo = {
  isScheduledForDeletion: boolean;
  deletionStatus: "NONE" | "SCHEDULED" | "PERMANENTLY_DELETED";
  deletionRequestedAt: string | null;
  scheduledPermanentDeletionAt: string | null;
  daysRemaining: number | null;
  gracePeriodDays: number;
  warning: string;
  willBeDeleted: string[];
  willBeRetained: string[];
  cancellationPolicy: string;
  confirmationPhrase: string;
};

export type AccountDeletionInfoResponse = {
  success: boolean;
  message: string;
  data: AccountDeletionInfo;
};

// Deletion verification OTP dispatch
export type SendDeletionOtpDestinations = {
  email?: string;
  mobile?: string;
};

export type SendDeletionOtpData = {
  message: string;
  expiresInMinutes: number;
  destinations?: SendDeletionOtpDestinations;
};

export type SendDeletionOtpResponse = {
  success: boolean;
  message: string;
  data?: SendDeletionOtpData;
};

// Confirm account deletion
export type ConfirmAccountDeletionInput = {
  otp: string;
  confirmation: string;
  reason?: string;
};

export type ConfirmAccountDeletionData = {
  scheduledPermanentDeletionAt: string;
  gracePeriodDays: number;
};

export type ConfirmAccountDeletionResponse = {
  success: boolean;
  message: string;
  data?: ConfirmAccountDeletionData;
};

// Cancel account deletion (restore authenticated)
export type CancelAccountDeletionResponse = {
  success: boolean;
  message: string;
};

// Restore account (public via credentials)
export type RestoreAccountInput = {
  identifier: string;
  password: string;
};

export type RestoreAccountResponse = {
  success: boolean;
  message: string;
};
