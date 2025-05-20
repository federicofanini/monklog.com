import {
  getUserHabits,
  toggleHabitCompletion,
} from "@/packages/database/user/habits";
import { Suspense } from "react";
import { HabitCard } from "./habit-card";
import { Habit, CATEGORY_ICONS } from "./types";
import { HabitProgress } from "./habit-progress";

// Server Component for Category Section
function CategorySection({
  category,
  habits,
  onToggle,
}: {
  category: string;
  habits: Habit[];
  onToggle: (id: string) => Promise<void>;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{CATEGORY_ICONS[category] || CATEGORY_ICONS.default}</span>
        <span>{category}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

// Main Server Component
export async function HabitTracker() {
  const habits = await getUserHabits();

  // Group habits by category
  const habitsByCategory = habits.reduce((acc, habit) => {
    const categoryName = habit.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  async function handleToggle(id: string) {
    "use server";

    try {
      await toggleHabitCompletion(id);
    } catch (error) {
      console.error("Error toggling habit:", error);
      throw error;
    }
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={<div>Loading progress...</div>}>
        <HabitProgress completed={completedHabits} total={totalHabits} />
      </Suspense>

      <div className="space-y-8">
        {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
          <Suspense
            key={category}
            fallback={<div>Loading {category} habits...</div>}
          >
            <CategorySection
              category={category}
              habits={categoryHabits}
              onToggle={handleToggle}
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
