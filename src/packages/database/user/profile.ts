import { HOUR } from "@/lib/time";
import { prisma } from "../prisma";
import type {
  UserProfile,
  UserSettings,
  UserSettingsInput,
  UserStats,
  UserAchievement,
} from "../../shared/types/types";

export async function getUserProfile(userId: string): Promise<UserProfile> {
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
        },
      },
      cacheStrategy: { ttl: HOUR },
    });

    if (!user) throw new Error("User not found");

    const currentMission = user.missions[0];

    return {
      user,
      settings: user.settings,
      achievements: user.achievements.map((ua) => ({
        achievement: ua.achievement,
        unlocked_at: ua.unlocked_at,
      })),
      currentMission: currentMission
        ? {
            mission: currentMission.mission,
            progress: currentMission,
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

export async function getUserStats(userId: string): Promise<UserStats> {
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
        cacheStrategy: { ttl: HOUR },
      }),
    ]);

    return {
      stats,
      currentMission: currentMission
        ? {
            mission: currentMission.mission,
            progress: currentMission,
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
