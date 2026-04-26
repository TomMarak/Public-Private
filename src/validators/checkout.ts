import { z } from 'zod';

export const checkoutSchema = z.object({
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
  }),
  address: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  shipping: z.enum(['zasilkovna', 'ppl', 'pickup']),
  payment: z.enum(['card', 'transfer', 'cash_on_delivery']),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
