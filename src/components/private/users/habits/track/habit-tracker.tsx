"use client";

import { getUserHabits } from "@/packages/database/user/habits";
import { HabitProgress } from "./habit-progress";
import { HabitCategories } from "./habit-categories";
import { useEffect, useState } from "react";
import { Habit } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await getUserHabits();
        if (data) {
          setHabits(data);
        }
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  // Function to update local state when a habit is toggled
  const onHabitStateChange = (habitId: string, completed: boolean) => {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === habitId ? { ...habit, completedToday: completed } : habit
      )
    );
  };

  return (
    <div className="space-y-8">
      <HabitProgress completed={completedHabits} total={totalHabits} />
      <HabitCategories
        habits={habits}
        onHabitStateChange={onHabitStateChange}
      />
    </div>
  );
}
