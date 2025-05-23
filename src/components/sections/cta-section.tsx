import { PricingSection } from "./pricing-section";

export function CTASection() {
  return (
    <section
      id="pricing"
      className="w-full bg-black py-24 border-t border-red-500/20"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white font-mono">
            THE WAR AGAINST WEAKNESS STARTS NOW.
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg text-white/80 font-mono">
              What is your current weakness costing you? Lost time? Broken
              promises? Unrealized potential?
            </p>
            <p className="text-lg text-red-500 font-mono">
              That cost is far greater than this.
            </p>
          </div>
        </div>

        <div className="grid gap-8 max-w-5xl mx-auto">
          <PricingSection />
        </div>

        <p className="text-sm text-white/40 font-mono max-w-lg mx-auto">
          No refunds if you can&apos;t handle the truth. This is a commitment,
          not a casual date. Stop delaying your ascent.
        </p>
      </div>
    </section>
  );
}
