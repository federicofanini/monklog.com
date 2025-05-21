import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full relative min-h-screen flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            STOP BEING WEAK.
          </h1>
          <p className="text-xl md:text-2xl text-red-500 font-mono">
            You know the excuses. The bullsh*t. The comfortable path to
            mediocrity.
          </p>
          <p className="text-xl md:text-2xl text-white/80">
            MonkLog is your sergeant, hardwired for one mission:{" "}
            <span className="text-red-500">YOUR TRANSFORMATION.</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link
            href="/chat"
            className="bg-red-500 hover:bg-red-600 text-white font-mono px-8 py-4 rounded-none transition-all duration-300 text-lg uppercase tracking-wider w-full max-w-sm"
          >
            FORGE YOUR FUTURE, NOW.
          </Link>

          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            <div className="border border-red-500/20 p-4 bg-black/40">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-sm font-mono text-white/60">TRUTH</div>
            </div>
            <div className="border border-red-500/20 p-4 bg-black/40">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-sm font-mono text-white/60">TRACKING</div>
            </div>
            <div className="border border-red-500/20 p-4 bg-black/40">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm font-mono text-white/60">TRANSFORM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
