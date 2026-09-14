"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { isApiClientError } from "@/lib/api";

import {
  useSendPhoneOtpMutation,
  useVerifyPhoneOtpMutation,
} from "../hooks/use-phone-otp";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 5 * 60;

type OtpVerificationFormProps = {
  mobileNumber: string;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onChangeNumber?: () => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function OtpVerificationForm({
  mobileNumber,
  onSuccess,
  onSwitchToLogin,
  onChangeNumber,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendOtpMutation = useSendPhoneOtpMutation();
  const verifyOtpMutation = useVerifyPhoneOtpMutation();

  const isVerifying = verifyOtpMutation.isPending;
  const isResending = sendOtpMutation.isPending;
  const isOtpComplete = otp.length === OTP_LENGTH;
  const canResend = timeLeft === 0 && !isResending;

  /*
   * OTP expiry countdown
   */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timeout = window.setTimeout(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [timeLeft]);

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
      const response = await sendOtpMutation.mutateAsync({
        mobileNumber,
      });

      setOtp("");
      setTimeLeft(OTP_EXPIRY_SECONDS);

      if (response?.data?.alreadySent) {
        toast.info(
          response.message ??
            "Your current OTP is still valid. Please check your messages.",
        );

        return;
      }

      toast.success(
        response?.message ?? "A new verification code has been sent.",
      );
    } catch (error) {
      const message = isApiClientError(error)
        ? error.message || "Failed to resend OTP. Please try again."
        : "Failed to resend OTP. Please try again.";

      toast.error(message);
    }
  }, [canResend, mobileNumber, sendOtpMutation]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOtpComplete) {
      setErrorMessage("Enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage(null);

    try {
      const response = await verifyOtpMutation.mutateAsync({
        mobileNumber,
        otp,
      });

      toast.success(
        response?.message ?? "Phone number verified successfully.",
      );

      onSuccess();
    } catch (error) {
      const message = isApiClientError(error)
        ? error.message || "The code is invalid or has expired."
        : "We couldn't verify the code. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-7">
      {/* Phone number */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Verification code sent to
            </p>

            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
              {mobileNumber}
            </p>
          </div>

          {onChangeNumber && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onChangeNumber}
              disabled={isVerifying}
              className="h-8 shrink-0 px-2.5 text-xs font-semibold text-accent hover:bg-accent/8 hover:text-accent"
            >
              Change
            </Button>
          )}
        </div>
      </div>

      {/* OTP */}
      <div className="space-y-4">
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-foreground">
            Enter verification code
          </p>

          <p className="text-xs leading-5 text-muted-foreground">
            Enter the 6-digit code sent to your mobile number.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={handleOtpChange}
            disabled={isVerifying}
            autoFocus
            aria-label="6-digit verification code"
          >
            <InputOTPGroup className="gap-2 sm:gap-2.5">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="
                    h-12 w-10
                    rounded-lg
                    border-border
                    bg-background
                    text-base
                    font-semibold
                    shadow-none
                    transition-all
                    first:rounded-lg
                    last:rounded-lg
                    data-[active=true]:border-accent
                    data-[active=true]:ring-2
                    data-[active=true]:ring-accent/15
                    sm:h-13
                    sm:w-12
                  "
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="min-h-5 text-center">
          {errorMessage ? (
            <p
              role="alert"
              className="animate-in fade-in text-xs font-medium text-destructive"
            >
              {errorMessage}
            </p>
          ) : isOtpComplete ? (
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Code ready to verify
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              The code contains {OTP_LENGTH} digits.
            </p>
          )}
        </div>
      </div>

      {/* Resend */}
      <div className="rounded-lg bg-muted/40 px-3.5 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the code?
          </p>

          {timeLeft > 0 ? (
            <div className="flex shrink-0 items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Resend in</span>

              <span className="min-w-10 font-mono font-semibold tabular-nums text-foreground">
                {formatTime(timeLeft)}
              </span>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={!canResend}
              className="h-7 shrink-0 px-2 text-xs font-semibold text-accent hover:bg-accent/8 hover:text-accent"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <RefreshCw className="mr-1.5 size-3.5" />
                  Resend code
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={!isOtpComplete || isVerifying}
          className="
            h-11
            w-full
            rounded-lg
            bg-accent
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:bg-accent-hover
            disabled:shadow-none
          "
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Verifying code...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onSwitchToLogin}
          disabled={isVerifying}
          className="h-10 w-full text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}