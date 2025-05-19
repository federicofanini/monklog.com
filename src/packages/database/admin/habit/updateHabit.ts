"use server";

import { prisma } from "@/packages/database/prisma";
import type { Habit } from "../types";

export async function updateHabit(
  id: string,
  data: Partial<Pick<Habit, "name" | "order" | "categoryId">>
): Promise<{ habit?: Habit; error?: string }> {
  try {
    const habit = await prisma.habit.update({
      where: { id },
      data,
      include: { category: true },
    });
    return {
      habit: {
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
              description: habit.category.description ?? undefined,
            }
          : {
              id: "",
              name: "",
              description: undefined,
              created_at: "",
              updated_at: "",
            },
      },
    };
  } catch (error) {
    // @ts-expect-error: Prisma error type
    if (error.code === "P2002") {
      return { error: "Habit name must be unique" };
    }
    return {
      error: error instanceof Error ? error.message : "Failed to update habit",
    };
  }
}
