// Unit tests for account deletion and restoration schemas
import { describe, it, expect } from "vitest";
import {
  confirmAccountDeletionSchema,
  restoreAccountSchema,
} from "./account-deletion.schema";

describe("account-deletion.schema", () => {
  describe("confirmAccountDeletionSchema", () => {
    it("should accept valid payload with 6-digit OTP and exact confirmation", () => {
      const result = confirmAccountDeletionSchema.safeParse({
        otp: "123456",
        confirmation: "DELETE",
        reason: "Taking a break from reading",
      });

      expect(result.success).toBe(true);
    });

    it("should accept valid payload without optional reason", () => {
      const result = confirmAccountDeletionSchema.safeParse({
        otp: "987654",
        confirmation: "DELETE",
      });

      expect(result.success).toBe(true);
    });

    it("should reject OTP that is not 6 digits", () => {
      const shortOtp = confirmAccountDeletionSchema.safeParse({
        otp: "12345",
        confirmation: "DELETE",
      });
      expect(shortOtp.success).toBe(false);

      const nonNumericOtp = confirmAccountDeletionSchema.safeParse({
        otp: "12a456",
        confirmation: "DELETE",
      });
      expect(nonNumericOtp.success).toBe(false);
    });

    it("should reject confirmation phrase that is not exactly 'DELETE'", () => {
      const lowercase = confirmAccountDeletionSchema.safeParse({
        otp: "123456",
        confirmation: "delete",
      });
      expect(lowercase.success).toBe(false);

      const wrongWord = confirmAccountDeletionSchema.safeParse({
        otp: "123456",
        confirmation: "REMOVE",
      });
      expect(wrongWord.success).toBe(false);
    });

    it("should reject reason exceeding 500 characters", () => {
      const longReason = confirmAccountDeletionSchema.safeParse({
        otp: "123456",
        confirmation: "DELETE",
        reason: "A".repeat(501),
      });
      expect(longReason.success).toBe(false);
    });
  });

  describe("restoreAccountSchema", () => {
    it("should accept valid identifier and password", () => {
      const result = restoreAccountSchema.safeParse({
        identifier: "user@example.com",
        password: "SecretPassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty identifier or password", () => {
      const emptyId = restoreAccountSchema.safeParse({
        identifier: "",
        password: "SecretPassword123!",
      });
      expect(emptyId.success).toBe(false);

      const emptyPass = restoreAccountSchema.safeParse({
        identifier: "user@example.com",
        password: "",
      });
      expect(emptyPass.success).toBe(false);
    });
  });
});




