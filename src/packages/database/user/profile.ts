"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma";
import { Mood } from "@prisma/client";

export type LogStats = {
  total_count: number;
  last_log: Date | null;
  streak_days: number;
};

export type ProfileStats = {
  logs: {
    food: LogStats;
    health: LogStats;
    sleep: LogStats;
  };
  health_summary: {
    avg_steps: number;
    total_cardio_minutes: number;
    total_strength_minutes: number;
    most_common_mood: Mood;
    total_water_ml: number;
  };
  sleep_summary: {
    avg_sleep_score: number;
    avg_sleep_duration: number;
    total_sleep_hours: number;
  };
  nutrition_summary: {
    avg_food_quality: number;
    total_calories: number;
    avg_macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
};

export type AggregatedStats = {
  total_days_logged: number;
  completion_rate: number;
  health_trends: {
    mood_distribution: Record<Mood, number>;
    avg_daily_steps: number;
    avg_daily_water: number;
    total_exercise_minutes: number;
    exercise_distribution: {
      cardio: number;
      strength: number;
    };
  };
  sleep_trends: {
    avg_weekly_score: number;
    avg_weekly_duration: number;
    best_sleep_day: string;
    worst_sleep_day: string;
  };
  nutrition_trends: {
    avg_weekly_calories: number;
    avg_weekly_quality: number;
    macro_distribution: {
      protein_percentage: number;
      carbs_percentage: number;
      fat_percentage: number;
    };
  };
};

export type DailyAggregation = {
  date: string;
  health: {
    mood: Mood | null;
    steps: number;
    water_ml: number;
    cardio_minutes: number;
    strength_minutes: number;
  };
  sleep: {
    score: number;
    duration_minutes: number;
  };
  nutrition: {
    calories: number;
    food_quality: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

// Helper function to calculate streak days
async function calculateStreakDays(dates: Date[]) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("Unauthorized: User not found");
  }

  if (dates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = dates
    .map((date) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  // Get the most recent date
  const mostRecent = sortedDates[0];
  const today = new Date();

  // If the most recent log is older than yesterday, streak is broken
  if (mostRecent.getDate() < today.getDate() - 1) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const previousDate = sortedDates[i - 1];

    // Check if dates are consecutive
    const diffTime = previousDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function getProfileStats(
  timeframe: number = 30
): Promise<ProfileStats | null> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized: User not found");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);

    // Fetch all logs in parallel for efficiency
    const [foodLogs, healthLogs, sleepLogs] = await Promise.all([
      prisma.food.findMany({
        where: {
          userId: user.id,
          created_at: { gte: startDate },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.health.findMany({
        where: {
          userId: user.id,
          created_at: { gte: startDate },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.sleep.findMany({
        where: {
          userId: user.id,
          created_at: { gte: startDate },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    // Calculate streaks in parallel
    const [foodStreak, healthStreak, sleepStreak] = await Promise.all([
      calculateStreakDays(foodLogs.map((log) => log.created_at)),
      calculateStreakDays(healthLogs.map((log) => log.created_at)),
      calculateStreakDays(sleepLogs.map((log) => log.created_at)),
    ]);

    // Calculate health summary
    const moodCounts = healthLogs.reduce((acc, log) => {
      acc[log.daily_mood] = (acc[log.daily_mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const mostCommonMood = Object.entries(moodCounts).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["OK", 0]
    )[0] as Mood;

    // Aggregate statistics
    const stats: ProfileStats = {
      logs: {
        food: {
          total_count: foodLogs.length,
          last_log: foodLogs[0]?.created_at || null,
          streak_days: foodStreak,
        },
        health: {
          total_count: healthLogs.length,
          last_log: healthLogs[0]?.created_at || null,
          streak_days: healthStreak,
        },
        sleep: {
          total_count: sleepLogs.length,
          last_log: sleepLogs[0]?.created_at || null,
          streak_days: sleepStreak,
        },
      },
      health_summary: {
        avg_steps: Math.round(
          healthLogs.reduce((sum, log) => sum + log.steps, 0) /
            healthLogs.length || 0
        ),
        total_cardio_minutes: healthLogs.reduce(
          (sum, log) => sum + log.cardio,
          0
        ),
        total_strength_minutes: healthLogs.reduce(
          (sum, log) => sum + log.daily_strength,
          0
        ),
        most_common_mood: mostCommonMood,
        total_water_ml: healthLogs.reduce((sum, log) => sum + log.water, 0),
      },
      sleep_summary: {
        avg_sleep_score: Math.round(
          sleepLogs.reduce((sum, log) => sum + log.sleep_score, 0) /
            sleepLogs.length || 0
        ),
        avg_sleep_duration: Math.round(
          sleepLogs.reduce((sum, log) => sum + log.time_in_bed, 0) /
            sleepLogs.length || 0
        ),
        total_sleep_hours: Math.round(
          sleepLogs.reduce((sum, log) => sum + log.time_in_bed, 0) / 60
        ),
      },
      nutrition_summary: {
        avg_food_quality: Math.round(
          foodLogs.reduce((sum, log) => sum + log.food_quality, 0) /
            foodLogs.length || 0
        ),
        total_calories: foodLogs.reduce((sum, log) => sum + log.calories, 0),
        avg_macros: {
          protein: Math.round(
            foodLogs.reduce((sum, log) => sum + log.protein, 0) /
              foodLogs.length || 0
          ),
          carbs: Math.round(
            foodLogs.reduce((sum, log) => sum + log.carbs, 0) /
              foodLogs.length || 0
          ),
          fat: Math.round(
            foodLogs.reduce((sum, log) => sum + log.fat, 0) / foodLogs.length ||
              0
          ),
        },
      },
    };

    return stats;
  } catch (error) {
    console.error("Error fetching profile stats:", error);
    return null;
  }
}

export async function getRecentActivity(limit: number = 10) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Fetch recent activities of each type in parallel
    const [recentFood, recentHealth, recentSleep] = await Promise.all([
      prisma.food.findMany({
        where: { userId: user.id },
        orderBy: { created_at: "desc" },
        take: limit,
        select: {
          id: true,
          created_at: true,
          food_quality: true,
          calories: true,
        },
      }),
      prisma.health.findMany({
        where: { userId: user.id },
        orderBy: { created_at: "desc" },
        take: limit,
        select: {
          id: true,
          created_at: true,
          daily_mood: true,
          steps: true,
        },
      }),
      prisma.sleep.findMany({
        where: { userId: user.id },
        orderBy: { created_at: "desc" },
        take: limit,
        select: {
          id: true,
          created_at: true,
          sleep_score: true,
          time_in_bed: true,
        },
      }),
    ]);

    // Combine and sort all activities
    const allActivities = [
      ...recentFood.map((f) => ({ ...f, type: "food" as const })),
      ...recentHealth.map((h) => ({ ...h, type: "health" as const })),
      ...recentSleep.map((s) => ({ ...s, type: "sleep" as const })),
    ]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);

    return { success: true, data: allActivities };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return { success: false, error: "Failed to fetch recent activity" };
  }
}

export async function getAggregatedStats(
  timeframe: number = 30
): Promise<AggregatedStats | null> {
  try {
    const stats = await getProfileStats(timeframe);
    if (!stats) return null;

    const totalDays = timeframe;
    const daysWithAnyLog = Math.max(
      stats.logs.food.total_count,
      stats.logs.health.total_count,
      stats.logs.sleep.total_count
    );

    // Create mood distribution record
    const moodDistribution: Record<Mood, number> = {
      GREAT: 0,
      GOOD: 0,
      OK: 0,
      BAD: 0,
      HORRIBLE: 0,
    };
    moodDistribution[stats.health_summary.most_common_mood] =
      stats.logs.health.total_count;

    return {
      total_days_logged: daysWithAnyLog,
      completion_rate: (daysWithAnyLog / totalDays) * 100,
      health_trends: {
        mood_distribution: moodDistribution,
        avg_daily_steps: stats.health_summary.avg_steps,
        avg_daily_water: stats.health_summary.total_water_ml / daysWithAnyLog,
        total_exercise_minutes:
          stats.health_summary.total_cardio_minutes +
          stats.health_summary.total_strength_minutes,
        exercise_distribution: {
          cardio: stats.health_summary.total_cardio_minutes,
          strength: stats.health_summary.total_strength_minutes,
        },
      },
      sleep_trends: {
        avg_weekly_score: stats.sleep_summary.avg_sleep_score,
        avg_weekly_duration: stats.sleep_summary.avg_sleep_duration,
        best_sleep_day: "Monday", // This would need actual calculation based on data
        worst_sleep_day: "Sunday", // This would need actual calculation based on data
      },
      nutrition_trends: {
        avg_weekly_calories:
          stats.nutrition_summary.total_calories / (daysWithAnyLog / 7),
        avg_weekly_quality: stats.nutrition_summary.avg_food_quality,
        macro_distribution: {
          protein_percentage:
            ((stats.nutrition_summary.avg_macros.protein * 4) /
              stats.nutrition_summary.total_calories) *
            100,
          carbs_percentage:
            ((stats.nutrition_summary.avg_macros.carbs * 4) /
              stats.nutrition_summary.total_calories) *
            100,
          fat_percentage:
            ((stats.nutrition_summary.avg_macros.fat * 9) /
              stats.nutrition_summary.total_calories) *
            100,
        },
      },
    };
  } catch (error) {
    console.error("Error getting aggregated stats:", error);
    return null;
  }
}

export async function getDailyAggregation(
  date?: Date
): Promise<DailyAggregation[]> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      throw new Error("Unauthorized: User not found");
    }

    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all logs for the specified date
    const [healthLog, sleepLog, foodLog] = await Promise.all([
      prisma.health.findFirst({
        where: {
          userId: user.id,
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      prisma.sleep.findFirst({
        where: {
          userId: user.id,
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      prisma.food.findFirst({
        where: {
          userId: user.id,
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ]);

    return [
      {
        date: targetDate.toISOString().split("T")[0],
        health: {
          mood: healthLog?.daily_mood || null,
          steps: healthLog?.steps || 0,
          water_ml: healthLog?.water || 0,
          cardio_minutes: healthLog?.cardio || 0,
          strength_minutes: healthLog?.daily_strength || 0,
        },
        sleep: {
          score: sleepLog?.sleep_score || 0,
          duration_minutes: sleepLog?.time_in_bed || 0,
        },
        nutrition: {
          calories: foodLog?.calories || 0,
          food_quality: foodLog?.food_quality || 0,
          protein: foodLog?.protein || 0,
          carbs: foodLog?.carbs || 0,
          fat: foodLog?.fat || 0,
        },
      },
    ];
  } catch (error) {
    console.error("Error getting daily aggregation:", error);
    throw error;
  }
}
