"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLoginMutation } from "../hooks/use-login";
import { getSafePostLoginRedirect } from "../utils/auth-redirect";
import { isApiClientError } from "@/lib/api";

type LoginFormProps = {
  onSwitchToRegister: () => void;
};

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const rawMobile = values.mobileNumber.trim();
      const fullMobileNumber = rawMobile.startsWith("+")
        ? rawMobile
        : `+91${rawMobile.replace(/^0+/, "")}`;

      const res = await loginMutation.mutateAsync({
        mobileNumber: fullMobileNumber,
        password: values.password,
      });

      toast.success(res.message || "Login successful!");

      // Role-validated safe post-login destination
      const targetUrl = getSafePostLoginRedirect({
        redirect: searchParams.get("redirect"),
        role: res.data.user.role,
      });

      router.push(targetUrl);
    } catch (err) {
      if (isApiClientError(err)) {
        if (err.fieldErrors) {
          for (const [field, messages] of Object.entries(err.fieldErrors)) {
            if (field === "mobileNumber" || field === "password") {
              setError(field, { message: messages[0] });
            }
          }
        }
        toast.error(err.message || "Invalid credentials. Please try again.");
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="login-mobile">Mobile Number</Label>
        <div className="group relative">
          <Phone
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="login-mobile"
            type="tel"
            placeholder="e.g. 9876543210"
            autoComplete="tel"
            {...register("mobileNumber")}
            className={`h-11 pl-10 ${errors.mobileNumber ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" : ""}`}
          />
        </div>
        {errors.mobileNumber && (
          <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs font-medium text-accent hover:text-accent-hover hover:underline"
          >
            Forgot password?
          </Button>
        </div>

        <div className="group relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className={`h-11 pr-11 pl-10 ${errors.password ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-6 h-11 w-full text-sm font-semibold bg-accent text-white hover:bg-accent-hover shadow-sm"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-4">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="h-10 text-sm font-medium"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        {/* Facebook */}
        <Button
          type="button"
          variant="outline"
          className="h-10 text-sm font-medium"
        >
          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          Facebook
        </Button>
      </div>

      {/* Switch to Register */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToRegister}
          className="h-auto p-0 font-semibold text-accent hover:text-accent-hover hover:underline"
        >
          Register now
        </Button>
      </div>
    </form>
  );
}
