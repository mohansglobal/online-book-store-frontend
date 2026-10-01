import { z } from "zod";
import { AUTH_MODE } from "../constants/auth.constants";

// schema for identifier input (email or phone)
export const forgotPasswordIdentifierSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(
      1,
      AUTH_MODE === "email"
        ? "Email address is required"
        : "Email or mobile number is required",
    )
    .refine(
      (val) => {
        if (!val) return false;
        if (AUTH_MODE === "email") {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const cleanPhone = val.replace(/\s+/g, "").replace(/^\+91/, "");
        const isPhone = /^[6-9]\d{9}$/.test(cleanPhone);
        return isEmail || isPhone;
      },
      {
        message:
          AUTH_MODE === "email"
            ? "Please enter a valid email address"
            : "Please enter a valid email address or 10-digit mobile number",
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
