export interface Habit {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  order: number;
  completedToday: boolean;
  streak?: number;
}

export type HabitToggleResponse =
  | { success: true; completed: boolean }
  | { error: string; message: string };

export const CATEGORY_ICONS: Record<string, string> = {
  "Mind & Spirit": "🧘‍♂️",
  "Health & Fitness": "💪",
  "Work & Skills": "💼",
  "Optional High-Level": "🧘",
};
