"use client";

import { cn } from "@/lib/utils";
import { plans } from "../private/pricing-component";
import { ArrowRight } from "lucide-react";
import { Check, Dot, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { paths } from "@/lib/path";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-10 py-8 w-full relative bg-black"
    >
      {/* Pricing Cards */}
      <div className="mt-16 grid grid-cols-1 gap-6 lg:gap-8 bg-black">
        {plans.map((plan) => (
          <div
            key={plan.name}
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
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <Zap className={cn("h-5 w-5 text-red-500")} />
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
                <li key={feature.text} className="flex items-center gap-2">
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
              asChild
            >
              <Link href={paths.api.login}>
                <span className="flex items-center justify-center gap-2">
                  GET STARTED
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
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
    </section>
  );
}
