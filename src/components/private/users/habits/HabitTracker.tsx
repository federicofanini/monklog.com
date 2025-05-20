"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getUserHabits,
  toggleHabitCompletion,
} from "@/packages/database/user/habits";
import { useGamification } from "@/hooks/useGamification";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  category: string;
  order: number;
  completed: boolean;
  streak: number;
}

// Helper function to format habit name
function formatHabitName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const CATEGORY_ICONS = {
  "Mind & Discipline": "🧠",
  "Body & Energy": "💪",
  "Work & Purpose": "🛠️",
  "Optional High-Level": "🧘",
  // Add fallback for unknown categories
  default: "📌",
};

export function HabitTracker({ userId }: { userId: string | undefined }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { updateGamification } = useGamification(userId);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const userHabits = await getUserHabits();
      setHabits(
        userHabits.map((h) => ({
          id: h.id,
          name: h.name,
          category: h.category.name,
          order: h.order,
          completed: h.completedToday,
          streak: 0, // This will come from the gamification system
        }))
      );
    } catch (error) {
      console.error("Error loading habits:", error);
      toast.error("Failed to load habits");
    }
  };

  const completedHabits = habits.filter((h) => h.completed).length;
  const totalHabits = habits.length;
  const progress = (completedHabits / totalHabits) * 100;

  const toggleHabit = async (id: string) => {
    try {
      const result = await toggleHabitCompletion(id);

      // Update local state
      setHabits(
        habits.map((habit) =>
          habit.id === id ? { ...habit, completed: result.completed } : habit
        )
      );

      // Update gamification state
      if (result.gamification) {
        // Add default icons to achievements before updating state
        const gamificationWithIcons = {
          ...result.gamification,
          achievements: result.gamification.achievements?.map(
            (achievement) => ({
              ...achievement,
              icon: "🏆", // Default icon for all achievements
            })
          ),
        };
        updateGamification(gamificationWithIcons);

        // Show achievement notifications
        result.gamification.achievements?.forEach((achievement) => {
          toast.success(`Achievement Unlocked: ${achievement.name}`, {
            description: achievement.description,
          });
        });

        if (result.gamification.experienceGained > 0) {
          toast.success(`+${result.gamification.experienceGained} XP`);
        }
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    }
  };

  // Group habits by category
  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <div className="space-y-8">
      {/* Daily Progress */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Today&apos;s Progress</h2>
          <div className="text-xl font-semibold">
            {completedHabits}/{totalHabits}
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Habits by Category */}
      <div className="space-y-8">
        {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>
                {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] ||
                  CATEGORY_ICONS.default}
              </span>
              <span>{category}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryHabits.map((habit) => (
                <Card
                  key={habit.id}
                  className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                    habit.completed ? "bg-green-50 dark:bg-green-900/20" : ""
                  }`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-2">
                        {formatHabitName(habit.name)}
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        🔥 {habit.streak} day streak
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        habit.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {habit.completed && (
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
