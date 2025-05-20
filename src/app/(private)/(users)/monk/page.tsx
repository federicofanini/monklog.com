import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreakCounter } from "@/components/ui/streak-counter";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { getUserProfile, getTodayLog } from "@/packages/database/user";
import Link from "next/link";

export default async function Page() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    redirect(paths.api.login);
  }

  // Get user data and today's log
  const [profile, todayLog] = await Promise.all([
    getUserProfile(user.id),
    getTodayLog(user.id),
  ]);

  const currentStreak = profile.user.current_streak || 0;
  const mentalToughness = profile.user.mental_toughness_score || 0;

  return (
    <div className="container max-w-4xl py-8 space-y-8 mx-auto">
      {/* Welcome Card */}
      <Card className="p-6 bg-black/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              Welcome back, {profile.user.full_name}
            </h1>
            <p className="text-muted-foreground">
              {todayLog
                ? "You've logged your day."
                : "Ready for today's training?"}
            </p>
          </div>
          {!todayLog && (
            <Link href={paths.monk.log}>
              <Button className="bg-red-500 hover:bg-red-600">
                Log Your Day
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-6 bg-black/40">
          <div className="space-y-2">
            <h2 className="font-mono text-red-500">CURRENT STREAK</h2>
            <StreakCounter count={currentStreak} className="text-2xl" />
          </div>
        </Card>

        <Card className="p-6 bg-black/40">
          <div className="space-y-2">
            <h2 className="font-mono text-red-500">MENTAL TOUGHNESS</h2>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${mentalToughness}%` }}
                />
              </div>
              <span className="font-mono">{mentalToughness}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href={paths.monk.mentor}>
          <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer h-full">
            <div className="space-y-4 text-center">
              <div className="text-2xl">🧘</div>
              <div>
                <h3 className="font-bold">Choose Mentor</h3>
                <p className="text-sm text-muted-foreground">
                  Select your guide
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href={paths.monk.history}>
          <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer h-full">
            <div className="space-y-4 text-center">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-bold">View History</h3>
                <p className="text-sm text-muted-foreground">
                  Track your progress
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href={paths.monk.settings}>
          <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer h-full">
            <div className="space-y-4 text-center">
              <div className="text-2xl">⚙️</div>
              <div>
                <h3 className="font-bold">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your experience
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Zero State for New Users */}
      {!todayLog && currentStreak === 0 && (
        <Card className="p-6 bg-black/40">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Welcome to Monk Mode</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Start your journey to mental toughness. Log your daily progress,
              choose a mentor, and track your transformation.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={paths.monk.mentor}>
                <Button variant="outline">Choose Mentor</Button>
              </Link>
              <Link href={paths.monk.log}>
                <Button className="bg-red-500 hover:bg-red-600">
                  Start Training
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
