"use client";

import { Card } from "@/components/ui/card";
import { useTransition, useOptimistic } from "react";
import { formatHabitName } from "../../../../../lib/format-habit-name";
import { Habit, HabitToggleResponse } from "../types";
import { toast } from "sonner";

export function HabitCard({
  habit,
  onToggle,
}: {
  habit: Habit;
  onToggle: (id: string) => Promise<HabitToggleResponse>;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticHabit, setOptimisticHabit] = useOptimistic(
    habit,
    (state, completed: boolean) => ({ ...state, completedToday: completed })
  );

  const handleToggle = async () => {
    try {
      const result = await onToggle(habit.id);
      startTransition(() => {
        if ("error" in result) {
          toast.error(result.message);
        } else {
          setOptimisticHabit(result.completed);
        }
      });
    } catch (error) {
      console.error(error);
      startTransition(() => {
        setOptimisticHabit(optimisticHabit.completedToday);
        toast.error("Failed to update habit");
      });
    }
  };

  return (
    <Card
      key={habit.id}
      className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
        optimisticHabit.completedToday ? "bg-green-50 dark:bg-green-900/20" : ""
      } ${isPending ? "opacity-50" : ""}`}
      onClick={() => {
        startTransition(() => {
          setOptimisticHabit(!optimisticHabit.completedToday);
          handleToggle();
        });
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium mb-2">{formatHabitName(habit.name)}</h3>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 transition-colors ${
            optimisticHabit.completedToday
              ? "bg-green-500 border-green-500"
              : "border-gray-300"
          }`}
        >
          {optimisticHabit.completedToday && (
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
