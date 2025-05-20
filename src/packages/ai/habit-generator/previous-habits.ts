import { prisma } from "@/packages/database/prisma";
import type { Habit } from "@prisma/client";

export interface PreviousHabit extends Habit {
  successRate: number;
  totalDays: number;
  lastUsed: Date | null;
}

export async function getPreviousHabits(
  userId: string
): Promise<PreviousHabit[]> {
  // Get all habit logs for the user
  const logs = await prisma.habitLog.findMany({
    where: { userId },
    include: {
      entries: {
        include: {
          habit: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  // Create a map to track habit statistics
  const habitStats = new Map<
    string,
    {
      habit: Habit;
      completed: number;
      total: number;
      lastUsed: Date | null;
    }
  >();

  // Process each log to build statistics
  logs.forEach((log) => {
    log.entries.forEach((entry) => {
      const stats = habitStats.get(entry.habitId) || {
        habit: entry.habit,
        completed: 0,
        total: 0,
        lastUsed: null,
      };

      stats.total++;
      if (entry.completed) {
        stats.completed++;
      }
      if (!stats.lastUsed || log.date > stats.lastUsed) {
        stats.lastUsed = log.date;
      }

      habitStats.set(entry.habitId, stats);
    });
  });

  // Convert map to array of PreviousHabit objects
  return Array.from(habitStats.values()).map((stats) => ({
    ...stats.habit,
    successRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    totalDays: stats.total,
    lastUsed: stats.lastUsed,
  }));
}
