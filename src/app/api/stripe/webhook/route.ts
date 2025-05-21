import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/packages/stripe/config";
import { prisma } from "@/packages/database/prisma";
import type Stripe from "stripe";
import { PlanName } from "@prisma/client";

// Utility function to handle database updates
async function updateUserAndPlan(
  userId: string,
  customerId: string,
  priceId: string,
  subscriptionId: string | null,
  isPaid: boolean
) {
  console.log("[DB Update] Starting database update for user:", {
    userId,
    customerId,
    priceId,
    subscriptionId,
    isPaid,
  });

  try {
    // Use a transaction to ensure both updates succeed or fail together
    const [user, plan] = await prisma.$transaction([
      // Update user's paid status
      prisma.user.update({
        where: { id: userId },
        data: { paid: isPaid },
      }),
      // Upsert plan record
      prisma.plan.upsert({
        where: { stripe_customer_id: customerId },
        create: {
          userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId || "one-time",
          stripe_price_id: priceId,
          plan_name: PlanName.PRO,
          subscription_status: isPaid,
        },
        update: {
          stripe_subscription_id: subscriptionId || "one-time",
          stripe_price_id: priceId,
          subscription_status: isPaid,
        },
      }),
    ]);

    console.log("[DB Update] Successfully updated database:", {
      user: { id: user.id, paid: user.paid },
      plan: { id: plan.id, status: plan.subscription_status },
    });

    return { user, plan };
  } catch (error) {
    console.error("[DB Update] Failed to update database:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");

    if (!signature) {
      console.error("[Webhook] Missing Stripe signature");
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("[Webhook] Received verified event:", event.type);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Processing checkout.session.completed:", {
          sessionId: session.id,
          customerId: session.customer,
          mode: session.mode,
        });

        // Get the customer ID and metadata
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;

        if (!userId) {
          throw new Error("No userId found in session metadata");
        }

        // For subscriptions, wait for subscription events
        if (session.mode === "subscription") {
          console.log(
            "[Webhook] Subscription checkout completed, waiting for subscription events"
          );
          return NextResponse.json({ received: true });
        }

        // For one-time payments, process immediately
        if (session.mode === "payment") {
          // Retrieve the session with line items
          const expandedSession = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ["line_items"] }
          );

          const priceId = expandedSession.line_items?.data[0]?.price?.id;
          if (!priceId) {
            throw new Error("No price ID found in session");
          }

          await updateUserAndPlan(
            userId,
            customerId,
            priceId,
            null, // No subscription ID for one-time payments
            true
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Webhook] Processing ${event.type}:`, {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        });

        // Get customer to retrieve userId
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        const userId = (customer as Stripe.Customer).metadata.userId;

        if (!userId) {
          throw new Error("No userId found in customer metadata");
        }

        await updateUserAndPlan(
          userId,
          subscription.customer as string,
          subscription.items.data[0].price.id,
          subscription.id,
          subscription.status === "active"
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Webhook] Processing subscription deletion:", {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });

        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        const userId = (customer as Stripe.Customer).metadata.userId;

        if (!userId) {
          throw new Error("No userId found in customer metadata");
        }

        await updateUserAndPlan(
          userId,
          subscription.customer as string,
          subscription.items.data[0].price.id,
          subscription.id,
          false
        );
        break;
      }

      default: {
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
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
