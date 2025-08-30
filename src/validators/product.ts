import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  price: z.coerce.number().positive().multipleOf(0.01)
});

export const updateProductSchema = z.object({
  sku: z.string().min(1).max(64).optional(),
  name: z.string().min(1).max(200).optional(),
  price: z.coerce.number().positive().multipleOf(0.01).optional()
});
