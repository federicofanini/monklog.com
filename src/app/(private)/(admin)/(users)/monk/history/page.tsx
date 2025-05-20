import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreakCounter } from "@/components/ui/streak-counter";
import { getDailyLogs } from "@/packages/database/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";
import { RetryButton } from "@/components/ui/retry-button";
import Link from "next/link";

export default async function HistoryPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    // Get user's current streak and logs
    const [userData, logs] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          current_streak: true,
          mental_toughness_score: true,
          experience_points: true,
        },
      }),
      getDailyLogs(user.id, 30),
    ]);

    // Zero state - no logs yet
    if (!logs || logs.length === 0) {
      return (
        <div className="container max-w-2xl py-8 space-y-8 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Training History</h1>
          </div>

          <Card className="p-6 bg-black/40">
            <div className="text-center space-y-4">
              <div className="text-4xl">📝</div>
              <h2 className="text-xl font-bold">No Training Logs Yet</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Your journey begins with the first log. Start tracking your
                habits, build streaks, and watch your transformation unfold.
              </p>
              <div className="pt-4">
                <Link href={paths.monk.log}>
                  <Button className="bg-red-500 hover:bg-red-600">
                    Log Your First Day
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Quick Tips Card */}
          <Card className="p-6 bg-black/40">
            <div className="space-y-4">
              <h3 className="font-mono text-red-500">GETTING STARTED</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="text-xl">🎯</div>
                  <div>
                    <h4 className="font-medium">Set Your Habits</h4>
                    <p className="text-sm text-muted-foreground">
                      Define the daily habits that will shape your
                      transformation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl">📝</div>
                  <div>
                    <h4 className="font-medium">Daily Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log your progress every evening to build consistency
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl">🧘</div>
                  <div>
                    <h4 className="font-medium">Choose Your Mentor</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a mentor style that matches your mindset
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        {/* Stats Overview */}
        <Card className="p-6 bg-black/40">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Current Streak
              </h3>
              <StreakCounter count={userData?.current_streak || 0} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Mental Toughness
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${userData?.mental_toughness_score || 0}%`,
                    }}
                  />
                </div>
                <span className="font-mono text-sm">
                  {userData?.mental_toughness_score || 0}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Experience
              </h3>
              <div className="font-mono text-lg">
                {userData?.experience_points || 0} XP
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Training History</h1>
          <Button variant="outline">Filter Logs</Button>
        </div>

        <div className="space-y-6">
          {logs.map((log) => {
            // Group habits by time block
            const habitsByBlock = log.entries.reduce(
              (acc, { entry, habit }) => {
                const block = habit.time_block;
                if (!acc[block]) acc[block] = [];
                acc[block].push({ entry, habit });
                return acc;
              },
              {} as Record<string, typeof log.entries>
            );

            const timeBlocks = [
              { id: "morning", label: "Morning", icon: "🌅" },
              { id: "day", label: "Day", icon: "⚔️" },
              { id: "evening", label: "Evening", icon: "🌙" },
            ];

            return (
              <Card key={log.log.id} className="p-6 bg-black/40 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold">
                      {new Date(log.log.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Mood:</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < (log.log.mood_score || 0)
                                  ? "bg-red-500"
                                  : "bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {log.entries.some(({ entry }) => entry.relapsed) && (
                        <span className="text-xs text-red-500">
                          Relapse Day
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Habits by Time Block */}
                <div className="grid gap-4">
                  {timeBlocks.map((block) => {
                    const blockHabits = habitsByBlock[block.id] || [];
                    if (blockHabits.length === 0) return null;

                    return (
                      <div key={block.id} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{block.icon}</span>
                          <span>{block.label}</span>
                        </div>
                        <div className="grid gap-2">
                          {blockHabits.map(({ entry, habit }) => (
                            <div
                              key={entry.id}
                              className={`flex items-center justify-between p-2 rounded ${
                                entry.completed
                                  ? "bg-red-500/10 text-red-500"
                                  : entry.relapsed
                                  ? "bg-red-900/20 text-red-500"
                                  : "bg-gray-500/10 text-gray-500"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{habit.icon || "⚡"}</span>
                                <span className="text-sm">{habit.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {entry.completed && <span>✓</span>}
                                {entry.relapsed && <span>🩸</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reflection & Mentor Response */}
                {(log.log.note || log.mentor_response) && (
                  <div className="space-y-4 pt-2">
                    {log.log.note && (
                      <div className="text-sm text-muted-foreground">
                        {log.log.note}
                      </div>
                    )}
                    {log.mentor_response && (
                      <blockquote className="font-mono text-sm border-l-2 border-red-500 pl-4 space-y-2">
                        <div className="text-muted-foreground">
                          {log.mentor_response.message}
                        </div>
                        {log.mentor_response.challenge && (
                          <div className="text-red-500">
                            ⚔️ {log.mentor_response.challenge}
                          </div>
                        )}
                      </blockquote>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading history:", error);
    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <Card className="p-6 bg-black/40">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Error Loading History</h2>
            <p className="text-muted-foreground">
              There was an error loading your training history. Please try again
              later.
            </p>
            <RetryButton />
          </div>
        </Card>
      </div>
    );
  }
}
