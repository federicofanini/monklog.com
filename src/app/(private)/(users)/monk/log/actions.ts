"use server";

import { revalidatePath } from "next/cache";
import { createDailyLog } from "@/packages/database/user";
import { MentorService } from "@/packages/ai/mentors/mentor-service";
import { getCurrentMentorPersona } from "@/packages/database/user/mentor";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";

export interface LogDayInput {
  reflection: string;
  moodScore: number;
  habitIds: string[];
  relapseIds: string[];
}

export async function logDay(userId: string, input: LogDayInput) {
  try {
    // Create the daily log and get current streak
    const { log, entries } = await createDailyLog(userId, {
      note: input.reflection,
      moodScore: input.moodScore,
      habitIds: input.habitIds,
      relapseIds: input.relapseIds,
    });

    // Get current mentor persona and user data
    const [persona, userData] = await Promise.all([
      getCurrentMentorPersona(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { current_streak: true },
      }),
    ]);

    // Generate mentor response
    const mentorService = new MentorService();
    const response = await mentorService.generateResponse({
      userId,
      habitLogId: log.id,
      streak: userData?.current_streak || 0,
      habits: entries.map(({ entry, habit }) => ({
        name: habit.name,
        completed: entry.completed,
        relapsed: entry.relapsed,
      })),
      reflection: input.reflection,
      persona,
    });

    revalidatePath(paths.monk.log);
    revalidatePath(paths.monk.history);

    return { success: true, response };
  } catch (error) {
    console.error("Error logging day:", error);
    return { success: false, error: "Failed to log day" };
  }
}
