import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StreakCounter } from "@/components/ui/streak-counter";

export default function LogPage() {
  return (
    <div className="container max-w-2xl py-8 space-y-8 mx-auto">
      <div className="flex justify-between items-center">
        <StreakCounter count={13} />
        <span className="text-muted-foreground">21:45 PM</span>
      </div>

      <Card className="p-6 space-y-6 bg-black/40">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">How did you show up today?</h2>
          <Textarea
            placeholder="Be honest with yourself. What did you accomplish? Where did you fall short?"
            className="min-h-[120px] bg-black/60"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Did you relapse on any habits?</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Smoke", "Social Media", "Mission", "Training"].map((habit) => (
              <Button
                key={habit}
                variant="outline"
                className="justify-start hover:bg-red-500/20 hover:text-red-500"
              >
                {habit}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full bg-red-500 hover:bg-red-600">
            Submit Daily Log
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-black/40">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-red-500">MENTOR RESPONSE</span>
            <div className="flex-1 h-px bg-red-500/20" />
          </div>

          <blockquote className="font-mono text-lg border-l-2 border-red-500 pl-4">
            &quot;You skipped your workout. You know why. Don&apos;t lie to
            yourself. Tomorrow, double the work. Stay sharp.&quot;
          </blockquote>

          <div className="space-y-2 text-muted-foreground">
            <p>
              💭 Reflection: Your patterns show weakness in the morning hours.
            </p>
            <p>
              ⚔️ Tomorrow&apos;s Challenge: Wake up at 0500. Cold shower. 100
              pushups before breakfast.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
