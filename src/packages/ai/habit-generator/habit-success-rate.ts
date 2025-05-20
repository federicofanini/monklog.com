import { prisma } from "@/packages/database/prisma";

export interface HabitSuccessRate {
  overall: number;
  byCategory: Record<string, number>;
  byTimeBlock: Record<string, number>;
  streakQuality: number;
}

export async function calculateHabitSuccessRate(
  userId: string
): Promise<HabitSuccessRate> {
  const logs = await prisma.habitLog.findMany({
    where: { userId },
    include: {
      entries: {
        include: {
          habit: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
    take: 30, // Last 30 days
  });

  let totalEntries = 0;
  let completedEntries = 0;
  const categoryStats = new Map<string, { completed: number; total: number }>();
  const timeBlockStats = new Map<
    string,
    { completed: number; total: number }
  >();
  let streakBreaks = 0;

  logs.forEach((log) => {
    let dayCompleted = false;
    let dayTotal = 0;

    log.entries.forEach((entry) => {
      totalEntries++;
      dayTotal++;

      if (entry.completed) {
        completedEntries++;
        dayCompleted = true;
      }

      // Category stats
      const categoryName = entry.habit.category.name;
      const catStats = categoryStats.get(categoryName) || {
        completed: 0,
        total: 0,
      };
      catStats.total++;
      if (entry.completed) catStats.completed++;
      categoryStats.set(categoryName, catStats);

      // Time block stats
      const timeBlock = entry.habit.time_block;
      const timeStats = timeBlockStats.get(timeBlock) || {
        completed: 0,
        total: 0,
      };
      timeStats.total++;
      if (entry.completed) timeStats.completed++;
      timeBlockStats.set(timeBlock, timeStats);
    });

    // Check for streak breaks
    if (dayTotal > 0 && !dayCompleted) {
      streakBreaks++;
    }
  });

  // Calculate success rates
  const overall =
    totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

  const byCategory = Array.from(categoryStats.entries()).reduce(
    (acc, [category, stats]) => {
      acc[category] =
        stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const byTimeBlock = Array.from(timeBlockStats.entries()).reduce(
    (acc, [block, stats]) => {
      acc[block] = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate streak quality (inverse of break frequency)
  const streakQuality =
    logs.length > 0 ? ((logs.length - streakBreaks) / logs.length) * 100 : 0;

  return {
    overall,
    byCategory,
    byTimeBlock,
    streakQuality,
  };
}
