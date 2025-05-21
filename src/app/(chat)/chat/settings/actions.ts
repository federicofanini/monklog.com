"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/packages/database/prisma";
import { paths } from "@/lib/path";

export interface UpdateSettingsInput {
  morningCheckinEnabled: boolean;
  eveningLogEnabled: boolean;
  mentorMessagesEnabled: boolean;
  aggressiveToneEnabled: boolean;
  dailyChallengesEnabled: boolean;
  publicProfile: boolean;
  shareProgress: boolean;
}

export async function initializeSettings(userId: string) {
  try {
    const settings = await prisma.userSettings.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        morning_checkin_enabled: true,
        evening_log_enabled: true,
        mentor_messages_enabled: true,
        aggressive_tone_enabled: false,
        daily_challenges_enabled: true,
        public_profile: false,
        share_progress: false,
      },
      update: {}, // No updates needed if exists
    });

    return { success: true, settings };
  } catch (error) {
    console.error("Error initializing settings:", error);
    return { success: false, error: "Failed to initialize settings" };
  }
}

export async function updateSettings(
  userId: string,
  input: UpdateSettingsInput
) {
  try {
    // Use upsert to create settings if they don't exist
    await prisma.userSettings.upsert({
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

    revalidatePath(paths.users.settings);
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function resetProgress(userId: string) {
  try {
    // Use transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Reset user stats
      await tx.user.update({
        where: { id: userId },
        data: {
          mental_toughness_score: 0,
          experience_points: 0,
          level: 1,
          total_streaks: 0,
          current_streak: 0,
        },
      });

      // Delete all habit logs
      await tx.habitLog.deleteMany({
        where: { userId },
      });

      // Delete all daily stats
      await tx.dailyStats.deleteMany({
        where: { userId },
      });

      // Delete all user achievements
      await tx.userAchievement.deleteMany({
        where: { userId },
      });

      // Delete all user missions
      await tx.userMission.deleteMany({
        where: { userId },
      });

      // Delete all mentor messages
      await tx.mentorMessage.deleteMany({
        where: { userId },
      });

      // Delete all user rewards
      await tx.userReward.deleteMany({
        where: { userId },
      });
    });

    revalidatePath(paths.users.settings);
    return { success: true };
  } catch (error) {
    console.error("Error resetting progress:", error);
    return { success: false, error: "Failed to reset progress" };
  }
}

export async function deleteAccount(userId: string) {
  try {
    // Use transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete all related data first (due to foreign key constraints)
      await tx.userSettings.deleteMany({
        where: { userId },
      });

      await tx.habitLog.deleteMany({
        where: { userId },
      });

      await tx.dailyStats.deleteMany({
        where: { userId },
      });

      await tx.userAchievement.deleteMany({
        where: { userId },
      });

      await tx.userMission.deleteMany({
        where: { userId },
      });

      await tx.mentorMessage.deleteMany({
        where: { userId },
      });

      await tx.userReward.deleteMany({
        where: { userId },
      });

      await tx.plan.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
