"use client";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Level</p>
          <h3 className="text-3xl font-medium">{level}</h3>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>
            {experiencePoints}/{nextLevelPoints}
          </span>
        </div>
        <Progress value={levelProgress} className="h-2" />
      </div>
    </div>
  );
}
