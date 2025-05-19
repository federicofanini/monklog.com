"use server";

import { prisma } from "@/packages/database/prisma";

export async function deleteHabit(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.habit.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete habit",
    };
  }
}
