"use server";

import { prisma } from "@/packages/database/prisma";
import type { HabitCategory } from "../types";

export async function getCategories(): Promise<HabitCategory[]> {
  const categories = await prisma.habitCategory.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map((cat) => ({
    ...cat,
    created_at:
      typeof cat.created_at === "string"
        ? cat.created_at
        : cat.created_at?.toISOString(),
    updated_at:
      typeof cat.updated_at === "string"
        ? cat.updated_at
        : cat.updated_at?.toISOString(),
    description: cat.description ?? undefined,
  }));
}

export async function createCategory({
  name,
  description,
}: {
  name: string;
  description?: string;
}): Promise<{ category?: HabitCategory; error?: string }> {
  if (!name) return { error: "Name is required" };
  try {
    const category = await prisma.habitCategory.create({
      data: { name, description },
    });
    return {
      category: {
        ...category,
        created_at:
          typeof category.created_at === "string"
            ? category.created_at
            : category.created_at?.toISOString(),
        updated_at:
          typeof category.updated_at === "string"
            ? category.updated_at
            : category.updated_at?.toISOString(),
        description: category.description ?? undefined,
      },
    };
  } catch (error) {
    // @ts-expect-error: Prisma error type
    if (error.code === "P2002") {
      return { error: "Category name must be unique" };
    }
    return {
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Pick<HabitCategory, "name" | "description">>
): Promise<{ category?: HabitCategory; error?: string }> {
  try {
    const category = await prisma.habitCategory.update({
      where: { id },
      data,
    });
    return {
      category: {
        ...category,
        created_at:
          typeof category.created_at === "string"
            ? category.created_at
            : category.created_at?.toISOString(),
        updated_at:
          typeof category.updated_at === "string"
            ? category.updated_at
            : category.updated_at?.toISOString(),
        description: category.description ?? undefined,
      },
    };
  } catch (error) {
    // @ts-expect-error: Prisma error type
    if (error.code === "P2002") {
      return { error: "Category name must be unique" };
    }
    return {
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.habitCategory.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
