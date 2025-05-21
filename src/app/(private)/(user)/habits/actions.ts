"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { HabitGeneratorService } from "@/packages/ai/habit-generator";
import type { GeneratedHabit } from "@/packages/shared/types/habits";

export interface GenerateHabitsInput {
  goals: string[];
  timeCommitment?: string;
  constraints?: string[];
}

export async function generateHabits(input: GenerateHabitsInput) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return { success: false, error: "User not authenticated" } as const;
  }

  try {
    const habitGenerator = new HabitGeneratorService();
    const result = await habitGenerator.generateHabits({
      userId: user.id,
      ...input,
    });

    return {
      success: true,
      habits: result.habits,
      explanation: result.explanation,
    } as const;
  } catch (error) {
    console.error("Error generating habits:", error);
    return { success: false, error: "Failed to generate habits" } as const;
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

    // Create today's log and entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.habitLog.create({
      data: {
        userId: user.id,
        date: today,
        entries: {
          create: createdHabits.map((habit) => ({
            habitId: habit.id,
            completed: false,
            relapsed: false,
          })),
        },
      },
    });

    revalidatePath(paths.users.habits);
    return { success: true, habits: createdHabits, log };
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

    // Delete all user's habit logs and entries
    await prisma.habitLog.deleteMany({
      where: { userId: user.id },
    });

    revalidatePath(paths.users.habits);
    return { success: true };
  } catch (error) {
    console.error("Error deleting habits:", error);
    return { success: false, error: "Failed to delete habits" };
  }
}
