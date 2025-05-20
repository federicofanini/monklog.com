"use client";

import { Suspense, useMemo, memo } from "react";
import { CATEGORY_ICONS, Habit } from "../types";
import { HabitCard } from "./habit-card";
import { handleHabitToggle } from "../stats/actions";

// Optimized Category Section with memo
const CategorySection = memo(function CategorySection({
  category,
  habits,
  onHabitStateChange,
}: {
  category: string;
  habits: Habit[];
  onHabitStateChange: (habitId: string, completed: boolean) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{CATEGORY_ICONS[category] || CATEGORY_ICONS.default}</span>
        <span>{category}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={async (id) => {
              const result = await handleHabitToggle(id);
              if ("success" in result) {
                onHabitStateChange(id, result.completed);
              }
              return result;
            }}
          />
        ))}
      </div>
    </div>
  );
});

CategorySection.displayName = "CategorySection";

export function HabitCategories({
  habits,
  onHabitStateChange,
}: {
  habits: Habit[];
  onHabitStateChange: (habitId: string, completed: boolean) => void;
}) {
  // Group habits by category - memoized computation
  const habitsByCategory = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const categoryName = habit.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(habit);
      return acc;
    }, {} as Record<string, Habit[]>);
  }, [habits]);

  return (
    <div className="space-y-8">
      {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
        <Suspense
          key={category}
          fallback={<div>Loading {category} habits...</div>}
        >
          <CategorySection
            category={category}
            habits={categoryHabits}
            onHabitStateChange={onHabitStateChange}
          />
        </Suspense>
      ))}
    </div>
  );
}
