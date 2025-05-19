import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsProps {
  longestStreak: number;
  currentStreak: number;
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
}

export function HabitStats({
  longestStreak = 14,
  currentStreak = 7,
  level = 5,
  experiencePoints = 750,
  nextLevelPoints = 1000,
}: StatsProps) {
  const levelProgress = (experiencePoints / nextLevelPoints) * 100;

  return (
    <div className="min-h-[calc(100vh-12rem)] grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Stats Section */}
      <div className="lg:col-span-8 space-y-6">
        {/* Level Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold">Level {level}</h3>
              <p className="text-sm text-gray-500">Monk Warrior</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">XP Progress</span>
              <span>
                {experiencePoints}/{nextLevelPoints} XP
              </span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <span className="text-2xl">⚡️</span>
              </div>
              <div>
                <h4 className="text-lg font-medium">7-Day Warrior</h4>
                <p className="text-sm text-gray-500">
                  Completed all habits for 7 days straight
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-2xl">🌊</span>
              </div>
              <div>
                <h4 className="text-lg font-medium">Early Riser</h4>
                <p className="text-sm text-gray-500">
                  Woke up before 6:30 AM for 5 days
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h4 className="text-lg font-medium">Focus Master</h4>
                <p className="text-sm text-gray-500">
                  Completed 4+ hours of deep work for 3 days
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <div>
                <h4 className="text-lg font-medium">Discipline Master</h4>
                <p className="text-sm text-gray-500">
                  No bad habits for 10 days straight
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Side Stats */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Current Stats</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Longest Streak</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{longestStreak}</span>
                <span className="text-gray-500 ml-2">days</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Streak</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{currentStreak}</span>
                <span className="text-gray-500 ml-2">days</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Next Level In</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  {nextLevelPoints - experiencePoints}
                </span>
                <span className="text-gray-500 ml-2">XP</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Achievements */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Next Achievements</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h4 className="font-medium">14-Day Warrior</h4>
                <p className="text-sm text-gray-500">7 days to go</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xl">⭐️</span>
              </div>
              <div>
                <h4 className="font-medium">Level 6</h4>
                <p className="text-sm text-gray-500">250 XP to go</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
