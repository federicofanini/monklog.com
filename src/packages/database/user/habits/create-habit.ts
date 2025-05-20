"use server";

import { prisma } from "../../prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
interface CreateHabitInput {
  name: string;
  categoryName: string;
  description?: string;
}

export async function createHabit(input: CreateHabitInput) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(paths.api.login);
  }

  try {
    // Get or create the category
    let category = await prisma.habitCategory.findUnique({
      where: {
        name: input.categoryName,
      },
    });

    if (!category) {
      category = await prisma.habitCategory.create({
        data: {
          name: input.categoryName,
          description: input.description,
        },
      });
    }

    // Get the highest order number
    const highestOrder = await prisma.habit.findFirst({
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    // Create the new habit
    const habit = await prisma.habit.create({
      data: {
        name: input.name.toLowerCase().replace(/\s+/g, "_"), // Convert to snake_case
        categoryId: category.id,
        order: (highestOrder?.order ?? 0) + 1,
      },
      include: {
        category: true,
      },
    });

    return habit;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
}
