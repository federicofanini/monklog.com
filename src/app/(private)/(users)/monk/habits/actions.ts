"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  HabitGeneratorService,
  type GeneratedHabit,
} from "@/packages/ai/mentors/habit-service";

export async function updateUserHabits(habitIds: string[]) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's log
    const log = await prisma.habitLog.upsert({
      where: {
        userId_date: {
          userId: user?.id || "",
          date: today,
        },
      },
      create: {
        userId: user?.id || "",
        date: today,
      },
      update: {},
    });

    // Delete existing entries
    await prisma.habitEntry.deleteMany({
      where: {
        habitLogId: log.id,
      },
    });

    // Create new entries
    await prisma.habitEntry.createMany({
      data: habitIds.map((habitId) => ({
        habitLogId: log.id,
        habitId,
        completed: false,
        relapsed: false,
      })),
    });

    revalidatePath(paths.monk.log);
    return { success: true };
  } catch (error) {
    console.error("Error updating user habits:", error);
    return { success: false, error: "Failed to update habits" };
  }
}

export interface GenerateHabitsInput {
  goals: string[];
  timeCommitment?: string;
  constraints?: string[];
}

export async function generateHabits(input: GenerateHabitsInput) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const habitGenerator = new HabitGeneratorService();
    const result = await habitGenerator.generateHabits({
      userId: user.id,
      ...input,
    });

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error generating habits:", error);
    return { success: false, error: "Failed to generate habits" };
  }
}

async function ensureCategories(): Promise<Record<string, string>> {
  // Ensure we have the basic categories
  const categories = await Promise.all([
    prisma.habitCategory.upsert({
      where: { name: "Physical" },
      update: {},
      create: {
        name: "Physical",
        description: "Physical health and fitness habits",
      },
    }),
    prisma.habitCategory.upsert({
      where: { name: "Mental" },
      update: {},
      create: {
        name: "Mental",
        description: "Mental clarity and focus habits",
      },
    }),
    prisma.habitCategory.upsert({
      where: { name: "Mission" },
      update: {},
      create: {
        name: "Mission",
        description: "Core mission and purpose habits",
      },
    }),
  ]);

  // Create a map of category name to ID
  return categories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveGeneratedHabits(habits: GeneratedHabit[]) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const categoryMap = await ensureCategories();

    // Create habits in database
    const createdHabits = await Promise.all(
      habits.map((habit, index) =>
        prisma.habit.create({
          data: {
            name: habit.name,
            categoryId: categoryMap[habit.category],
            icon: habit.icon,
            is_relapsable: habit.isRelapsable,
            order: index + 1,
            time_block: habit.timeBlock,
            minutes: habit.minutes,
            criteria: habit.criteria,
          },
        })
      )
    );

    // Update user's habits
    await updateUserHabits(createdHabits.map((h) => h.id));

    revalidatePath(paths.monk.habits);
    return { success: true, habits: createdHabits };
  } catch (error) {
    console.error("Error saving generated habits:", error);
    return { success: false, error: "Failed to save habits" };
  }
}

export async function deleteHabits() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Get today's log
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the user's current habit log
    const currentLog = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      include: {
        entries: {
          include: {
            habit: true,
          },
        },
      },
    });

    if (currentLog) {
      // Get all habit IDs from the current log
      const habitIds = currentLog.entries.map((entry) => entry.habit.id);

      // Delete the habit entries
      await prisma.habitEntry.deleteMany({
        where: {
          habitLogId: currentLog.id,
        },
      });

      // Delete the habits themselves
      await prisma.habit.deleteMany({
        where: {
          id: {
            in: habitIds,
          },
        },
      });

      // Delete the log
      await prisma.habitLog.delete({
        where: {
          id: currentLog.id,
        },
      });
    }

    revalidatePath(paths.monk.habits);
    return { success: true };
  } catch (error) {
    console.error("Error deleting habits:", error);
    return { success: false, error: "Failed to delete habits" };
  }
}
