"use server";

import { revalidatePath } from "next/cache";
import { updateUserSettings } from "@/packages/database/user";
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

export async function updateSettings(
  userId: string,
  input: UpdateSettingsInput
) {
  try {
    await updateUserSettings(userId, {
      morningCheckinEnabled: input.morningCheckinEnabled,
      eveningLogEnabled: input.eveningLogEnabled,
      mentorMessagesEnabled: input.mentorMessagesEnabled,
      aggressiveToneEnabled: input.aggressiveToneEnabled,
      dailyChallengesEnabled: input.dailyChallengesEnabled,
      publicProfile: input.publicProfile,
      shareProgress: input.shareProgress,
    });

    revalidatePath(paths.monk.settings);
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function resetProgress(userId: string) {
  try {
    // Reset user's progress
    // This is a destructive action that should require confirmation
    return { success: true };
  } catch (error) {
    console.error("Error resetting progress:", error);
    return { success: false, error: "Failed to reset progress" };
  }
}

export async function deleteAccount(userId: string) {
  try {
    // Delete user's account
    // This is a destructive action that should require confirmation
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
