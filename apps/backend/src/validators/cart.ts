import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int().positive()
});

export const updateItemSchema = z.object({
  quantity: z.number().int().nonnegative() // Only quantity in body
});

export const removeItemSchema = z.object({
  productId: z.number().int()
});
