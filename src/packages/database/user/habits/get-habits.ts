"use server";

import { prisma } from "../../prisma";
import { startOfDay } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
export async function getUserHabits() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(paths.api.login);
  }

  const userId = user.id;

  try {
    // Get all habits with their categories
    const habits = await prisma.habit.findMany({
      include: {
        category: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Get today's habit log for the user
    const today = new Date();
    const todayLog = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDay(today),
        },
      },
      include: {
        entries: true,
      },
    });

    // Map habits with their completion status
    return habits.map((habit) => ({
      ...habit,
      completedToday:
        todayLog?.entries.some(
          (entry) => entry.habitId === habit.id && entry.completed
        ) || false,
    }));
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw error;
  }
}

// Get habit completion stats for a user
export async function getHabitStats(habitId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const userId = user.id;

  try {
    const lastWeekLogs = await prisma.habitLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        },
        entries: {
          some: {
            habitId,
          },
        },
      },
      include: {
        entries: {
          where: {
            habitId,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calculate streak
    let streak = 0;
    for (const log of lastWeekLogs) {
      if (log.entries[0]?.completed) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate week progress
    const weekProgress =
      (lastWeekLogs.filter((log) => log.entries[0]?.completed).length / 7) *
      100;

    return {
      streak,
      weekProgress: Math.round(weekProgress),
    };
  } catch (error) {
    console.error("Error fetching habit stats:", error);
    throw error;
  }
}
