"use client";

import { Card } from "@/components/ui/card";

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked?: boolean;
}

export function AchievementCard({
  name,
  description,
  icon,
  points,
  isUnlocked = true,
}: AchievementCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-1">{icon}</span>
        <div>
          <h4 className="font-medium mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground">
            {isUnlocked ? description : `${points} XP`}
          </p>
        </div>
      </div>
    </Card>
  );
}
