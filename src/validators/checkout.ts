import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'Jméno je povinné'),
  lastName: z.string().min(1, 'Příjmení je povinné'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(1, 'Telefon je povinný'),
  street: z.string().min(1, 'Ulice je povinná'),
  city: z.string().min(1, 'Město je povinné'),
  postalCode: z.string().min(1, 'PSČ je povinné'),
  country: z.string().min(1, 'Země je povinná'),
  shippingMethod: z.enum(['zasilkovna', 'ppl', 'pickup'], {
    errorMap: () => ({ message: 'Neplatná doprava' })
  }),
  paymentMethod: z.enum(['card', 'transfer', 'cash_on_delivery'], {
    errorMap: () => ({ message: 'Neplatná platba' })
  }),
  items: z.array(z.object({
    productId: z.string(),
    variant: z.object({
      name: z.string(),
    }).optional(),
    quantity: z.number().min(1),
    priceAtAdd: z.number().min(0),
  })).min(1, 'Košík je prázdný'),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
