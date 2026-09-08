// registration form validation schema
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),
    mobileNumber: z
      .string()
      .trim()
      .min(10, "Mobile number must be at least 10 digits")
      .regex(/^\+?[0-9]{10,13}$/, "Please enter a valid mobile number"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),
    role: z.enum(["BUYER", "SELLER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
