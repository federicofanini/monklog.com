"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { Mood } from "@prisma/client";

export type HealthData = {
  water: number;
  steps: number;
  cardio: number;
  daily_light: number;
  daily_strength: number;
  daily_mood: Mood;
  caffeine: number;
  alcohol: number;
  sigarettes: number;
};

export async function addHealthRecord(data: HealthData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const health = await prisma.health.create({
      data: {
        userId: user.id,
        water: data.water,
        steps: data.steps,
        cardio: data.cardio,
        daily_light: data.daily_light,
        daily_strength: data.daily_strength,
        daily_mood: data.daily_mood,
        caffeine: data.caffeine,
        alcohol: data.alcohol,
        sigarettes: data.sigarettes,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/health");
    revalidatePath("/api/health");
    return { success: true, data: health };
  } catch (error) {
    console.error("Error adding health record:", error);
    return { success: false, error: "Failed to add health record" };
  }
}

export async function updateHealthRecord(
  id: string,
  data: Partial<HealthData>
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingHealth = await prisma.health.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingHealth) {
      throw new Error("Health record not found or unauthorized");
    }

    const health = await prisma.health.update({
      where: { id },
      data: {
        water: data.water,
        steps: data.steps,
        cardio: data.cardio,
        daily_light: data.daily_light,
        daily_strength: data.daily_strength,
        daily_mood: data.daily_mood,
        caffeine: data.caffeine,
        alcohol: data.alcohol,
        sigarettes: data.sigarettes,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/health");
    revalidatePath("/api/health");
    return { success: true, data: health };
  } catch (error) {
    console.error("Error updating health record:", error);
    return { success: false, error: "Failed to update health record" };
  }
}

export async function getHealthRecords() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const records = await prisma.health.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching health records:", error);
    return { success: false, error: "Failed to fetch health records" };
  }
}

export async function deleteHealthRecord(id: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingHealth = await prisma.health.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingHealth) {
      throw new Error("Health record not found or unauthorized");
    }

    await prisma.health.delete({
      where: { id },
    });

    // Revalidate both the page and the API route
    revalidatePath("/health");
    revalidatePath("/api/health");
    return { success: true };
  } catch (error) {
    console.error("Error deleting health record:", error);
    return { success: false, error: "Failed to delete health record" };
  }
}
