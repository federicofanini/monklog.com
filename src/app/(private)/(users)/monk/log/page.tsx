import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StreakCounter } from "@/components/ui/streak-counter";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import {
  getTodayLog,
  getUserProfile,
  getUserHabits,
} from "@/packages/database/user";
import { logDay } from "./actions";
import Link from "next/link";
import { RetryButton } from "@/components/ui/retry-button";
import { RelapseButton } from "@/components/private/users/relapse-button";

export default async function LogPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    // Get today's log, user profile, and habits
    const [todayLog, profile, habits] = await Promise.all([
      getTodayLog(user.id),
      getUserProfile(user.id),
      getUserHabits(),
    ]);

    const currentStreak = profile.user.current_streak || 0;

    // If user has already logged today, show completion state
    if (todayLog) {
      return (
        <div className="container max-w-2xl py-8 space-y-8 mx-auto">
          <Card className="p-6 bg-black/40">
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <h2 className="text-xl font-bold">Day Logged Successfully</h2>
              <p className="text-muted-foreground">
                You&apos;ve already logged your progress for today. Come back
                tomorrow to continue your streak.
              </p>
              <div className="pt-4">
                <Link href={paths.monk.history}>
                  <Button variant="outline">View History</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    // If no habits configured, show zero state
    if (habits.length === 0) {
      return (
        <div className="container max-w-2xl py-8 space-y-8 mx-auto">
          <Card className="p-6 bg-black/40">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">No Habits Configured</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Set up your habits to start tracking your daily progress. This
                will help you build consistency and mental toughness.
              </p>
              <Link href={paths.monk.habits}>
                <Button variant="outline">Configure Habits</Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    // Get relapsable habits
    const relapsableHabits = habits.filter((habit) => habit.is_relapsable);

    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <div className="flex justify-between items-center">
          <StreakCounter count={currentStreak} />
          <span className="text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        <Card className="p-6 space-y-6 bg-black/40">
          <form
            action={async (formData: FormData) => {
              "use server";

              const reflection = formData.get("reflection") as string;
              const moodScore = parseInt(formData.get("mood") as string) || 3;
              const completedHabits = habits
                .filter((habit) => formData.get(`habit-${habit.id}`) === "on")
                .map((habit) => habit.id);
              const relapsedHabits = relapsableHabits
                .filter((habit) => formData.get(`relapse-${habit.id}`) === "on")
                .map((habit) => habit.id);

              await logDay(user.id, {
                reflection,
                moodScore,
                completedHabitIds: completedHabits,
                relapsedHabitIds: relapsedHabits,
              });
            }}
          >
            {/* Habits Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Today&apos;s Habits</h2>
              <div className="grid gap-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{habit.icon || "⚡"}</div>
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        {habit.criteria && (
                          <p className="text-sm text-muted-foreground">
                            {habit.criteria}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name={`habit-${habit.id}`}
                      className="size-6 rounded border-red-500 text-red-500 focus:ring-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">How did you show up today?</h2>
              <Textarea
                name="reflection"
                placeholder="Be honest with yourself. What did you accomplish? Where did you fall short?"
                className="min-h-[120px] bg-black/60"
                required
              />
            </div>

            {relapsableHabits.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="text-xl font-bold">
                  Did you relapse on any habits?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {relapsableHabits.map((habit) => (
                    <RelapseButton
                      key={habit.id}
                      id={`relapse-${habit.id}`}
                      name={habit.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Submit Daily Log
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error loading log page:", error);
    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <Card className="p-6 bg-black/40">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Error Loading Page</h2>
            <p className="text-muted-foreground">
              There was an error loading the log page. Please try again later.
            </p>
            <RetryButton />
          </div>
        </Card>
      </div>
    );
  }
}
