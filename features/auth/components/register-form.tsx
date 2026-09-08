"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import { useRegisterMutation } from "../hooks/use-register";
import { isApiClientError } from "@/lib/api";

type RegisterFormProps = {
  onSuccessRedirect?: () => void;
  onSwitchToLogin: () => void;
};

export function RegisterForm({
  onSuccessRedirect,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "BUYER",
    },
  });

  const selectedRole = watch("role");
  const registerMutation = useRegisterMutation();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const rawMobile = values.mobileNumber.trim();
      const fullMobileNumber = rawMobile.startsWith("+")
        ? rawMobile
        : `+91${rawMobile.replace(/^0+/, "")}`;

      await registerMutation.mutateAsync({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        mobileNumber: fullMobileNumber,
        role: values.role,
      });

      toast.success("Account created successfully! Please sign in.");

      if (onSuccessRedirect) {
        onSuccessRedirect();
      } else {
        onSwitchToLogin();
      }
    } catch (err) {
      if (isApiClientError(err)) {
        if (err.fieldErrors) {
          for (const [field, messages] of Object.entries(err.fieldErrors)) {
            if (field === "name" || field === "email" || field === "password" || field === "mobileNumber") {
              setError(field, { message: messages[0] });
            }
          }
        }
        toast.error(err.message || "Failed to register. Please try again.");
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-name">Full Name</Label>
        <div className="group relative">
          <User
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="reg-name"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            {...register("name")}
            className={`h-11 pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" : ""}`}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Mobile No */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-mobile">Mobile No</Label>
        <div className="group relative">
          <Phone
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="reg-mobile"
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

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">Email</Label>
        <div className="group relative">
          <Mail
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="reg-email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email")}
            className={`h-11 pl-10 ${errors.email ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" : ""}`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-password">New Password</Label>
        <div className="group relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            autoComplete="new-password"
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
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-confirm-password">Confirm Password</Label>
        <div className="group relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
          <Input
            id="reg-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={`h-11 pr-11 pl-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute top-1/2 right-1 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Role Selection (Buyer / Seller) */}
      <div className="pt-2">
        <RadioGroup
          value={selectedRole}
          onValueChange={(val) => setValue("role", val as "BUYER" | "SELLER")}
          className="flex items-center space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BUYER" id="role-buyer" />
            <Label htmlFor="role-buyer" className="cursor-pointer font-medium">
              Buyer
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SELLER" id="role-seller" />
            <Label htmlFor="role-seller" className="cursor-pointer font-medium">
              Seller
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sign Up Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Already Have an Account ?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="h-auto p-0 font-semibold text-accent hover:text-accent-hover hover:underline"
          >
            Sign In
          </Button>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full sm:w-auto min-w-[120px] h-11 bg-accent font-semibold text-white hover:bg-accent-hover shadow-sm"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </div>
    </form>
  );
}
