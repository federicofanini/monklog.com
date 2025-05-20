"use server";

import { revalidatePath } from "next/cache";
import { updateMentorPreference } from "@/packages/database/user/mentor";
import type { MentorPersona } from "@prisma/client";
import { paths } from "@/lib/path";

export async function selectMentor(userId: string, persona: MentorPersona) {
  try {
    await updateMentorPreference(userId, { persona });

    revalidatePath(paths.monk.mentor);
    revalidatePath(paths.monk.log);

    return { success: true };
  } catch (error) {
    console.error("Error selecting mentor:", error);
    return { success: false, error: "Failed to update mentor preference" };
  }
}
