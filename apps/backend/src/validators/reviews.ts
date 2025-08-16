import { z } from 'zod';

// Validator for creating a new review (requires productId)
export const createReviewValidator = z.object({
  productId: z.union([z.string(), z.number()]).transform(val => Number(val)),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1), // Required for creating reviews
});

// Validator for updating an existing review (productId not changeable)
export const updateReviewValidator = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});
