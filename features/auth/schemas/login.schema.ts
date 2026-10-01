// login form validation schema
import { z } from "zod";
import { AUTH_MODE } from "../constants/auth.constants";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(
      1,
      AUTH_MODE === "email"
        ? "Email is required"
        : "Email or Mobile Number is required",
    )
    .refine(
      (val) => {
        if (!val) return true;
        if (AUTH_MODE === "email") {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const cleanPhone = val.replace(/\s+/g, "").replace(/^\+91/, "");
        const isPhone = /^[6-9]\d{9}$/.test(cleanPhone);
        return isEmail || isPhone;
      },
      {
        message:
          AUTH_MODE === "email"
            ? "Please enter a valid email address"
            : "Please enter a valid email address or 10-digit mobile number",
      },
    ),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

