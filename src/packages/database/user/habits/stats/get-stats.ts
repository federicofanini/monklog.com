"use server";

import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { startOfWeek, endOfWeek } from "date-fns";
import type { HabitStats } from "@/components/private/users/habits/stats/type";

export async function getUserHabitStats(): Promise<HabitStats> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(paths.api.login);
  }

  try {
    // Get the start and end of the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    // Get total habits count
    const totalHabits = await prisma.habit.count();

    // Get habit completions for the current week
    const weeklyLogs = await prisma.habitLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        entries: {
          where: {
            completed: true,
          },
        },
      },
    });

    // Calculate total completed habits for the week
    const weeklyCompletions = weeklyLogs.reduce(
      (total, log) => total + log.entries.length,
      0
    );

    // Calculate weekly completion rate
    const possibleCompletions = totalHabits * 7; // Total possible completions in a week
    const weeklyCompletionRate =
      possibleCompletions > 0
        ? (weeklyCompletions / possibleCompletions) * 100
        : 0;

    // Get current streak from user stats
    const userStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        current_streak: true,
      },
    });

    return {
      weeklyCompletionRate: Math.round(weeklyCompletionRate),
      currentStreak: userStats?.current_streak ?? 0,
      totalHabits,
    };
  } catch (error) {
    console.error("Error fetching user habit stats:", error);
    throw error;
  }
}
