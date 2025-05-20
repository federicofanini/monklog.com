"use server";

import { prisma } from "../../prisma";
import { startOfDay } from "date-fns";
import type { Prisma, User } from "@prisma/client";

// Experience points constants
const XP_PER_HABIT = 50;
const STREAK_BONUS = 25;
const LEVEL_MULTIPLIER = 1000; // XP needed per level = level * LEVEL_MULTIPLIER

interface Achievement {
  name: string;
  description: string;
  points: number;
}

interface GamificationResult {
  experienceGained: number;
  newLevel?: number;
  achievements?: Achievement[];
}

type ExtendedUser = User & {
  experience_points: number;
  level: number;
  current_streak: number;
  total_streaks: number;
};

type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function processHabitCompletion(
  userId: string,
  habitId: string,
  completed: boolean
): Promise<GamificationResult> {
  const today = startOfDay(new Date());
  let experienceGained = 0;
  const unlockedAchievements: Achievement[] = [];

  // Start a transaction to ensure data consistency
  const result = await prisma.$transaction(async (prisma) => {
    // Get user's current stats
    const user = (await prisma.user.findUnique({
      where: { id: userId },
    })) as ExtendedUser;

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Get or create daily stats
    let dailyStats = await prisma.dailyStats.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (!dailyStats) {
      dailyStats = await prisma.dailyStats.create({
        data: {
          userId,
          date: today,
          experience_gained: 0,
          habits_completed: 0,
          streak_maintained: false,
        },
      });
    }

    if (completed) {
      // Award base XP for completing a habit
      experienceGained += XP_PER_HABIT;

      // Check and update streak
      const streakMaintained = user.current_streak > 0;
      if (streakMaintained) {
        experienceGained += STREAK_BONUS;
      }

      // Update daily stats
      await prisma.dailyStats.update({
        where: { id: dailyStats.id },
        data: {
          experience_gained: dailyStats.experience_gained + experienceGained,
          habits_completed: dailyStats.habits_completed + 1,
          streak_maintained: true,
        },
      });

      // Calculate new level
      const totalXP = user.experience_points + experienceGained;
      const newLevel = Math.floor(totalXP / LEVEL_MULTIPLIER) + 1;
      const leveledUp = newLevel > user.level;

      // Update user stats
      await prisma.user.update({
        where: { id: userId },
        data: {
          experience_points: totalXP,
          level: newLevel,
          current_streak: user.current_streak + (streakMaintained ? 1 : 0),
          total_streaks: streakMaintained
            ? user.total_streaks
            : user.total_streaks + 1,
        } as Prisma.UserUpdateInput,
      });

      // Check for achievements
      const achievements = await checkAndUnlockAchievements(prisma, userId, {
        habitId,
        experienceGained,
        totalXP,
        newLevel,
        leveledUp,
        currentStreak: user.current_streak + 1,
      });

      unlockedAchievements.push(...achievements);
    }

    return {
      experienceGained,
      newLevel: completed
        ? Math.floor(
            (user.experience_points + experienceGained) / LEVEL_MULTIPLIER
          ) + 1
        : undefined,
      achievements: unlockedAchievements,
    };
  });

  return result;
}

async function checkAndUnlockAchievements(
  prisma: TransactionClient,
  userId: string,
  stats: {
    habitId: string;
    experienceGained: number;
    totalXP: number;
    newLevel: number;
    leveledUp: boolean;
    currentStreak: number;
  }
): Promise<Achievement[]> {
  const unlockedAchievements: Achievement[] = [];

  // Get all achievements that the user hasn't unlocked yet
  const availableAchievements = await prisma.achievement.findMany({
    where: {
      users: {
        none: {
          userId,
        },
      },
    },
  });

  for (const achievement of availableAchievements) {
    const conditions = JSON.parse(achievement.condition);
    let achieved = false;

    // Check different types of conditions
    if (conditions.type === "level" && stats.newLevel >= conditions.level) {
      achieved = true;
    } else if (
      conditions.type === "streak" &&
      stats.currentStreak >= conditions.days
    ) {
      achieved = true;
    } else if (
      conditions.type === "total_xp" &&
      stats.totalXP >= conditions.xp
    ) {
      achieved = true;
    }

    if (achieved) {
      // Unlock the achievement
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });

      unlockedAchievements.push({
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
      });
    }
  }

  return unlockedAchievements;
}

export async function getAvailableRewards(userId: string) {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
  })) as ExtendedUser;

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  return prisma.reward.findMany({
    where: {
      cost: {
        lte: user.experience_points,
      },
      users: {
        none: {
          userId,
          claimed: true,
        },
      },
    },
  });
}

export async function claimReward(
  userId: string | undefined,
  rewardId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return prisma.$transaction(async (prisma) => {
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new Error("Reward not found");
    }

    const user = (await prisma.user.findUnique({
      where: { id: userId },
    })) as ExtendedUser;

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    if (user.experience_points < reward.cost) {
      throw new Error("Insufficient experience points");
    }

    // Claim the reward and deduct points
    await prisma.userReward.create({
      data: {
        userId,
        rewardId,
        claimed: true,
        claim_at: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        experience_points: user.experience_points - reward.cost,
      } as Prisma.UserUpdateInput,
    });

    return reward;
  });
}
