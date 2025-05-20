import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreakCounter } from "@/components/ui/streak-counter";

const logs = [
  {
    date: "March 15, 2024",
    streak: 13,
    habits: ["Wake Early", "Workout", "Deep Work"],
    mentorQuote: "Your discipline is becoming your identity. Keep pushing.",
    mood: 4,
  },
  {
    date: "March 14, 2024",
    streak: 12,
    habits: ["Wake Early", "Deep Work"],
    mentorQuote: "A setback is a setup for a comeback. Tomorrow we rise.",
    mood: 3,
  },
  // Add more logs as needed
];

export default function HistoryPage() {
  return (
    <div className="container max-w-2xl py-8 space-y-8 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Training History</h1>
        <Button variant="outline">Filter Logs</Button>
      </div>

      <div className="space-y-6">
        {logs.map((log, index) => (
          <Card key={index} className="p-6 bg-black/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-lg font-bold">{log.date}</div>
                <StreakCounter count={log.streak} className="text-sm" />
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < log.mood ? "bg-red-500" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {log.habits.map((habit) => (
                <span
                  key={habit}
                  className="px-2 py-1 bg-red-500/10 text-red-500 rounded-md text-sm"
                >
                  {habit}
                </span>
              ))}
            </div>

            <blockquote className="font-mono text-muted-foreground border-l-2 border-red-500 pl-4">
              {log.mentorQuote}
            </blockquote>
          </Card>
        ))}
      </div>
    </div>
  );
}
