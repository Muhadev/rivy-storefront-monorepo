import { z } from 'zod';

// Validator for creating a new discount (requires code)
export const createDiscountValidator = z.object({
  code: z.string().min(1),
  percentage: z.number().min(0).max(100),
  active: z.boolean().optional(),
});

// Validator for updating an existing discount (code not changeable)
export const updateDiscountValidator = z.object({
  percentage: z.number().min(0).max(100).optional(),
  active: z.boolean().optional(),
});
