import { z } from 'zod';

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  status: z.enum(['draft', 'published', 'sold_out']),
});

export type ProductData = z.infer<typeof productSchema>;
