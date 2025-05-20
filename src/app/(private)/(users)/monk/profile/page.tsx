import { Card } from "@/components/ui/card";
import { StreakCounter } from "@/components/ui/streak-counter";

export default function ProfilePage() {
  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <Card className="p-6 bg-black/40">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold">FM</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Fierce Monk</h1>
            <p className="text-muted-foreground">Joined March 2024</p>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-6 bg-black/40">
          <div className="space-y-2">
            <h2 className="font-mono text-red-500">CURRENT STREAK</h2>
            <StreakCounter count={13} className="text-2xl" />
          </div>
        </Card>

        <Card className="p-6 bg-black/40">
          <div className="space-y-2">
            <h2 className="font-mono text-red-500">MENTAL TOUGHNESS</h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-red-500 rounded-full" />
              </div>
              <span className="font-mono">75%</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-black/40 space-y-6">
        <h2 className="font-mono text-red-500">ACHIEVEMENTS</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            "7 Day Warrior",
            "Early Riser",
            "Deep Work Master",
            "Cold Shower King",
            "No Excuse November",
            "Digital Detox",
          ].map((achievement) => (
            <div
              key={achievement}
              className="p-4 bg-black/40 rounded-lg text-center space-y-2"
            >
              <div className="text-2xl">🏆</div>
              <div className="text-sm font-medium">{achievement}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-black/40 space-y-4">
        <h2 className="font-mono text-red-500">CURRENT MISSION</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-xl">⚔️</span>
            </div>
            <div>
              <h3 className="font-bold">30 Days of Dawn</h3>
              <p className="text-sm text-muted-foreground">
                Wake up at 5 AM for 30 consecutive days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-red-500 rounded-full" />
            </div>
            <span className="font-mono text-sm">10/30</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
