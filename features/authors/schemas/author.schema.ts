// Zod validation schema for author creation matching backend rules
import { z } from "zod";

export const createAuthorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Author name must be at least 2 characters")
      .max(150, "Author name must not exceed 150 characters"),

    nameBn: z
      .string()
      .trim()
      .max(150, "Bengali name must not exceed 150 characters")
      .optional()
      .or(z.literal("")),

    bio: z
      .string()
      .trim()
      .max(5000, "Bio must not exceed 5000 characters")
      .optional()
      .or(z.literal("")),

    photo: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    birthDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const now = new Date();
          return !isNaN(date.getTime()) && date <= now;
        },
        {
          message: "Birth date cannot be in the future",
        },
      ),

    deathDate: z
      .string()
      .optional()
      .or(z.literal("")),

    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (!data.birthDate || !data.deathDate) {
        return true;
      }
      const birth = new Date(data.birthDate);
      const death = new Date(data.deathDate);
      if (isNaN(birth.getTime()) || isNaN(death.getTime())) {
        return true;
      }
      return birth <= death;
    },
    {
      message: "Death date cannot be earlier than birth date",
      path: ["deathDate"],
    },
  );

export type CreateAuthorFormValues = z.infer<typeof createAuthorSchema>;

// Zod validation schema for author updates matching backend PATCH rules
export const updateAuthorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Author name must be at least 2 characters")
      .max(150, "Author name must not exceed 150 characters")
      .optional(),

    nameBn: z
      .string()
      .trim()
      .max(150, "Bengali name must not exceed 150 characters")
      .optional()
      .or(z.literal("")),

    bio: z
      .string()
      .trim()
      .max(5000, "Bio must not exceed 5000 characters")
      .optional()
      .or(z.literal("")),

    photo: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),

    birthDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const now = new Date();
          return !isNaN(date.getTime()) && date <= now;
        },
        {
          message: "Birth date cannot be in the future",
        },
      ),

    deathDate: z
      .string()
      .optional()
      .or(z.literal("")),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.birthDate || !data.deathDate) {
        return true;
      }
      const birth = new Date(data.birthDate);
      const death = new Date(data.deathDate);
      if (isNaN(birth.getTime()) || isNaN(death.getTime())) {
        return true;
      }
      return birth <= death;
    },
    {
      message: "Death date cannot be earlier than birth date",
      path: ["deathDate"],
    },
  );

export type UpdateAuthorFormValues = z.infer<typeof updateAuthorSchema>;
