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
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-medium mb-12">Stats</h1>

        <div className="space-y-12">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <LevelProgress
                level={gamification.level}
                experiencePoints={gamification.experiencePoints}
                nextLevelPoints={gamification.nextLevelPoints}
              />
            </Card>

            <Card>
              <StatsCard
                title="Weekly Progress"
                value={Math.round(stats.weeklyCompletionRate)}
                unit="%"
              />
            </Card>

            <Card>
              <StatsCard
                title="Current Streak"
                value={gamification.currentStreak}
                unit="days"
              />
            </Card>

            <Card>
              <StatsCard
                title="Total Habits"
                value={stats.totalHabits}
                unit="habits"
              />
            </Card>
          </div>

          {/* Achievements */}
          {gamification.unlockedAchievements.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gamification.unlockedAchievements.map(
                  (achievement: Achievement) => (
                    <Suspense
                      key={achievement.name}
                      fallback={<div>Loading achievement...</div>}
                    >
                      <AchievementCard {...achievement} />
                    </Suspense>
                  )
                )}
              </div>
            </div>
          )}

          {/* Next Goals */}
          {gamification.availableAchievements.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Next Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
