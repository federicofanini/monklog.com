"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export type SleepData = {
  sleep_start: Date;
  sleep_end: Date;
  sleep_score: number;
  rem_sleep: number;
  deep_sleep: number;
  time_in_bed: number;
  time_to_sleep: number;
};

export async function addSleepRecord(data: SleepData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const sleep = await prisma.sleep.create({
      data: {
        userId: user.id,
        sleep_start: data.sleep_start,
        sleep_end: data.sleep_end,
        sleep_score: data.sleep_score,
        rem_sleep: data.rem_sleep,
        deep_sleep: data.deep_sleep,
        time_in_bed: data.time_in_bed,
        time_to_sleep: data.time_to_sleep,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/log");
    revalidatePath("/api/sleep");
    return { success: true, data: sleep };
  } catch (error) {
    console.error("Error adding sleep record:", error);
    return { success: false, error: "Failed to add sleep record" };
  }
}

export async function updateSleepRecord(id: string, data: Partial<SleepData>) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingSleep = await prisma.sleep.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingSleep) {
      throw new Error("Sleep record not found or unauthorized");
    }

    const sleep = await prisma.sleep.update({
      where: { id },
      data: {
        sleep_start: data.sleep_start,
        sleep_end: data.sleep_end,
        sleep_score: data.sleep_score,
        rem_sleep: data.rem_sleep,
        deep_sleep: data.deep_sleep,
        time_in_bed: data.time_in_bed,
        time_to_sleep: data.time_to_sleep,
      },
    });

    // Revalidate both the page and the API route
    revalidatePath("/log");
    revalidatePath("/api/sleep");
    return { success: true, data: sleep };
  } catch (error) {
    console.error("Error updating sleep record:", error);
    return { success: false, error: "Failed to update sleep record" };
  }
}

export async function getSleepRecords() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    const records = await prisma.sleep.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        sleep_start: "desc",
      },
    });

    return { success: true, data: records };
  } catch (error) {
    console.error("Error fetching sleep records:", error);
    return { success: false, error: "Failed to fetch sleep records" };
  }
}

export async function deleteSleepRecord(id: string) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      throw new Error("Unauthorized: User not found");
    }

    // Verify ownership
    const existingSleep = await prisma.sleep.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingSleep) {
      throw new Error("Sleep record not found or unauthorized");
    }

    await prisma.sleep.delete({
      where: { id },
    });

    // Revalidate both the page and the API route
    revalidatePath("/log");
    revalidatePath("/api/sleep");
    return { success: true };
  } catch (error) {
    console.error("Error deleting sleep record:", error);
    return { success: false, error: "Failed to delete sleep record" };
  }
}
