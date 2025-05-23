import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe, STRIPE_PLANS } from "@/packages/stripe/config";
import { prisma } from "@/packages/database/prisma";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get plan from request
    const { planId } = await req.json();
    const plan = Object.values(STRIPE_PLANS).find((p) => p.priceId === planId);

    if (!plan?.priceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const existingCustomer = await prisma.plan.findFirst({
      where: { userId: user.id },
      select: { stripe_customer_id: true },
    });

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not set");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: plan.interval === "lifetime" ? "payment" : "subscription",
      success_url: `${appUrl}/profile?success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planName: plan.name,
      },
    });

    if (!session.url) {
      throw new Error("No checkout URL received from Stripe");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
        details: error instanceof Error ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
