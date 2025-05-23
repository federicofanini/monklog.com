"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Dot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { STRIPE_PLANS } from "@/packages/stripe/config";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const features = [
  { text: "Track your progress", soon: false },
  { text: "Share your public profile", soon: false },
  { text: "Access to the Whatsapp Community", soon: false },
  {
    text: "Stay motivated and share your work with the community",
    soon: false,
  },
  { text: "Lifetime access", soon: false },
  { text: "Advanced habit tracking", soon: true },
  { text: "Monk Mentor AI chat", soon: true },
  { text: "Custom challenges", soon: true },
  { text: "Access to all mentor personas", soon: true },
] as const;

interface PricingPlan {
  name: string;
  price: number;
  interval: string;
  priceId?: string;
  description: string;
  features: typeof features;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    ...STRIPE_PLANS.LIFETIME,
    description: "Best value for long-term growth",
    features: features,
    popular: true,
  },
];

export function PricingOverlay() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Lifetime");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle success/cancel messages from Stripe redirect
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast.success("Payment successful! Welcome to MonkLog Pro!");
      router.replace("/profile"); // Remove query params and redirect
    }

    if (canceled) {
      toast.error(
        "Payment canceled. Please try again or contact support if you need help."
      );
      router.replace("/pricing"); // Remove query params
    }
  }, [searchParams, router]);

  const handlePurchase = async (plan: (typeof plans)[0]) => {
    if (!plan.priceId) {
      toast.error("Invalid plan selected. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.priceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start checkout process");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start checkout process"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Unlock Full Access
              </h1>
              <p className="mt-4 text-base text-white/70">
                Choose your plan to access all features and start your journey
                to better habits.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid grid-cols-1 gap-6 lg:gap-8 bg-black">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={cn(
                    "relative cursor-pointer rounded-2xl border p-8 transition-all duration-200 border-red-500/50 bg-red-500/5 hover:border-red-500"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-red-500 px-3 py-1">
                      <p className="text-xs font-medium">FORGE YOUR FUTURE</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {plan.name}
                    </h3>
                    <Zap className={cn("h-5 w-5 text-red-500")} />
                  </div>

                  <p className="mt-2 text-sm text-white/70">
                    {plan.description}
                  </p>

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
                      <li
                        key={feature.text}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20"
                          )}
                        >
                          <Check className={cn("h-3 w-3 text-red-500")} />
                        </div>
                        <span className="text-sm text-white/70 flex items-center gap-2">
                          {feature.text}
                          {feature.soon ? (
                            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-full">
                              soon
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">
                              <Dot className="size-4 animate-pulse" />
                              live
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "mt-8 w-full font-mono",
                      "bg-red-500 hover:bg-red-600"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(plan);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : plan.name === selectedPlan ? (
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

            {/* Contact Info */}
            <div className="mt-16 text-center">
              <p className="text-sm text-white/50">
                Questions? Contact us at{" "}
                <a
                  href="mailto:fedef@gymbrah.com"
                  className="text-red-500 hover:text-red-400"
                >
                  fedef@gymbrah.com
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
