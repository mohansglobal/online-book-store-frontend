"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiClientError } from "@/lib/api";
import { useForgotPasswordMutation } from "../hooks/use-forgot-password";
import {
  forgotPasswordIdentifierSchema,
  type ForgotPasswordIdentifierFormValues,
} from "../schemas/forgot-password.schema";
import { AUTH_MODE } from "../constants/auth.constants";

type ForgotPasswordPhoneStepProps = {
  initialIdentifier?: string;
  onCodeSent: (identifier: string, displayIdentifier?: string) => void;
  onBackToLogin: () => void;
};

export function ForgotPasswordPhoneStep({
  initialIdentifier = "",
  onCodeSent,
  onBackToLogin,
}: ForgotPasswordPhoneStepProps) {
  const cleanInitial = initialIdentifier.replace(/^\+91/, "");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordIdentifierFormValues>({
    resolver: zodResolver(forgotPasswordIdentifierSchema),
    defaultValues: {
      identifier: cleanInitial,
    },
  });

  const forgotPasswordMutation = useForgotPasswordMutation();
  const isSending = forgotPasswordMutation.isPending;

  const currentIdentifier = watch("identifier") || "";
  const isEmailInput = AUTH_MODE === "email" || currentIdentifier.includes("@");

  const onSubmit = async (values: ForgotPasswordIdentifierFormValues) => {
    try {
      const rawInput = values.identifier.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawInput);

      const normalizedIdentifier = isEmail || AUTH_MODE === "email"
        ? rawInput.toLowerCase()
        : rawInput.startsWith("+")
          ? rawInput
          : `+91${rawInput.replace(/^0+/, "")}`;

      const res = await forgotPasswordMutation.mutateAsync({
        identifier: normalizedIdentifier,
      });

      toast.success(
        res.message || "Password reset OTP sent to your registered contact.",
      );

      const displayIdentifier = res.data?.identifier || normalizedIdentifier;
      onCodeSent(normalizedIdentifier, displayIdentifier);
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        if (err.fieldErrors?.identifier) {
          setError("identifier", { message: err.fieldErrors.identifier[0] });
        }
        toast.error(
          err.message || "Unable to send reset code. Please check your input.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="forgot-identifier">
          {AUTH_MODE === "email"
            ? "Email Address"
            : "Email Address or Mobile Number"}
        </Label>
        <div className="group relative">
          {isEmailInput ? (
            <Mail
              size={16}
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
            />
          ) : (
            <Phone
              size={16}
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
            />
          )}
          <Input
            id="forgot-identifier"
            type={AUTH_MODE === "email" ? "email" : "text"}
            placeholder={
              AUTH_MODE === "email"
                ? "you@gmail.com"
                : "e.g. name@example.com or 9876543210"
            }
            autoComplete="username"
            {...register("identifier")}
            className={`h-11 pl-10 ${
              errors.identifier
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
          />
        </div>
        {errors.identifier && (
          <p className="text-xs text-destructive">{errors.identifier.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {AUTH_MODE === "email"
            ? "Enter your registered email to receive a 6-digit recovery code."
            : "Enter your registered email or phone to receive a 6-digit recovery code."}
        </p>
      </div>


      <Button
        type="submit"
        disabled={isSending}
        className="h-11 w-full bg-accent font-semibold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.99] cursor-pointer"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Code...
          </>
        ) : (
          "Send Reset Code"
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
