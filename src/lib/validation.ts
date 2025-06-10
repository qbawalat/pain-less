import { z } from "zod";
import { ValidationError } from "./errors";

// Health Profile Schemas
export const healthProfileCreateSchema = z.object({
  birth_date: z.string().transform((str) => new Date(str)),
  height: z.number().positive(),
  weight: z.number().positive(),
  medical_conditions: z.array(z.string()).default([]),
  family_conditions: z.array(z.string()).default([]),
});

export const healthProfileUpdateSchema = z.object({
  birth_date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  medical_conditions: z.array(z.string()).optional(),
  family_conditions: z.array(z.string()).optional(),
});

// Supplement Schemas
export const supplementSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  interactions: z.array(z.string()).default([]),
});

// User Supplement Schemas
export const userSupplementSchema = z.object({
  supplement_id: z.string().uuid(),
  start_date: z.string().transform((str) => new Date(str)),
  end_date: z
    .string()
    .transform((str) => new Date(str))
    .nullable(),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
});

// Pagination Schema
export const paginationSchema = z
  .object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  })
  .transform((data) => ({
    page: data.page,
    limit: data.limit,
  }));

// Validation helper
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError("Validation failed", error.errors);
    }
    throw error;
  }
}
