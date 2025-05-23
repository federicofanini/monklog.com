import { cn } from "@/lib/utils";
import { Sword, Target, Brain } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="w-full relative py-24 bg-black" id="problem">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-16">
        {/* The Uncomfortable Truth */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-mono">
            The Uncomfortable Truth
          </h2>

          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-red-500 font-mono">
              Let&apos;s be honest.
            </p>

            <div className="space-y-4 text-lg md:text-xl text-white/80 font-mono">
              <p>
                Another day slips by. That fire in your gut?{" "}
                <span className="text-red-500">Dwindling</span>.
              </p>
              <p>
                You <span className="text-red-500">know</span> what you need to
                do. But you don&apos;t.
              </p>
              <p>
                You choose comfort. You choose distraction. You choose the path
                of least resistance.
              </p>
            </div>

            <p className="text-2xl md:text-3xl font-bold text-red-500 font-mono">
              AND IT&apos;S EATING YOU ALIVE.
            </p>

            <div className="space-y-4 text-lg md:text-xl text-white/80 font-mono">
              <p>
                That voice whispering &ldquo;tomorrow&rdquo;?{" "}
                <span className="text-red-500">It&apos;s a liar</span>.
              </p>
              <p>
                That feeling of being stuck? It&apos;s the chain you forged
                yourself.
              </p>
            </div>

            <p className="text-3xl md:text-4xl font-bold text-red-500 font-mono">
              ENOUGH.
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-mono">
            Your Weapon
          </h2>

          <div className="space-y-6">
            <div className="space-y-4 text-lg md:text-xl text-white/80 font-mono">
              <p>
                MonkLog isn&apos;t here to coddle you. It&apos;s here to{" "}
                <span className="text-red-500 font-mono">
                  break you and rebuild you
                </span>
                .
              </p>
              <p>This is your pocket dojo. Your personal crucible.</p>
              <p>
                We stripped away the noise, the notifications, the infinite
                scroll that drains your soul.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-mono">
                WHAT&apos;S LEFT?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={cn(
                    "border border-red-500/20 p-6",
                    "bg-black/40 hover:bg-black/30",
                    "transition-colors duration-300"
                  )}
                >
                  <div className="text-red-500/80 mb-4">
                    <Sword className="h-6 w-6" />
                  </div>
                  <div className="text-xl font-mono text-red-500 mb-2">
                    TRUTH
                  </div>
                  <p className="text-white/60 font-mono">
                    Raw, unfiltered, and often brutal.
                  </p>
                </div>

                <div
                  className={cn(
                    "border border-red-500/20 p-6",
                    "bg-black/40 hover:bg-black/30",
                    "transition-colors duration-300"
                  )}
                >
                  <div className="text-red-500/80 mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <div className="text-xl font-mono text-red-500 mb-2">
                    TRACKING
                  </div>
                  <p className="text-white/60 font-mono">
                    Every commitment, every failure, logged in stark reality.
                  </p>
                </div>

                <div
                  className={cn(
                    "border border-red-500/20 p-6",
                    "bg-black/40 hover:bg-black/30",
                    "transition-colors duration-300"
                  )}
                >
                  <div className="text-red-500/80 mb-4">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div className="text-xl font-mono text-red-500 mb-2">
                    TRANSFORMATION
                  </div>
                  <p className="text-white/60 font-mono">
                    The AI Monk Mode Mentor doesn&apos;t care about your
                    feelings. It cares about your discipline.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-y border-red-500/20 py-8 text-center">
              <p className="text-2xl md:text-3xl font-mono text-white/80">
                This is not a productivity app.
                <br />
                <span className="text-red-500">
                  This is a weapon against your lesser self.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
