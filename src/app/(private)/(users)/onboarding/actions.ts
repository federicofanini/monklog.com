"use server";

import { prisma } from "@/packages/database/prisma";
import { MentorPersona } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { paths } from "@/lib/path";
import { Prisma } from "@prisma/client";

export type OnboardingPreferences = {
  mentor: MentorPersona;
  commitment: "warrior" | "monk" | "ghost" | "ceo";
};

// Default habits for each commitment level
const WARRIOR_HABITS = [
  {
    name: "Wake Early",
    categoryName: "Physical",
    icon: "🌅",
    isRelapsable: true,
    timeBlock: "morning",
    minutes: 0,
    criteria: "Wake up at 5 AM sharp. No excuses.",
    order: 1,
  },
  {
    name: "Cold Shower",
    categoryName: "Physical",
    icon: "🚿",
    isRelapsable: false,
    timeBlock: "morning",
    minutes: 3,
    criteria: "3 minutes. Ice cold. Full immersion.",
    order: 2,
  },
  {
    name: "Deep Work",
    categoryName: "Mission",
    icon: "⚔️",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 240,
    criteria: "4 hours of focused, uninterrupted work on your mission.",
    order: 3,
  },
  {
    name: "No Social",
    categoryName: "Mental",
    icon: "📵",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 0,
    criteria: "Zero social media. Zero scrolling. Zero excuses.",
    order: 4,
  },
  {
    name: "Training",
    categoryName: "Physical",
    icon: "💪",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 60,
    criteria: "1 hour of intense physical training.",
    order: 5,
  },
];

const MONK_HABITS = WARRIOR_HABITS.slice(0, 3);
const GHOST_HABITS = [WARRIOR_HABITS[2]]; // Only Deep Work

export async function completeOnboarding(
  userId: string,
  preferences: OnboardingPreferences
) {
  try {
    // Wrap all database operations in a transaction with serializable isolation
    const result = await prisma.$transaction(
      async (tx) => {
        // Verify user exists within transaction
        const user = await tx.user.findUnique({
          where: { id: userId },
          include: {
            settings: true,
          },
        });

        if (!user) {
          throw new Error("User not found in transaction");
        }

        // Check if settings already exist
        if (user.settings) {
          throw new Error("User settings already exist");
        }

        // 1. Create user settings
        const settings = await tx.userSettings.create({
          data: {
            userId,
            morning_checkin_enabled: true,
            evening_log_enabled: true,
            mentor_messages_enabled: true,
            aggressive_tone_enabled:
              preferences.mentor === MentorPersona.GHOST ||
              preferences.mentor === MentorPersona.WARRIOR,
            daily_challenges_enabled: preferences.commitment === "warrior",
            public_profile: false,
            share_progress: false,
          },
        });

        if (!settings) {
          throw new Error("Failed to create user settings");
        }

        // 2. Update mentor persona
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            current_mentor_persona: preferences.mentor,
          },
        });

        if (!updatedUser) {
          throw new Error("Failed to update user mentor persona");
        }

        // 3. Create habit categories
        const categories = await Promise.all(
          ["Physical", "Mental", "Mission"].map((name) =>
            tx.habitCategory.upsert({
              where: { name },
              create: {
                name,
                description: `${name} habits for mental toughness`,
              },
              update: {},
            })
          )
        );

        // Create a map of category names to IDs
        const categoryMap = categories.reduce<Record<string, string>>(
          (acc, cat) => {
            acc[cat.name] = cat.id;
            return acc;
          },
          {}
        );

        // 4. Create habits based on commitment level
        const habitsToCreate =
          preferences.commitment === "warrior"
            ? WARRIOR_HABITS
            : preferences.commitment === "monk"
            ? MONK_HABITS
            : GHOST_HABITS;

        const habits = await Promise.all(
          habitsToCreate.map((habit) =>
            tx.habit.create({
              data: {
                name: habit.name,
                categoryId: categoryMap[habit.categoryName],
                icon: habit.icon,
                is_relapsable: habit.isRelapsable,
                time_block: habit.timeBlock,
                minutes: habit.minutes,
                criteria: habit.criteria,
                order: habit.order,
              },
            })
          )
        );

        // Create initial habit log for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const habitLog = await tx.habitLog.create({
          data: {
            userId,
            date: today,
            entries: {
              create: habits.map((habit) => ({
                habitId: habit.id,
                completed: false,
                relapsed: false,
              })),
            },
          },
        });

        if (!habitLog) {
          throw new Error("Failed to create initial habit log");
        }

        // Initialize user stats
        const stats = await tx.dailyStats.create({
          data: {
            userId,
            date: today,
            habits_completed: 0,
            habits_relapsed: 0,
            streak_maintained: true,
            mental_toughness_gained: 0,
            experience_gained: 0,
          },
        });

        if (!stats) {
          throw new Error("Failed to create initial stats");
        }

        // 5. Create initial mission
        const mission = await tx.mission.create({
          data: {
            name: "30 Days of Dawn",
            description:
              "Wake up at 5 AM for 30 consecutive days. This is your first test of will.",
            duration_days: 30,
            icon: "🌅",
          },
        });

        if (!mission) {
          throw new Error("Failed to create initial mission");
        }

        const userMission = await tx.userMission.create({
          data: {
            userId,
            missionId: mission.id,
          },
        });

        if (!userMission) {
          throw new Error("Failed to assign mission to user");
        }

        // 6. Create and assign first achievement
        const achievement = await tx.achievement.create({
          data: {
            name: "First Blood",
            description: "Begin your journey to mental toughness",
            icon: "🩸",
            points: 100,
            condition: JSON.stringify({ type: "ONBOARDING_COMPLETE" }),
          },
        });

        if (!achievement) {
          throw new Error("Failed to create achievement");
        }

        const userAchievement = await tx.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        if (!userAchievement) {
          throw new Error("Failed to assign achievement to user");
        }

        return { success: true };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // 5 seconds max wait
        timeout: 10000, // 10 seconds timeout
      }
    );

    // Only revalidate path if transaction was successful
    revalidatePath(paths.monk.habits);
    return result;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error: "User not found or not properly initialized",
        };
      }
      if (error.code === "P2002") {
        return {
          success: false,
          error: "User settings already exist",
        };
      }
    }
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding",
    };
  }
}
