"use server";

import { prisma } from "../prisma";
import { getAggregatedStats } from "./profile";
import type { AggregatedStats } from "./profile";

export type PublicProfile = {
  username: string;
  full_name: string;
  avatar_url: string | null;
  joined_at: Date;
  mental_toughness_score: number;
  level: number;
  total_streaks: number;
  current_streak: number;
  stats: AggregatedStats | null;
};

export async function getPublicProfile(
  username: string
): Promise<PublicProfile | null> {
  try {
    // First, find the user with their settings
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        settings: true,
      },
    });

    // Check if user exists and has public profile enabled
    if (!user?.username || !user.settings?.public_profile) {
      console.log("User not found or profile not public:", { username, user });
      return null;
    }

    // Get user stats
    const stats = await getAggregatedStats(30, user.id);

    return {
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      joined_at: user.joined_at,
      mental_toughness_score: user.mental_toughness_score,
      level: user.level,
      total_streaks: user.total_streaks,
      current_streak: user.current_streak,
      stats,
    };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}
