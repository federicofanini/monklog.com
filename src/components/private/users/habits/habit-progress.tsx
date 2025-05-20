"use client";

import { Progress } from "@/components/ui/progress";

export function HabitProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const progress = (completed / total) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Today&apos;s Progress</h2>
        <div className="text-xl font-semibold">
          {completed}/{total}
        </div>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  );
}
