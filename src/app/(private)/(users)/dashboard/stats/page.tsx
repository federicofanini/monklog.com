import { HabitStats } from "@/components/private/users/habits/HabitStats";

export default function HabitsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <HabitStats
        longestStreak={14}
        currentStreak={7}
        level={5}
        experiencePoints={750}
        nextLevelPoints={1000}
      />
    </div>
  );
}
