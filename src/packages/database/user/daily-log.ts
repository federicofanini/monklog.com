import { HOUR } from "@/lib/time";
import { prisma } from "../prisma";
import type { DailyLogInput, DailyLogResponse } from "../../shared/types/types";

export async function createDailyLog(
  userId: string,
  input: DailyLogInput
): Promise<DailyLogResponse> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await prisma.habitLog.create({
      data: {
        userId,
        date: today,
        note: input.note,
        mood_score: input.moodScore,
        entries: {
          create: [
            ...input.habitIds.map((habitId) => ({
              habitId,
              completed: true,
              relapsed: false,
            })),
            ...input.relapseIds.map((habitId) => ({
              habitId,
              completed: false,
              relapsed: true,
            })),
          ],
        },
      },
      include: {
        entries: {
          include: {
            habit: true,
          },
        },
        mentor_response: true,
      },
    });

    // Update user stats
    await prisma.dailyStats.create({
      data: {
        userId,
        date: today,
        habits_completed: input.habitIds.length,
        habits_relapsed: input.relapseIds.length,
        streak_maintained: input.habitIds.length > 0,
        mental_toughness_gained: calculateMentalToughness(input),
      },
    });

    return {
      log,
      entries: log.entries.map((entry) => ({
        entry,
        habit: entry.habit,
      })),
      mentor_response: log.mentor_response,
    };
  } catch (error) {
    console.error("Error creating daily log:", error);
    throw error;
  }
}

export async function getDailyLogs(
  userId: string,
  limit = 7
): Promise<DailyLogResponse[]> {
  try {
    const logs = await prisma.habitLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
      include: {
        entries: {
          include: {
            habit: true,
          },
        },
        mentor_response: true,
      },
      cacheStrategy: { ttl: HOUR },
    });

    return logs.map((log) => ({
      log,
      entries: log.entries.map((entry) => ({
        entry,
        habit: entry.habit,
      })),
      mentor_response: log.mentor_response,
    }));
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    throw error;
  }
}

export async function getTodayLog(
  userId: string
): Promise<DailyLogResponse | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      include: {
        entries: {
          include: {
            habit: true,
          },
        },
        mentor_response: true,
      },
      cacheStrategy: { ttl: 300 }, // 5 minutes cache for today's log
    });

    if (!log) return null;

    return {
      log,
      entries: log.entries.map((entry) => ({
        entry,
        habit: entry.habit,
      })),
      mentor_response: log.mentor_response,
    };
  } catch (error) {
    console.error("Error fetching today's log:", error);
    throw error;
  }
}

// Helper function to calculate mental toughness points
function calculateMentalToughness(input: DailyLogInput): number {
  let points = 0;
  points += input.habitIds.length * 10; // Points for completed habits
  points -= input.relapseIds.length * 5; // Penalty for relapses
  return Math.max(0, points); // Ensure non-negative
}
