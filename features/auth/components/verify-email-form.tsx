"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isApiClientError } from "@/lib/api";
import { useVerifyEmailOtp } from "../hooks/use-verify-email-otp";
import { useResendEmailOtp } from "../hooks/use-resend-email-otp";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

type VerifyEmailFormProps = {
  email: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
};

export function VerifyEmailForm({
  email,
  onSuccess,
  onBackToLogin,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyMutation = useVerifyEmailOtp();
  const resendMutation = useResendEmailOtp();

  const isVerifying = verifyMutation.isPending;
  const isResending = resendMutation.isPending;
  const isOtpComplete = otp.length === OTP_LENGTH;
  const canResend = resendCooldown === 0 && !isResending;

  // 60-second countdown timer for Resend Code
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;

    setErrorMessage(null);

    try {
      const response = await resendMutation.mutateAsync({ email });

      setOtp("");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);

      toast.success(
        response.message || "A new verification code has been sent to your email.",
      );
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        toast.error(err.message || "Failed to resend verification code.");
      } else {
        toast.error("Failed to resend verification code.");
      }
    }
  }, [canResend, email, resendMutation]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpComplete || isVerifying || !email) return;

    setErrorMessage(null);

    try {
      const res = await verifyMutation.mutateAsync({
        email,
        otp,
      });

      toast.success("Email verified successfully! Welcome to Online BookStore.");

      if (onSuccess) {
        onSuccess();
      } else {
        const userRole = res.data?.user?.role;
        const destination = userRole === "SELLER" ? "/dashboard" : "/";
        router.push(destination);
      }
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        setErrorMessage(err.message || "Invalid or expired verification code.");
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Verify Your Email
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-foreground break-all">{email || "your email"}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        <div className="flex flex-col items-center space-y-3">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={handleOtpChange}
            disabled={isVerifying}
            autoFocus
          >
            <InputOTPGroup className="gap-2 sm:gap-2.5">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-11 w-10 sm:h-12 sm:w-11 rounded-lg border text-base sm:text-lg font-semibold shadow-xs transition-colors"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errorMessage && (
            <p className="text-xs font-medium text-destructive text-center">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive code?"}
          </span>
          <button
            type="button"
            disabled={!canResend}
            onClick={handleResend}
            className={`flex items-center gap-1 font-medium transition-colors ${
              canResend
                ? "text-accent hover:underline cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
            Resend Code
          </button>
        </div>

        <Button
          type="submit"
          disabled={!isOtpComplete || isVerifying}
          className="h-11 w-full bg-accent font-semibold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.99] cursor-pointer"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying Email...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify Email
            </>
          )}
        </Button>

        <div className="pt-2 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (onBackToLogin) {
                onBackToLogin();
              } else {
                router.push("/login");
              }
            }}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
