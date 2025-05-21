import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/packages/stripe/config";
import { prisma } from "@/packages/database/prisma";
import type Stripe from "stripe";
import { PlanName } from "@prisma/client";

async function handleSubscriptionChange(
  subscriptionId: string,
  customerId: string,
  status: boolean
) {
  try {
    console.log(
      `[Subscription ${
        status ? "Update" : "Cancel"
      }] Processing subscription ${subscriptionId} for customer ${customerId}`
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log("[Subscription] Retrieved subscription details:", {
      id: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
    });

    const customer = await stripe.customers.retrieve(customerId);
    const userId = (customer as Stripe.Customer).metadata.userId;
    console.log("[Subscription] Retrieved customer details:", {
      customerId,
      userId,
      email: (customer as Stripe.Customer).email,
    });

    if (!userId) {
      throw new Error("No userId found in customer metadata");
    }

    // Update or create plan record
    const plan = await prisma.plan.upsert({
      where: {
        stripe_subscription_id: subscriptionId,
      },
      create: {
        userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: subscription.items.data[0].price.id,
        plan_name: PlanName.PRO,
        subscription_status: status,
      },
      update: {
        subscription_status: status,
        stripe_price_id: subscription.items.data[0].price.id,
      },
    });
    console.log("[Subscription] Updated plan record:", {
      planId: plan.id,
      userId: plan.userId,
      status: plan.subscription_status,
    });

    // Update user's paid status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { paid: status },
    });
    console.log("[Subscription] Updated user paid status:", {
      userId: user.id,
      paid: user.paid,
      email: user.email,
    });
  } catch (error) {
    console.error(
      "[Subscription Error] Failed to handle subscription change:",
      {
        error,
        subscriptionId,
        customerId,
        status,
      }
    );
    throw error;
  }
}

async function handleOneTimePayment(session: Stripe.Checkout.Session) {
  try {
    console.log("[One-Time Payment] Processing payment for session:", {
      sessionId: session.id,
      mode: session.mode,
      customerId: session.customer,
    });

    const { userId } = session.metadata || {};
    const customerId = session.customer as string;

    if (!userId || !customerId) {
      throw new Error("Missing userId or customerId in session metadata");
    }

    console.log("[One-Time Payment] Session metadata:", {
      userId,
      customerId,
      priceId: session.line_items?.data[0]?.price?.id,
    });

    // Create lifetime plan record
    const plan = await prisma.plan.upsert({
      where: {
        stripe_customer_id: customerId,
      },
      create: {
        userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: session.id,
        stripe_price_id: session.line_items?.data[0]?.price?.id || "",
        plan_name: PlanName.PRO,
        subscription_status: true,
      },
      update: {
        subscription_status: true,
        stripe_price_id: session.line_items?.data[0]?.price?.id || "",
      },
    });
    console.log("[One-Time Payment] Created/Updated plan record:", {
      planId: plan.id,
      userId: plan.userId,
      customerId: plan.stripe_customer_id,
    });

    // Update user's paid status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { paid: true },
    });
    console.log("[One-Time Payment] Updated user paid status:", {
      userId: user.id,
      paid: user.paid,
      email: user.email,
    });
  } catch (error) {
    console.error("[One-Time Payment Error] Failed to handle payment:", {
      error,
      sessionId: session.id,
      customerId: session.customer,
    });
    throw error;
  }
}

export async function POST(req: Request) {
  console.log("[Webhook] Received Stripe webhook event");

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) {
    console.error("[Webhook Error] No Stripe signature found in request");
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("[Webhook] Verified Stripe signature, processing event:", {
      type: event.type,
      id: event.id,
    });
  } catch (error) {
    console.error("[Webhook Error] Signature verification failed:", {
      error,
      signature: signature.substring(0, 20) + "...",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("[Webhook] Processing checkout.session.completed");
        const session = event.data.object as Stripe.Checkout.Session;

        // Expand the session to get line items
        const expandedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items"],
          }
        );
        console.log("[Webhook] Retrieved expanded session:", {
          sessionId: expandedSession.id,
          customerId: expandedSession.customer,
          amount: expandedSession.amount_total,
          mode: expandedSession.mode,
        });

        // Handle one-time payment
        if (session.mode === "payment") {
          await handleOneTimePayment(expandedSession);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        console.log(`[Webhook] Processing ${event.type}`);
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(
          subscription.id,
          subscription.customer as string,
          true
        );
        break;
      }

      case "customer.subscription.deleted": {
        console.log("[Webhook] Processing subscription deletion");
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(
          subscription.id,
          subscription.customer as string,
          false
        );
        break;
      }

      default: {
        console.log("[Webhook] Ignoring unhandled event type:", event.type);
      }
    }

    console.log("[Webhook] Successfully processed event:", event.type);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook Error] Failed to handle webhook:", {
      error,
      eventType: event.type,
      eventId: event.id,
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook handler failed",
        details: error instanceof Error ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
