"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isApiClientError } from "@/lib/api";
import { useForgotPasswordMutation } from "../hooks/use-forgot-password";
import { useVerifyResetOtpMutation } from "../hooks/use-verify-reset-otp";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

type ForgotPasswordOtpStepProps = {
  identifier: string;
  displayIdentifier?: string;
  onVerified: (resetToken: string) => void;
  onChangeContact: () => void;
  onBackToLogin: () => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function ForgotPasswordOtpStep({
  identifier,
  displayIdentifier,
  onVerified,
  onChangeContact,
  onBackToLogin,
}: ForgotPasswordOtpStepProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resendMutation = useForgotPasswordMutation();
  const verifyOtpMutation = useVerifyResetOtpMutation();

  const isVerifying = verifyOtpMutation.isPending;
  const isResending = resendMutation.isPending;
  const isOtpComplete = otp.length === OTP_LENGTH;
  const canResend = resendCooldown === 0 && !isResending;

  // countdown timers
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setErrorMessage(null);

    try {
      const response = await resendMutation.mutateAsync({ identifier });

      setOtp("");
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);

      toast.success(response.message || "A new reset code has been sent!");
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        toast.error(err.message || "Failed to resend reset code.");
      } else {
        toast.error("Failed to resend reset code.");
      }
    }
  }, [canResend, identifier, resendMutation]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpComplete || isVerifying) return;

    setErrorMessage(null);

    try {
      const res = await verifyOtpMutation.mutateAsync({
        identifier,
        otp,
      });

      const resetToken = res.data?.resetToken;
      if (!resetToken) {
        throw new Error("Reset token missing from verification response.");
      }

      toast.success(res.message || "Verification successful!");
      onVerified(resetToken);
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        setErrorMessage(err.message || "Invalid or expired verification code.");
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    }
  };

  const shownContact = displayIdentifier || identifier;

  return (
    <form onSubmit={handleVerify} className="space-y-5">
      <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">Verification code sent to</p>
        <p className="font-semibold text-foreground text-sm tracking-wide mt-0.5 break-all">
          {shownContact}
        </p>
        <button
          type="button"
          onClick={onChangeContact}
          className="text-xs text-accent hover:underline mt-1 font-medium cursor-pointer"
        >
          Change email or phone
        </button>
      </div>

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
        <span>Expires in: {formatTime(timeLeft)}</span>
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
          {canResend ? "Resend code" : `Resend in ${resendCooldown}s`}
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
            Verifying Code...
          </>
        ) : (
          <>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verify & Continue
          </>
        )}
      </Button>

      <div className="pt-2 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBackToLogin}
          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}
