"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LevelProgressProps {
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
}

export function LevelProgress({
  level,
  experiencePoints,
  nextLevelPoints,
}: LevelProgressProps) {
  const levelProgress = (experiencePoints / nextLevelPoints) * 100;

  return (
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
  );
}
