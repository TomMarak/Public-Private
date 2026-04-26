import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripeClient = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-04-10',
    });
  }
  return stripe;
};

export const verifyStripeSignature = (body: string, signature: string) => {
  const client = getStripeClient();
  return client.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
};
