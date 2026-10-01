import { describe, it, expect } from "vitest";
import {
  forgotPasswordIdentifierSchema,
  forgotPasswordOtpSchema,
  forgotPasswordResetSchema,
} from "./forgot-password.schema";

import { AUTH_MODE } from "../constants/auth.constants";

describe("forgotPasswordIdentifierSchema", () => {
  it("validates valid email addresses", () => {
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "user@example.com" })
        .success,
    ).toBe(true);
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "john.doe+test@gmail.co.in" })
        .success,
    ).toBe(true);
  });

  it("handles phone numbers based on AUTH_MODE", () => {
    const isBoth = AUTH_MODE === "both";
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "9876543210" })
        .success,
    ).toBe(isBoth);
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "+919876543210" })
        .success,
    ).toBe(isBoth);
  });


  it("fails on invalid email and phone numbers", () => {
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "not-an-email" })
        .success,
    ).toBe(false);
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "12345" }).success,
    ).toBe(false);
    expect(
      forgotPasswordIdentifierSchema.safeParse({ identifier: "" }).success,
    ).toBe(false);
  });
});

describe("forgotPasswordOtpSchema", () => {
  it("validates 6-digit numeric OTPs", () => {
    expect(forgotPasswordOtpSchema.safeParse({ otp: "123456" }).success).toBe(
      true,
    );
  });

  it("fails on invalid OTPs", () => {
    expect(forgotPasswordOtpSchema.safeParse({ otp: "12345" }).success).toBe(
      false,
    );
    expect(forgotPasswordOtpSchema.safeParse({ otp: "1234567" }).success).toBe(
      false,
    );
    expect(forgotPasswordOtpSchema.safeParse({ otp: "abcdef" }).success).toBe(
      false,
    );
  });
});

describe("forgotPasswordResetSchema", () => {
  it("validates when new passwords match and are at least 8 characters", () => {
    const valid = forgotPasswordResetSchema.safeParse({
      newPassword: "StrongPassword123!",
      confirmPassword: "StrongPassword123!",
    });
    expect(valid.success).toBe(true);
  });

  it("fails when password is shorter than 8 characters", () => {
    const invalid = forgotPasswordResetSchema.safeParse({
      newPassword: "short",
      confirmPassword: "short",
    });
    expect(invalid.success).toBe(false);
  });

  it("fails when passwords do not match", () => {
    const mismatch = forgotPasswordResetSchema.safeParse({
      newPassword: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });
    expect(mismatch.success).toBe(false);
  });
});
