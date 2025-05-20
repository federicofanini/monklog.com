// Re-export Prisma's MentorPersona enum
import type { MentorPersona } from "@prisma/client";
export { MentorPersona };

// Enums
export enum Role {
  MONK = "MONK",
  ADMIN = "ADMIN",
}

export enum PlanName {
  FREE = "FREE",
  PRO = "PRO",
}

// Input Types
export interface DailyLogInput {
  note: string;
  moodScore: number;
  habitIds: string[];
  relapseIds: string[];
}

export interface UserSettingsInput {
  morningCheckinEnabled: boolean;
  eveningLogEnabled: boolean;
  mentorMessagesEnabled: boolean;
  aggressiveToneEnabled: boolean;
  dailyChallengesEnabled: boolean;
  publicProfile: boolean;
  shareProgress: boolean;
}

export interface MentorPreferenceInput {
  persona: MentorPersona;
}

// Database Types
export interface User {
  id: string;
  email: string;
  username?: string;
  full_name: string;
  avatar_url?: string;
  paid: boolean;
  role: Role;
  joined_at: Date;
  mental_toughness_score: number;
  experience_points: number;
  level: number;
  total_streaks: number;
  current_streak: number;
  current_mentor_persona: MentorPersona;
  created_at: Date;
  updated_at: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  morning_checkin_enabled: boolean;
  evening_log_enabled: boolean;
  mentor_messages_enabled: boolean;
  aggressive_tone_enabled: boolean;
  daily_challenges_enabled: boolean;
  public_profile: boolean;
  share_progress: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface HabitLog {
  id: string;
  userId: string;
  date: Date;
  note?: string;
  mood_score?: number;
  created_at: Date;
  updated_at: Date;
}

export interface HabitEntry {
  id: string;
  habitLogId: string;
  habitId: string;
  completed: boolean;
  relapsed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  is_relapsable: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface MentorMessage {
  id: string;
  userId: string;
  habitLogId?: string;
  persona: MentorPersona;
  message: string;
  reflection?: string;
  challenge?: string;
  created_at: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  condition: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlocked_at: Date;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserMission {
  id: string;
  userId: string;
  missionId: string;
  start_date: Date;
  current_day: number;
  completed: boolean;
}

export interface DailyStats {
  id: string;
  userId: string;
  date: Date;
  experience_gained: number;
  habits_completed: number;
  habits_relapsed: number;
  streak_maintained: boolean;
  mental_toughness_gained: number;
}

// Response Types
export interface UserProfile {
  user: User;
  settings: UserSettings;
  achievements: Array<{
    achievement: Achievement;
    unlocked_at: Date;
  }>;
  currentMission?: {
    mission: Mission;
    progress: UserMission;
  };
}

export interface DailyLogResponse {
  log: HabitLog;
  entries: Array<{
    entry: HabitEntry;
    habit: Habit;
  }>;
  mentor_response?: MentorMessage;
}

export interface UserStats {
  stats: DailyStats[];
  currentMission?: {
    mission: Mission;
    progress: UserMission;
  };
}
