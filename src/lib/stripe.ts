import Stripe from 'stripe';

// No inicializamos Stripe si no hay API KEY durante el build para evitar errores
const apiKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(apiKey, {
  apiVersion: '2025-01-27' as any,
  appInfo: {
    name: 'HAWKIN',
    version: '0.1.0',
  },
});
