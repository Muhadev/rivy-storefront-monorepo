import { z } from 'zod';

export const createOrderSchema = z.object({
  address: z.string().min(1),
  items: z.array(z.object({
    productId: z.number().int(),
    quantity: z.number().int().positive()
  })).min(1) // Require at least one item
});

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  address: z.string().min(1).optional()
});
