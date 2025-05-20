"use server";

import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { startOfDay } from "date-fns";

export async function getUserHabits() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return null;
  }

  const today = startOfDay(new Date());

  try {
    const habits = await prisma.habit.findMany({
      orderBy: [{ category: { name: "asc" } }, { order: "asc" }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        entries: {
          where: {
            log: {
              userId: user.id,
              date: today,
            },
          },
          select: {
            completed: true,
          },
          take: 1,
        },
      },
    });

    return habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      category: {
        id: habit.category.id,
        name: habit.category.name,
      },
      order: habit.order,
      completedToday: habit.entries[0]?.completed ?? false,
    }));
  } catch (error) {
    console.error("Error fetching habits:", error);
    return null;
  }
}

export const toggleHabitCompletion = async (habitId: string) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return {
      error: "unauthorized",
      message: "You must be logged in to perform this action",
    };
  }

  const today = startOfDay(new Date());

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Get or create today's log
      const log = await tx.habitLog.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        create: {
          userId: user.id,
          date: today,
        },
        update: {},
      });

      // Get current entry state
      const existingEntry = await tx.habitEntry.findUnique({
        where: {
          habitLogId_habitId: {
            habitLogId: log.id,
            habitId,
          },
        },
      });

      // Toggle or create entry
      const entry = await tx.habitEntry.upsert({
        where: {
          habitLogId_habitId: {
            habitLogId: log.id,
            habitId,
          },
        },
        create: {
          habitLogId: log.id,
          habitId,
          completed: true,
        },
        update: {
          completed: !existingEntry?.completed,
        },
      });

      return { completed: entry.completed };
    });

    return result;
  } catch (error) {
    console.error("Error in toggleHabitCompletion:", error);
    throw error;
  }
};

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
