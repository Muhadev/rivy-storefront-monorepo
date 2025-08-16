import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.number().int().optional(),
  imageUrl: z.string().url().optional()
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuery = z.object({
  q: z.string().optional(), // Search query
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.coerce.number().int().optional(), // categoryId
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional()
});

export const addCartItemBody = z.object({
  productId: z.number(),
  quantity: z.number().int().positive()
});
