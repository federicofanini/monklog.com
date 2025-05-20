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

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLog = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId: user?.id || "",
          date: today,
        },
      },
      include: {
        entries: {
          include: {
            habit: true,
          },
        },
      },
      cacheStrategy: { ttl: 300 }, // 5 minutes cache
    });

    const allHabits = await getHabits();

    return allHabits.map((habit) => {
      const entry = todayLog?.entries.find((e) => e.habitId === habit.id);
      return {
        ...habit,
        isTracked: !!entry,
        isCompleted: entry?.completed || false,
        isRelapsed: entry?.relapsed || false,
      };
    });
  } catch (error) {
    console.error("Error fetching user habits:", error);
    throw error;
  }
}
