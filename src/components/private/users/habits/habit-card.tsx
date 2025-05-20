"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { formatHabitName } from "../../../../lib/format-habit-name";
import { Habit } from "./types";
import { useRouter } from "next/navigation";

export function HabitCard({
  habit,
  onToggle,
}: {
  habit: Habit;
  onToggle: (id: string) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    habit.completedToday
  );
  const router = useRouter();

  const isCompleted = isLoading ? optimisticCompleted : habit.completedToday;

  return (
    <Card
      key={habit.id}
      className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
        isCompleted ? "bg-green-50 dark:bg-green-900/20" : ""
      } ${isLoading ? "opacity-50" : ""}`}
      onClick={async () => {
        setIsLoading(true);
        setOptimisticCompleted(!isCompleted);
        try {
          await onToggle(habit.id);
          router.refresh();
        } catch {
          // Revert optimistic update on error
          setOptimisticCompleted(isCompleted);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium mb-2">{formatHabitName(habit.name)}</h3>
          <div className="mt-2 text-sm text-gray-500">
            🔥 0 day streak {/* Streak will come from gamification system */}
          </div>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 ${
            isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"
          }`}
        >
          {isCompleted && (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
}
