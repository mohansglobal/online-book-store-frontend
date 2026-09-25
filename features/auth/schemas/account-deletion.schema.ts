// Validation schemas for account deletion confirmation and account restoration
import { z } from "zod";

// Validates 2FA OTP, exact "DELETE" confirmation phrase, and optional reason
export const confirmAccountDeletionSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "Verification OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),

  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "DELETE", {
      message: 'You must type "DELETE" in capital letters to confirm',
    }),

  reason: z
    .string()
    .trim()
    .max(500, "Reason must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type ConfirmAccountDeletionFormValues = z.infer<
  typeof confirmAccountDeletionSchema
>;

// Validates identifier (email/phone) and password for restoring scheduled deleted account
export const restoreAccountSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or mobile number is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RestoreAccountFormValues = z.infer<typeof restoreAccountSchema>;
