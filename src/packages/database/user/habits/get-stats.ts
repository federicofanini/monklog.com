"use server";

import { prisma } from "../../prisma";
import { startOfDay, subDays } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function getUserHabitStats() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const userId = user.id;

  try {
    const today = startOfDay(new Date());
    const lastWeek = startOfDay(subDays(today, 7));

    // Get all habit logs for the last week
    const weekLogs = await prisma.habitLog.findMany({
      where: {
        userId,
        date: {
          gte: lastWeek,
        },
      },
      include: {
        entries: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get total habits count
    const totalHabits = await prisma.habit.count();

    // Calculate daily completion rates
    const dailyStats = weekLogs.map((log) => ({
      date: log.date,
      completedCount: log.entries.filter((entry) => entry.completed).length,
      totalCount: totalHabits,
      completionRate:
        (log.entries.filter((entry) => entry.completed).length / totalHabits) *
        100,
    }));

    // Calculate current streak
    let currentStreak = 0;
    for (const log of weekLogs) {
      if (log.entries.some((entry) => entry.completed)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Get top completed habits for the last week
    const topHabits = await prisma.$transaction(async (tx) => {
      // First get all completed entries from the user's logs
      const completedEntries = weekLogs.flatMap((log) =>
        log.entries.filter((entry) => entry.completed)
      );

      // Count completions per habit
      const habitCounts = completedEntries.reduce((acc, entry) => {
        acc[entry.habitId] = (acc[entry.habitId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top 3 habits with their details
      const topHabitIds = Object.entries(habitCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => id);

      return Promise.all(
        topHabitIds.map(async (habitId) => {
          const habit = await tx.habit.findUnique({
            where: { id: habitId },
            include: { category: true },
          });
          return {
            habitName: habit?.name,
            categoryName: habit?.category.name,
            completionCount: habitCounts[habitId],
          };
        })
      );
    });

    return {
      currentStreak,
      dailyStats,
      topHabits,
      totalHabits,
      weeklyCompletionRate:
        dailyStats.reduce((acc, day) => acc + day.completionRate, 0) / 7,
    };
  } catch (error) {
    console.error("Error fetching user habit stats:", error);
    throw error;
  }
}
