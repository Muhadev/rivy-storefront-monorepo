import { z } from 'zod';

// Validator for creating a new discount
export const createDiscountValidator = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be 50 characters or less'),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed'], { 
    errorMap: () => ({ message: 'Type must be either "percentage" or "fixed"' }) 
  }),
  value: z.number().positive('Value must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount cannot be negative').optional(),
  maxUses: z.number().int().positive('Max uses must be a positive integer').optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  endDate: z.string().datetime().optional().or(z.date().optional()),
  isActive: z.boolean().optional().default(true)
});

// Validator for updating an existing discount
export const updateDiscountValidator = z.object({
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed']).optional(),
  value: z.number().positive('Value must be positive').optional(),
  minOrderAmount: z.number().min(0, 'Minimum order amount cannot be negative').optional(),
  maxUses: z.number().int().positive('Max uses must be a positive integer').optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  endDate: z.string().datetime().optional().or(z.date().optional()),
  isActive: z.boolean().optional()
});

// Query validator for listing discounts
export const listDiscountsQuery = z.object({
  type: z.enum(['percentage', 'fixed']).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
