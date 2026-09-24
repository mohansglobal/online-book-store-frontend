import { z } from "zod";

// schema for identifier input (email or phone)
export const forgotPasswordIdentifierSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile number is required")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const cleanPhone = val.replace(/\s+/g, "").replace(/^\+91/, "");
        const isPhone = /^[6-9]\d{9}$/.test(cleanPhone);
        return isEmail || isPhone;
      },
      {
        message: "Please enter a valid email address or 10-digit mobile number",
      },
    ),
});

export type ForgotPasswordIdentifierFormValues = z.infer<
  typeof forgotPasswordIdentifierSchema
>;

// schema for 6-digit OTP verification
export const forgotPasswordOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must be numeric"),
});

export type ForgotPasswordOtpFormValues = z.infer<
  typeof forgotPasswordOtpSchema
>;

// schema for setting new password
export const forgotPasswordResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),
    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordResetFormValues = z.infer<
  typeof forgotPasswordResetSchema
>;
