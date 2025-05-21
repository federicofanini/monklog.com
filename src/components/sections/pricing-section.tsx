"use client";

import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

interface TabsProps {
  activeTab: "yearly" | "monthly";
  setActiveTab: (tab: "yearly" | "monthly") => void;
  className?: string;
}

function PricingTabs({ activeTab, setActiveTab, className }: TabsProps) {
  return (
    <div
      className={cn(
        "relative flex w-fit items-center border border-red-500/20 p-0.5 h-10 bg-black",
        className
      )}
    >
      {["monthly", "yearly"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "yearly" | "monthly")}
          className={cn(
            "relative z-[1] px-6 h-9 flex items-center justify-center cursor-pointer font-mono uppercase tracking-wider",
            {
              "z-0": activeTab === tab,
            }
          )}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-red-500"
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            />
          )}
          <span
            className={cn(
              "relative block text-sm duration-200 shrink-0",
              activeTab === tab ? "text-white" : "text-white/60"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "yearly" && (
              <span className="ml-2 text-xs font-bold bg-red-500/20 py-0.5 px-2">
                SAVE 17%
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const PriceDisplay = ({
    tier,
  }: {
    tier: (typeof siteConfig.pricing.pricingItems)[0];
  }) => {
    const price = billingCycle === "yearly" ? tier.yearlyPrice : tier.price;

    return (
      <motion.span
        key={price}
        className="text-4xl font-bold font-mono text-red-500"
        initial={{ opacity: 0, x: billingCycle === "yearly" ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        ${price}
      </motion.span>
    );
  };

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center gap-10 py-24 w-full relative bg-black"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
          THE PRICE OF POWER
        </h2>
        <p className="text-red-500 font-mono">
          Your transformation has a cost. Choose your level of commitment.
        </p>
      </div>

      <div className="relative w-full h-full pt-16">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <PricingTabs
            activeTab={billingCycle}
            setActiveTab={setBillingCycle}
            className="mx-auto"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto px-6">
          {siteConfig.pricing.pricingItems.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "border transition-all",
                tier.isPopular
                  ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-black"
                  : "border-red-500/20 bg-black hover:border-red-500/50"
              )}
            >
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-mono text-white">
                    {tier.name}
                  </h3>
                  {tier.isPopular && (
                    <span className="bg-red-500 text-white text-xs font-mono px-2 py-1">
                      ELITE
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <PriceDisplay tier={tier} />
                  <span className="text-white/60 font-mono">
                    /{billingCycle === "yearly" ? "year" : "month"}
                  </span>
                </div>

                <p className="text-sm font-mono text-white/60">
                  {tier.description}
                </p>

                <button
                  className={cn(
                    "w-full h-12 font-mono uppercase tracking-wider transition-all",
                    tier.isPopular
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "border border-red-500/20 hover:bg-red-500/10 text-white"
                  )}
                >
                  {tier.buttonText}
                </button>
              </div>

              <div className="border-t border-red-500/20 p-8">
                <div className="space-y-4">
                  {tier.name !== "Basic" && (
                    <p className="text-sm font-mono text-white/60">
                      Everything in {tier.name === "Pro" ? "Basic" : "Pro"}{" "}
                      plus:
                    </p>
                  )}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="size-5 border border-red-500/20 flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-500"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-mono text-white/60">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-white/40 font-mono text-sm max-w-lg mx-auto px-6">
        No refunds. No excuses. This is a commitment to your transformation.
        <br />
        The weak will hesitate. The strong will act.
      </p>
    </section>
  );
}
