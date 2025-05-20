import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const STRIPE_PLANS = {
  MONTHLY: {
    name: "Monthly",
    price: 5,
    priceId: process.env.STRIPE_PRICE_MONTHLY_ID,
    interval: "month",
  },
  YEARLY: {
    name: "Yearly",
    price: 50,
    priceId: process.env.STRIPE_PRICE_YEARLY_ID,
    interval: "year",
  },
  LIFETIME: {
    name: "Lifetime",
    price: 85,
    priceId: process.env.STRIPE_PRICE_LIFETIME_ID,
    interval: "one-time",
  },
} as const;
