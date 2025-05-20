import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { getGamificationStats } from "@/packages/database/user/habits/stats/get-gamification-stats";
import { LevelProgress } from "./level-progress";
import { AchievementCard } from "./achievement-card";
import { StatsCard } from "./stats-card";
import { Achievement } from "./type";
import { getUserHabitStats } from "@/packages/database/user/habits/stats/get-stats";

// Main Server Component
export async function HabitStats() {
  const [stats, gamification] = await Promise.all([
    getUserHabitStats(),
    getGamificationStats(),
  ]);

  return (
    <div className="min-h-[calc(100vh-12rem)] grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Stats Section */}
      <div className="lg:col-span-8 space-y-6">
        {/* Level Progress */}
        <Suspense fallback={<div>Loading level progress...</div>}>
          <LevelProgress
            level={gamification.level}
            experiencePoints={gamification.experiencePoints}
            nextLevelPoints={gamification.nextLevelPoints}
          />
        </Suspense>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gamification.unlockedAchievements.map((achievement: Achievement) => (
            <Suspense
              key={achievement.name}
              fallback={<div>Loading achievement...</div>}
            >
              <AchievementCard {...achievement} />
            </Suspense>
          ))}
        </div>
      </div>

      {/* Side Stats */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Current Stats</h3>
          <div className="space-y-6">
            <Suspense fallback={<div>Loading stats...</div>}>
              <StatsCard
                title="Weekly Completion Rate"
                value={Math.round(stats.weeklyCompletionRate)}
                unit="%"
              />
              <StatsCard
                title="Current Streak"
                value={gamification.currentStreak}
                unit="days"
              />
              <StatsCard
                title="Total Habits"
                value={stats.totalHabits}
                unit="habits"
              />
            </Suspense>
          </div>
        </Card>

        {/* Upcoming Achievements */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Next Achievements</h3>
          <div className="space-y-4">
            {gamification.availableAchievements.map(
              (achievement: Achievement) => (
                <Suspense
                  key={achievement.name}
                  fallback={<div>Loading upcoming achievement...</div>}
                >
                  <AchievementCard {...achievement} isUnlocked={false} />
                </Suspense>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
