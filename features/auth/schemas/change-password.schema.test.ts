import { describe, it, expect } from "vitest";
import { changePasswordSchema } from "./change-password.schema";

describe("changePasswordSchema", () => {
  it("validates valid change password values", () => {
    const validData = {
      currentPassword: "OldPassword123!",
      newPassword: "NewSecurePassword456!",
      confirmPassword: "NewSecurePassword456!",
    };

    const result = changePasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when current password is empty", () => {
    const data = {
      currentPassword: "",
      newPassword: "NewSecurePassword456!",
      confirmPassword: "NewSecurePassword456!",
    };

    const result = changePasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("fails when new password is shorter than 8 characters", () => {
    const data = {
      currentPassword: "OldPassword123!",
      newPassword: "short",
      confirmPassword: "short",
    };

    const result = changePasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("fails when new password and confirm password do not match", () => {
    const data = {
      currentPassword: "OldPassword123!",
      newPassword: "NewSecurePassword456!",
      confirmPassword: "DifferentPassword789!",
    };

    const result = changePasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("fails when new password is identical to current password", () => {
    const data = {
      currentPassword: "SamePassword123!",
      newPassword: "SamePassword123!",
      confirmPassword: "SamePassword123!",
    };

    const result = changePasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
