export interface HabitCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  categoryId: string;
  category: HabitCategory;
  order: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
