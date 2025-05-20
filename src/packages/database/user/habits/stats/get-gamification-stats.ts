"use server";

import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";

export async function getGamificationStats() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(paths.api.login);
  }

  try {
    const userStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        level: true,
        experience_points: true,
        current_streak: true,
        total_streaks: true,
      },
    });

    if (!userStats) {
      throw new Error("User stats not found");
    }

    // Get unlocked achievements
    const unlockedAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: {
        achievement: true,
      },
    });

    // Get available achievements
    const availableAchievements = await prisma.achievement.findMany({
      where: {
        users: {
          none: {
            userId: user.id,
          },
        },
      },
    });

    return {
      level: userStats.level,
      experiencePoints: userStats.experience_points,
      nextLevelPoints: (userStats.level + 1) * 1000, // Based on LEVEL_MULTIPLIER from gamification.ts
      currentStreak: userStats.current_streak,
      totalStreaks: userStats.total_streaks,
      unlockedAchievements: unlockedAchievements.map((ua) => ({
        name: ua.achievement.name,
        description: ua.achievement.description,
        points: ua.achievement.points,
        icon: "🏆", // You should store icons in the database
      })),
      availableAchievements: availableAchievements.map((a) => ({
        name: a.name,
        description: a.description,
        points: a.points,
        icon: "🎯", // You should store icons in the database
      })),
    };
  } catch (error) {
    console.error("Error fetching gamification stats:", error);
    throw error;
  }
}
