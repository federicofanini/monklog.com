"use server";

import { prisma } from "../../prisma";
import { startOfDay } from "date-fns";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function toggleHabitCompletion(habitId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const userId = user.id;

  try {
    const today = startOfDay(new Date());

    // Get or create today's log
    let todayLog = await prisma.habitLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      include: {
        entries: {
          where: {
            habitId,
          },
        },
      },
    });

    if (!todayLog) {
      todayLog = await prisma.habitLog.create({
        data: {
          userId,
          date: today,
        },
        include: {
          entries: {
            where: {
              habitId,
            },
          },
        },
      });
    }

    // Toggle the habit entry
    const existingEntry = todayLog.entries[0];

    if (existingEntry) {
      // Update existing entry
      await prisma.habitEntry.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          completed: !existingEntry.completed,
        },
      });

      return { completed: !existingEntry.completed };
    } else {
      // Create new entry
      const newEntry = await prisma.habitEntry.create({
        data: {
          habitLogId: todayLog.id,
          habitId,
          completed: true,
        },
      });

      return { completed: newEntry.completed };
    }
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw error;
  }
}
