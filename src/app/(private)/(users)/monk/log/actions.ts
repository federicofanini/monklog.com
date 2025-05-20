"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/packages/database/prisma";
import { MentorService } from "@/packages/ai/mentors/mentor-service";
import { getCurrentMentorPersona } from "@/packages/database/user/mentor";
import { paths } from "@/lib/path";
import type { Habit } from "@prisma/client";
import {
  HabitGeneratorService,
  getUserContext,
  getPreviousHabits,
  calculateHabitSuccessRate,
  type GenerateHabitsInput,
} from "@/packages/ai/habit-generator";

export interface LogDayInput {
  reflection: string;
  moodScore: number;
  completedHabitIds: string[];
  relapsedHabitIds: string[];
}

export async function logDay(userId: string, input: LogDayInput) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create or update today's log
    const log = await prisma.habitLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
        note: input.reflection,
        mood_score: input.moodScore,
      },
      update: {
        note: input.reflection,
        mood_score: input.moodScore,
      },
    });

    // Get all user's habits
    const habits = await prisma.habit.findMany({
      where: {
        id: {
          in: [...input.completedHabitIds, ...input.relapsedHabitIds],
        },
      },
    });

    // Delete existing entries if any
    await prisma.habitEntry.deleteMany({
      where: {
        habitLogId: log.id,
      },
    });

    // Create habit entries
    await prisma.habitEntry.createMany({
      data: habits.map((habit) => ({
        habitLogId: log.id,
        habitId: habit.id,
        completed: input.completedHabitIds.includes(habit.id),
        relapsed: input.relapsedHabitIds.includes(habit.id),
      })),
    });

    // Update user stats
    const stats = await prisma.dailyStats.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
        habits_completed: input.completedHabitIds.length,
        habits_relapsed: input.relapsedHabitIds.length,
        experience_gained: input.completedHabitIds.length * 10,
        mental_toughness_gained: calculateMentalToughness(input, habits),
        streak_maintained:
          input.completedHabitIds.length > 0 &&
          input.relapsedHabitIds.length === 0,
      },
      update: {
        habits_completed: input.completedHabitIds.length,
        habits_relapsed: input.relapsedHabitIds.length,
        experience_gained: input.completedHabitIds.length * 10,
        mental_toughness_gained: calculateMentalToughness(input, habits),
        streak_maintained:
          input.completedHabitIds.length > 0 &&
          input.relapsedHabitIds.length === 0,
      },
    });

    // Update user's streak and mental toughness
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { current_streak: true, mental_toughness_score: true },
    });

    if (userData) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          current_streak: stats.streak_maintained
            ? userData.current_streak + 1
            : 0,
          mental_toughness_score: Math.min(
            100,
            userData.mental_toughness_score + stats.mental_toughness_gained
          ),
        },
      });
    }

    // Get current mentor persona and generate response
    const persona = await getCurrentMentorPersona(userId);
    const mentorService = new MentorService();
    const response = await mentorService.generateResponse({
      userId,
      habitLogId: log.id,
      streak: userData?.current_streak || 0,
      habits: habits.map((habit) => ({
        name: habit.name,
        completed: input.completedHabitIds.includes(habit.id),
        relapsed: input.relapsedHabitIds.includes(habit.id),
      })),
      reflection: input.reflection,
      persona,
    });

    revalidatePath(paths.monk.log);
    revalidatePath(paths.monk.history);
    revalidatePath(paths.monk.habits);

    return { success: true, response };
  } catch (error) {
    console.error("Error logging day:", error);
    return { success: false, error: "Failed to log day" };
  }
}

function calculateMentalToughness(input: LogDayInput, habits: Habit[]): number {
  let points = 0;

  // Base points for completed habits
  points += input.completedHabitIds.length * 10;

  // Extra points for completing time-sensitive habits
  const morningHabits = habits.filter(
    (h) => h.time_block === "morning" && input.completedHabitIds.includes(h.id)
  );
  points += morningHabits.length * 5;

  // Penalty for relapses
  points -= input.relapsedHabitIds.length * 15;

  // Bonus for completing all habits
  if (input.completedHabitIds.length === habits.length) {
    points += 20;
  }

  return Math.max(0, points);
}

export async function generateHabits(input: GenerateHabitsInput) {
  const habitGenerator = new HabitGeneratorService();

  // Add user context
  const userContext = await getUserContext(input.userId);

  // Generate habits based on user's history and preferences
  const result = await habitGenerator.generateHabits({
    ...input,
    userContext,
    previousHabits: await getPreviousHabits(input.userId),
    successRate: await calculateHabitSuccessRate(input.userId),
  });

  return result;
}
