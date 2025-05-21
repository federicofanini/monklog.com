import Link from "next/link";

export function CTASection() {
  return (
    <section
      id="pricing"
      className="w-full bg-black py-24 border-t border-red-500/20"
    >
      <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="border border-white/10 p-8 bg-black/40 space-y-4 hover:border-white/20 transition-all duration-300">
            <h3 className="text-xl font-bold text-white">RECRUIT</h3>
            <div className="text-3xl font-bold text-white/80">FREE</div>
            <p className="text-sm text-white/60 font-mono">Limited Access</p>
            <ul className="space-y-3 text-left mt-6">
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>3 messages per day
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Basic habit tracking
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Standard response time
              </li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full bg-white/10 hover:bg-white/20 text-white font-mono px-6 py-3 mt-6 transition-all duration-300"
            >
              START FREE
            </Link>
          </div>

          {/* Monthly Plan */}
          <div className="border border-red-500/20 p-8 bg-black/40 space-y-4">
            <h3 className="text-xl font-bold text-white">WARRIOR</h3>
            <div className="text-3xl font-bold text-red-500">
              $5<p className="text-xs text-white/60 font-mono">excl. vat</p>
            </div>
            <p className="text-sm text-white/60 font-mono">Monthly</p>
            <ul className="space-y-3 text-left mt-6">
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Unlimited messages
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Advanced tracking
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Priority response
              </li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-mono px-6 py-3 mt-6 transition-all duration-300"
            >
              ENLIST NOW
            </Link>
          </div>

          {/* Annual Plan */}
          <div className="relative border border-red-500/20 p-8 bg-black/40 space-y-4">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-red-500 px-3 py-1">
              <p className="text-xs font-medium">MOST POPULAR</p>
            </div>
            <h3 className="text-xl font-bold text-white">WARLORD</h3>
            <div className="text-3xl font-bold text-red-500">
              $50 <p className="text-xs text-white/60 font-mono">excl. vat</p>
            </div>
            <p className="text-sm text-white/60 font-mono">Annual (Save 20%)</p>
            <ul className="space-y-3 text-left mt-6">
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Everything in Warrior
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Custom challenges
              </li>
              <li className="flex items-center gap-2 text-white/60 font-mono text-sm">
                <span className="text-red-500">→</span>
                Progress analytics
              </li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-mono px-6 py-3 mt-6 transition-all duration-300"
            >
              COMMIT FULLY
            </Link>
          </div>
        </div>

        <p className="text-sm text-white/40 font-mono max-w-lg mx-auto">
          No refunds if you can&apos;t handle the truth. This is a commitment,
          not a casual date. Stop delaying your ascent.
        </p>
      </div>
    </section>
  );
}
