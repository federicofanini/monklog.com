export interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
}

export interface GamificationStats {
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
  currentStreak: number;
  totalStreaks: number;
  unlockedAchievements: Achievement[];
  availableAchievements: Achievement[];
}

export interface HabitStats {
  weeklyCompletionRate: number;
  currentStreak: number;
  totalHabits: number;
}
