"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const features = [
  "Unlimited daily messages",
  "Access to all mentor personas",
  "Priority response time",
  "Advanced habit tracking",
  "Custom challenges",
  "Progress analytics",
];

const plans = [
  {
    name: "Monthly",
    price: 5,
    interval: "month",
    description: "Perfect for trying out MonkLog",
    features: features,
  },
  {
    name: "Yearly",
    price: 50,
    interval: "year",
    description: "Our most popular plan",
    features: features,
    popular: true,
  },
  {
    name: "Lifetime",
    price: 85,
    interval: "one-time",
    description: "Best value for long-term growth",
    features: features,
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Yearly");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black to-neutral-950">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Invest in Your Growth
            </h1>
            <p className="mt-4 text-base text-white/70">
              Choose the plan that best fits your journey. All plans include
              full access to features.
              <br />
              Prices exclude VAT.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={cn(
                  "relative cursor-pointer rounded-2xl border p-8 transition-all duration-200",
                  plan.name === selectedPlan
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-white/10 bg-black/40 hover:border-white/20"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-red-500 px-3 py-1">
                    <p className="text-xs font-medium">MOST POPULAR</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <Zap
                    className={cn(
                      "h-5 w-5",
                      plan.name === selectedPlan
                        ? "text-red-500"
                        : "text-white/30"
                    )}
                  />
                </div>

                <p className="mt-2 text-sm text-white/70">{plan.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="ml-2 text-sm text-white/70">
                    /{plan.interval}
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full",
                          plan.name === selectedPlan
                            ? "bg-red-500/20"
                            : "bg-white/10"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-3 w-3",
                            plan.name === selectedPlan
                              ? "text-red-500"
                              : "text-white/50"
                          )}
                        />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "mt-8 w-full font-mono",
                    plan.name === selectedPlan
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Will integrate Stripe here later
                    console.log(`Selected plan: ${plan.name}`);
                  }}
                >
                  {plan.name === selectedPlan ? (
                    "GET STARTED"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      SELECT PLAN
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-sm text-white/50">
              Questions? Contact us at{" "}
              <a
                href="mailto:support@monklog.com"
                className="text-red-500 hover:text-red-400"
              >
                support@monklog.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
