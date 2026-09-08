// login form validation schema
import { z } from "zod";

export const loginSchema = z.object({
  mobileNumber: z
    .string()
    .trim()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^\+?[0-9]{10,13}$/, "Please enter a valid mobile number"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
