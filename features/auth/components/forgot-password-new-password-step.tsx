"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isApiClientError } from "@/lib/api";
import { useResetPasswordMutation } from "../hooks/use-reset-password";
import {
  forgotPasswordResetSchema,
  type ForgotPasswordResetFormValues,
} from "../schemas/forgot-password.schema";

type ForgotPasswordNewPasswordStepProps = {
  resetToken: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
};

export function ForgotPasswordNewPasswordStep({
  resetToken,
  onSuccess,
  onBackToLogin,
}: ForgotPasswordNewPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordResetFormValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useResetPasswordMutation();
  const isSubmitting = resetPasswordMutation.isPending;

  const onSubmit = async (values: ForgotPasswordResetFormValues) => {
    try {
      const res = await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: values.newPassword,
      });

      toast.success(
        res.message || "Password updated successfully! Please log in.",
      );
      onSuccess();
    } catch (err: unknown) {
      if (isApiClientError(err)) {
        if (err.fieldErrors?.newPassword) {
          setError("newPassword", { message: err.fieldErrors.newPassword[0] });
        }
        if (err.fieldErrors?.confirmPassword) {
          setError("confirmPassword", {
            message: err.fieldErrors.confirmPassword[0],
          });
        }
        toast.error(
          err.message || "Failed to update password. Please request a new code.",
        );
      } else {
        toast.error("An unexpected error occurred while resetting your password.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Verification complete. Enter your new password below.</span>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="new-password">New Password</Label>
        <div className="group relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("newPassword")}
            className={`h-11 pr-11 pl-10 ${
              errors.newPassword
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
        <div className="group relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="confirm-new-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            {...register("confirmPassword")}
            className={`h-11 pr-11 pl-10 ${
              errors.confirmPassword
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-accent font-semibold text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.99] cursor-pointer mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Password...
          </>
        ) : (
          "Reset Password"
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
