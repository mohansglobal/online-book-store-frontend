import { describe, it, expect, vi } from "vitest";
import { apiClient } from "@/lib/api";
import { sendPhoneOtp, verifyPhoneOtp } from "../api/auth.api";

vi.mock("@/lib/api", () => ({
  apiClient: {
    post: vi.fn(),
  },
  isApiClientError: vi.fn(),
}));

describe("Phone OTP API", () => {
  it("should send phone OTP successfully", async () => {
    const mockResponse = {
      success: true,
      message: "OTP sent successfully",
      data: { success: true, message: "OTP sent successfully" },
    };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await sendPhoneOtp({ mobileNumber: "+919876543210" });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/send-otp",
      { mobileNumber: "+919876543210" },
      { skipAuthRefresh: true },
    );
    expect(result).toEqual(mockResponse);
  });

  it("should verify phone OTP successfully", async () => {
    const mockResponse = {
      success: true,
      message: "Phone number verified successfully",
      data: { success: true, message: "Phone number verified successfully" },
    };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await verifyPhoneOtp({
      mobileNumber: "+919876543210",
      otp: "123456",
    });
    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/verify-otp",
      { mobileNumber: "+919876543210", otp: "123456" },
      { skipAuthRefresh: true },
    );
    expect(result).toEqual(mockResponse);
  });
});
