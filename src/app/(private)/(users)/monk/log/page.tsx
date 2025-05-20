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
import { logDay, clearCache } from "./actions";
import Link from "next/link";
import { RetryButton } from "@/components/ui/retry-button";
import { RelapseButton } from "@/components/private/users/relapse-button";
import { getCurrentMentorPersona } from "@/packages/database/user/mentor";

export default async function LogPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  try {
    // Get today's log, user profile, habits, and mentor
    const [todayLog, profile, habits, mentorPersona] = await Promise.all([
      getTodayLog(user.id),
      getUserProfile(user.id),
      getUserHabits(),
      getCurrentMentorPersona(user.id),
    ]);

    const currentStreak = profile.user.current_streak || 0;
    const mentalToughness = profile.user.mental_toughness_score || 0;

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
              <div className="flex justify-center gap-4 pt-4">
                <Link href={paths.monk.history}>
                  <Button variant="outline">View History</Button>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await clearCache();
                  }}
                >
                  <Button variant="outline" type="submit">
                    Clear Cache
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    // If no habits configured, show zero state with mentor context
    if (habits.length === 0) {
      return (
        <div className="container max-w-2xl py-8 space-y-8 mx-auto">
          <Card className="p-6 bg-black/40">
            <div className="text-center space-y-4">
              <div className="text-4xl">⚔️</div>
              <h2 className="text-xl font-bold">Time to Define Your Mission</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {mentorPersona === "GHOST" &&
                  "No habits means no progress. Let's fix that."}
                {mentorPersona === "WARRIOR" &&
                  "A warrior needs a battle plan. Let's create yours."}
                {mentorPersona === "MONK" &&
                  "The path begins with daily practice. Let's establish yours."}
                {mentorPersona === "SHADOW" &&
                  "Every transformation needs structure. Let's build yours."}
              </p>
              <Link href={paths.monk.habits}>
                <Button className="bg-red-500 hover:bg-red-600">
                  Configure Habits
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      );
    }

    // Group habits by time block for better organization
    const habitsByTimeBlock = habits.reduce((acc, habit) => {
      const block = habit.time_block;
      if (!acc[block]) acc[block] = [];
      acc[block].push(habit);
      return acc;
    }, {} as Record<string, typeof habits>);

    const timeBlocks = [
      { id: "morning", label: "Morning Mission", icon: "🌅" },
      { id: "day", label: "Daily Operations", icon: "⚔️" },
      { id: "evening", label: "Evening Protocol", icon: "🌙" },
    ];

    return (
      <div className="container max-w-2xl py-8 space-y-8 mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <StreakCounter count={currentStreak} />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mental Toughness:</span>
              <div className="flex-1 w-32 h-1.5 bg-red-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${mentalToughness}%` }}
                />
              </div>
              <span className="font-mono">{mentalToughness}%</span>
            </div>
          </div>
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
              const relapsableHabits = habits.filter((h) => h.is_relapsable);
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
            <div className="space-y-6">
              {timeBlocks.map((block) => {
                const blockHabits = habitsByTimeBlock[block.id] || [];
                if (blockHabits.length === 0) return null;

                return (
                  <div key={block.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{block.icon}</span>
                      <h2 className="text-lg font-bold">{block.label}</h2>
                    </div>
                    <div className="grid gap-3">
                      {blockHabits.map((habit) => (
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
                              {habit.minutes > 0 && (
                                <span className="text-xs text-red-500">
                                  {habit.minutes}min
                                </span>
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
                );
              })}
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

            {/* Mood Score */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">Mental State</h2>
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Weak</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label
                      key={score}
                      className="relative size-8 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="mood"
                        value={score}
                        className="peer sr-only"
                        defaultChecked={score === 3}
                      />
                      <div className="size-full rounded-full bg-black/40 ring-1 ring-red-500/20 transition-all hover:bg-red-500/20 peer-checked:bg-red-500/20 peer-checked:ring-red-500" />
                    </label>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Strong</span>
              </div>
            </div>

            {/* Relapses Section */}
            {habits.some((h) => h.is_relapsable) && (
              <div className="space-y-4 mt-6">
                <h2 className="text-xl font-bold">
                  Did you relapse on any habits?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {habits
                    .filter((h) => h.is_relapsable)
                    .map((habit) => (
                      <RelapseButton
                        key={habit.id}
                        id={`relapse-${habit.id}`}
                        name={habit.name}
                      />
                    ))}
                </div>
              </div>
            )}

            <div className="pt-6">
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
            <div className="flex justify-center gap-4">
              <RetryButton />
              <form
                action={async () => {
                  "use server";
                  await clearCache();
                }}
              >
                <Button variant="outline" type="submit">
                  Clear Cache
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
