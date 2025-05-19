"use server";

import { prisma } from "@/packages/database/prisma";
import type { Habit } from "../types";

export async function getHabitById(id: string): Promise<Habit | null> {
  const habit = await prisma.habit.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!habit) return null;
  return {
    ...habit,
    created_at:
      typeof habit.created_at === "string"
        ? habit.created_at
        : habit.created_at?.toISOString(),
    updated_at:
      typeof habit.updated_at === "string"
        ? habit.updated_at
        : habit.updated_at?.toISOString(),
    category: habit.category
      ? {
          ...habit.category,
          created_at:
            typeof habit.category.created_at === "string"
              ? habit.category.created_at
              : habit.category.created_at?.toISOString(),
          updated_at:
            typeof habit.category.updated_at === "string"
              ? habit.category.updated_at
              : habit.category.updated_at?.toISOString(),
        }
      : undefined,
  };
}
