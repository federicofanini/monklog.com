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
        select: { current_streak: true },
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Training History</h1>
          <Button variant="outline">Filter Logs</Button>
        </div>

        <div className="space-y-6">
          {logs.map((log) => (
            <Card key={log.log.id} className="p-6 bg-black/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {new Date(log.log.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <StreakCounter
                    count={userData?.current_streak || 0}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < (log.log.mood_score || 0)
                          ? "bg-red-500"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {log.entries.map(({ entry, habit }) => (
                  <span
                    key={entry.id}
                    className={`px-2 py-1 ${
                      entry.completed
                        ? "bg-red-500/10 text-red-500"
                        : "bg-gray-500/10 text-gray-500"
                    } rounded-md text-sm`}
                  >
                    {habit.name}
                    {entry.relapsed && " 🩸"}
                  </span>
                ))}
              </div>

              {log.mentor_response && (
                <blockquote className="font-mono text-muted-foreground border-l-2 border-red-500 pl-4">
                  {log.mentor_response.message}
                  {log.mentor_response.challenge && (
                    <div className="mt-2 text-sm text-red-500">
                      ⚔️ {log.mentor_response.challenge}
                    </div>
                  )}
                </blockquote>
              )}
            </Card>
          ))}
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
