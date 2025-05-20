import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/packages/stripe/config";
import { prisma } from "@/packages/database/prisma";
import type Stripe from "stripe";

async function handleSubscriptionChange(
  subscriptionId: string,
  customerId: string,
  status: boolean
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customer = await stripe.customers.retrieve(customerId);
    const userId = (customer as Stripe.Customer).metadata.userId;

    if (!userId) {
      throw new Error("No userId found in customer metadata");
    }

    // Update or create plan record
    await prisma.plan.upsert({
      where: {
        stripe_subscription_id: subscriptionId,
      },
      create: {
        userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: subscription.items.data[0].price.id,
        plan_name: "PRO",
        subscription_status: status,
      },
      update: {
        subscription_status: status,
      },
    });

    // Update user's paid status
    await prisma.user.update({
      where: { id: userId },
      data: { paid: status },
    });
  } catch (error) {
    console.error("Error handling subscription change:", error);
    throw error;
  }
}

async function handleOneTimePayment(session: Stripe.Checkout.Session) {
  try {
    const { userId } = session.metadata || {};

    if (!userId) {
      throw new Error("No userId found in session metadata");
    }

    // Create lifetime plan record
    await prisma.plan.create({
      data: {
        userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.payment_intent as string, // Use payment_intent as a unique identifier
        stripe_price_id: session.line_items?.data[0]?.price?.id || "",
        plan_name: "PRO",
        subscription_status: true,
      },
    });

    // Update user's paid status
    await prisma.user.update({
      where: { id: userId },
      data: { paid: true },
    });
  } catch (error) {
    console.error("Error handling one-time payment:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle one-time payment
        if (session.mode === "payment") {
          await handleOneTimePayment(session);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(
          subscription.id,
          subscription.customer as string,
          true
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(
          subscription.id,
          subscription.customer as string,
          false
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
