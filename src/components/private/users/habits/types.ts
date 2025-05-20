export interface Habit {
  id: string;
  name: string;
  category: {
    name: string;
    id: string;
  };
  order: number;
  completedToday: boolean;
}

export const CATEGORY_ICONS: Record<string, string> = {
  "Mind & Discipline": "🧠",
  "Body & Energy": "💪",
  "Work & Purpose": "🛠️",
  "Optional High-Level": "🧘",
};
