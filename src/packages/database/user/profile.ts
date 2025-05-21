"use server";

import { HOUR } from "@/lib/time";
import { prisma } from "../prisma";
import type {
  User,
  UserSettings,
  Mission,
  Achievement,
  UserAchievement,
  MentorPersona,
  Role,
} from "@prisma/client";

// Type definitions
export interface UserProfile {
  user: User;
  settings: UserSettings | null;
  achievements: {
    achievement: Achievement;
    unlocked_at: Date;
  }[];
  currentMission?: {
    mission: Mission;
    progress: {
      current_day: number;
      completed: boolean;
    };
  };
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

export interface UserStats {
  stats: {
    date: Date;
    experience_gained: number;
    habits_completed: number;
    habits_relapsed: number;
    streak_maintained: boolean;
    mental_toughness_gained: number;
  }[];
  currentMission?: {
    mission: Mission;
    progress: {
      current_day: number;
      completed: boolean;
    };
  };
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
        missions: {
          where: {
            completed: false,
          },
          include: {
            mission: true,
          },
          take: 1,
          orderBy: {
            start_date: "desc",
          },
        },
      },
      cacheStrategy: { ttl: HOUR },
    });

    if (!user) {
      return null;
    }

    const currentMission = user.missions[0];

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        paid: user.paid,
        role: user.role as Role,
        joined_at: user.joined_at,
        mental_toughness_score: user.mental_toughness_score,
        experience_points: user.experience_points,
        level: user.level,
        total_streaks: user.total_streaks,
        current_streak: user.current_streak,
        current_mentor_persona: user.current_mentor_persona as MentorPersona,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      settings: user.settings,
      achievements: user.achievements.map((ua) => ({
        achievement: ua.achievement,
        unlocked_at: ua.unlocked_at,
      })),
      currentMission: currentMission
        ? {
            mission: currentMission.mission,
            progress: {
              current_day: currentMission.current_day,
              completed: currentMission.completed,
            },
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserSettings(
  userId: string,
  input: UserSettingsInput
): Promise<UserSettings> {
  try {
    return await prisma.userSettings.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        morning_checkin_enabled: input.morningCheckinEnabled,
        evening_log_enabled: input.eveningLogEnabled,
        mentor_messages_enabled: input.mentorMessagesEnabled,
        aggressive_tone_enabled: input.aggressiveToneEnabled,
        daily_challenges_enabled: input.dailyChallengesEnabled,
        public_profile: input.publicProfile,
        share_progress: input.shareProgress,
      },
      update: {
        morning_checkin_enabled: input.morningCheckinEnabled,
        evening_log_enabled: input.eveningLogEnabled,
        mentor_messages_enabled: input.mentorMessagesEnabled,
        aggressive_tone_enabled: input.aggressiveToneEnabled,
        daily_challenges_enabled: input.dailyChallengesEnabled,
        public_profile: input.publicProfile,
        share_progress: input.shareProgress,
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const [stats, currentMission] = await Promise.all([
      prisma.dailyStats.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7,
        cacheStrategy: { ttl: HOUR },
      }),
      prisma.userMission.findFirst({
        where: {
          userId,
          completed: false,
        },
        include: {
          mission: true,
        },
        orderBy: {
          start_date: "desc",
        },
        cacheStrategy: { ttl: HOUR },
      }),
    ]);

    return {
      stats,
      currentMission: currentMission
        ? {
            mission: currentMission.mission,
            progress: {
              current_day: currentMission.current_day,
              completed: currentMission.completed,
            },
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

export async function getUserAchievements(
  userId: string
): Promise<UserAchievement[]> {
  try {
    return await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlocked_at: "desc" },
      cacheStrategy: { ttl: HOUR },
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
}
