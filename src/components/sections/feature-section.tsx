import { cn } from "@/lib/utils";
import { Bot, Target, BarChart2, Skull } from "lucide-react";

export function FeatureSection() {
  return (
    <section id="features" className="w-full bg-black py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white font-mono mb-4">
            YOUR ARSENAL OF DISCIPLINE
          </h2>
          <p className="text-lg text-white/60 font-mono">
            Military-grade tools to forge your unbreakable self.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Monk Mentor */}
          <div
            className={cn(
              "border border-red-500/20 p-8",
              "bg-black/40 hover:bg-black/30",
              "transition-colors duration-300"
            )}
          >
            <div className="text-red-500/80 mb-4">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              AI MONK MENTOR
            </h3>
            <p className="text-white/60 font-mono text-sm mt-2">
              Choose your master. The ruthless &quot;Ghost&quot;? The strategic
              &quot;Warlord&quot;? Each AI persona is designed to chisel away
              your weaknesses.
            </p>
          </div>

          {/* Daily Missions */}
          <div
            className={cn(
              "border border-red-500/20 p-8",
              "bg-black/40 hover:bg-black/30",
              "transition-colors duration-300"
            )}
          >
            <div className="text-red-500/80 mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              DAILY MISSIONS
            </h3>
            <p className="text-white/60 font-mono text-sm mt-2">
              No more guessing. Your AI Mentor assigns precise objectives. Your
              job is to conquer them.
            </p>
          </div>

          {/* Habit Command Center */}
          <div
            className={cn(
              "border border-red-500/20 p-8",
              "bg-black/40 hover:bg-black/30",
              "transition-colors duration-300"
            )}
          >
            <div className="text-red-500/80 mb-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              HABIT COMMAND CENTER
            </h3>
            <p className="text-white/60 font-mono text-sm mt-2">
              Minimalist tracking of your core disciplines. Visual progress.
              Zero fluff.
            </p>
          </div>

          {/* Truth Log */}
          <div
            className={cn(
              "border border-red-500/20 p-8",
              "bg-black/40 hover:bg-black/30",
              "transition-colors duration-300"
            )}
          >
            <div className="text-red-500/80 mb-4">
              <Skull className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              TRUTH LOG & RELAPSE REPORT
            </h3>
            <p className="text-white/60 font-mono text-sm mt-2">
              Confess your shortcomings. Face them. Learn from them. Your mentor
              will ensure it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
