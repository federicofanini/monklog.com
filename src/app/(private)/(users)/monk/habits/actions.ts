"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";

export async function updateUserHabits(userId: string, habitIds: string[]) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's log
    const log = await prisma.habitLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
      },
      update: {},
    });

    // Delete existing entries
    await prisma.habitEntry.deleteMany({
      where: {
        habitLogId: log.id,
      },
    });

    // Create new entries
    await prisma.habitEntry.createMany({
      data: habitIds.map((habitId) => ({
        habitLogId: log.id,
        habitId,
        completed: false,
        relapsed: false,
      })),
    });

    revalidatePath(paths.monk.log);
    return { success: true };
  } catch (error) {
    console.error("Error updating user habits:", error);
    return { success: false, error: "Failed to update habits" };
  }
}
