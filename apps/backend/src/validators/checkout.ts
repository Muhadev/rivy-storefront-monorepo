import { z } from 'zod';

export const checkoutSchema = z.object({
  address: z.string().min(1)
});
