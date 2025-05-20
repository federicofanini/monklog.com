"use server";

import { HOUR } from "@/lib/time";
import { prisma } from "../prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getHabits() {
  try {
    return await prisma.habit.findMany({
      orderBy: { order: "asc" },
      include: {
        category: true,
      },
      cacheStrategy: { ttl: HOUR },
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
}

export async function getHabitCategories() {
  try {
    return await prisma.habitCategory.findMany({
      include: {
        habits: {
          orderBy: { order: "asc" },
        },
      },
      cacheStrategy: { ttl: HOUR },
    });
  } catch (error) {
    console.error("Error fetching habit categories:", error);
    throw error;
  }
}

export async function getUserHabits() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's habits from their most recent log (within last 7 days)
    const recentLog = await prisma.habitLog.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: {
        date: "desc",
      },
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
      cacheStrategy: { ttl: 300 }, // 5 minutes cache
    });

    // If no recent log exists, return empty array
    if (!recentLog) {
      return [];
    }

    // Get today's log if it exists
    const todayLog = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      include: {
        entries: true,
      },
    });

    // Map the habits from recent log and merge with today's status
    return recentLog.entries.map((recentEntry) => {
      const todayEntry = todayLog?.entries.find(
        (e) => e.habitId === recentEntry.habit.id
      );

      return {
        ...recentEntry.habit,
        isTracked: true,
        isCompleted: todayEntry?.completed || false,
        isRelapsed: todayEntry?.relapsed || false,
      };
    });
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw error;
  }
}
