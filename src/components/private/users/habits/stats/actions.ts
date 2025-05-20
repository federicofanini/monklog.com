"use server";

import { toggleHabitCompletion } from "@/packages/database/user/habits";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { HabitToggleResponse } from "../types";

export async function handleHabitToggle(
  id: string
): Promise<HabitToggleResponse> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    // Instead of redirecting immediately, return an auth error
    return {
      error: "unauthorized",
      message: "You must be logged in to perform this action",
    };
  }

  try {
    const result = await toggleHabitCompletion(id);
    if (!result || typeof result.completed !== "boolean") {
      throw new Error("Failed to toggle habit");
    }
    return {
      success: true,
      completed: result.completed,
    };
  } catch (error) {
    console.error("Error toggling habit:", error);
    return {
      error: "toggle_failed",
      message: "Failed to toggle habit completion",
    };
  }
}
