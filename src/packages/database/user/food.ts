"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export type FoodData = {
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  food_quality: number;
};

export async function addFoodRecord(data: FoodData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const food = await prisma.food.create({
      data: {
        userId: user.id,
        carbs: data.carbs,
        protein: data.protein,
        fat: data.fat,
        calories: data.calories,
        food_quality: data.food_quality,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/food");
    revalidatePath("/api/food");
    return { success: true, data: food };
  } catch (error) {
    console.error("Error adding food record:", error);
    return { success: false, error: "Failed to add food record" };
  }
}

export async function updateFoodRecord(id: string, data: Partial<FoodData>) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingFood = await prisma.food.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingFood) {
      throw new Error("Food record not found or unauthorized");
    }

    const food = await prisma.food.update({
      where: { id },
      data: {
        carbs: data.carbs,
        protein: data.protein,
        fat: data.fat,
        calories: data.calories,
        food_quality: data.food_quality,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/food");
    revalidatePath("/api/food");
    return { success: true, data: food };
  } catch (error) {
    console.error("Error updating food record:", error);
    return { success: false, error: "Failed to update food record" };
  }
}

export async function getFoodRecords() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const records = await prisma.food.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching food records:", error);
    return { success: false, error: "Failed to fetch food records" };
  }
}

export async function deleteFoodRecord(id: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingFood = await prisma.food.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingFood) {
      throw new Error("Food record not found or unauthorized");
    }

    await prisma.food.delete({
      where: { id },
    });

    // Revalidate both the page and the API route
    revalidatePath("/food");
    revalidatePath("/api/food");
    return { success: true };
  } catch (error) {
    console.error("Error deleting food record:", error);
    return { success: false, error: "Failed to delete food record" };
  }
}

export async function getFoodRecordById(id: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const food = await prisma.food.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!food) {
      throw new Error("Food record not found or unauthorized");
    }

    return { success: true, data: food };
  } catch (error) {
    console.error("Error fetching food record:", error);
    return { success: false, error: "Failed to fetch food record" };
  }
}
