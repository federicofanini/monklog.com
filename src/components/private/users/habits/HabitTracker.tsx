"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Habit {
  id: string;
  name: string;
  category: string;
  order: number;
  completed: boolean;
  streak: number;
}

const CATEGORIES = {
  "Mind & Discipline": "🧠",
  "Body & Energy": "💪",
  "Work & Purpose": "🛠️",
  "Optional High-Level": "🧘",
};

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Wake up early (before 6:30 AM)",
      category: "Mind & Discipline",
      order: 0,
      completed: false,
      streak: 5,
    },
    {
      id: "2",
      name: "No smoking",
      category: "Mind & Discipline",
      order: 0,
      completed: false,
      streak: 10,
    },
    {
      id: "3",
      name: "No alcohol",
      category: "Mind & Discipline",
      order: 0,
      completed: false,
      streak: 15,
    },
    {
      id: "4",
      name: "Daily workout",
      category: "Body & Energy",
      order: 1,
      completed: false,
      streak: 3,
    },
    {
      id: "5",
      name: "10,000+ steps",
      category: "Body & Energy",
      order: 1,
      completed: false,
      streak: 4,
    },
    {
      id: "6",
      name: "4+ hours of deep work",
      category: "Work & Purpose",
      order: 2,
      completed: false,
      streak: 7,
    },
    {
      id: "7",
      name: "Ship or share progress daily",
      category: "Work & Purpose",
      order: 2,
      completed: false,
      streak: 2,
    },
  ]);

  const completedHabits = habits.filter((h) => h.completed).length;
  const totalHabits = habits.length;
  const progress = (completedHabits / totalHabits) * 100;

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
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
              <span>{CATEGORIES[category as keyof typeof CATEGORIES]}</span>
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
                      <h3 className="font-medium mb-2">{habit.name}</h3>
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
