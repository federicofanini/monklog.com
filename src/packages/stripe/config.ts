import Stripe from "stripe";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Only throw the error on the server side
if (!isClient && !process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set. Please add it to your .env file. You can find your secret key in the Stripe Dashboard: https://dashboard.stripe.com/apikeys"
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
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
    price: 19,
    priceId: process.env.STRIPE_PRICE_LIFETIME_ID,
    interval: "lifetime",
  },
} as const;
