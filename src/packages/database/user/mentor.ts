"use server";

import { HOUR } from "@/lib/time";
import { prisma } from "../prisma";
import { MentorPersona } from "@prisma/client";
import { MentorPreferenceInput } from "../../shared/types/types";

export async function updateMentorPreference(
  userId: string,
  input: MentorPreferenceInput
) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        current_mentor_persona: input.persona,
      },
    });
  } catch (error) {
    console.error("Error updating mentor preference:", error);
    throw error;
  }
}

export async function getMentorMessages(userId: string, limit = 5) {
  try {
    return await prisma.mentorMessage.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
      take: limit,
      cacheStrategy: { ttl: HOUR },
    });
  } catch (error) {
    console.error("Error fetching mentor messages:", error);
    throw error;
  }
}

export async function createMentorResponse(
  userId: string,
  habitLogId: string | null | undefined,
  message: string,
  reflection?: string,
  challenge?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { current_mentor_persona: true },
      cacheStrategy: { ttl: HOUR },
    });

    if (!user) throw new Error("User not found");

    return await prisma.mentorMessage.create({
      data: {
        userId,
        habitLogId: habitLogId || undefined,
        persona: user.current_mentor_persona,
        message,
        reflection,
        challenge,
      },
    });
  } catch (error) {
    console.error("Error creating mentor response:", error);
    throw error;
  }
}

export async function getCurrentMentorPersona(
  userId: string
): Promise<MentorPersona> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { current_mentor_persona: true },
      cacheStrategy: { ttl: HOUR },
    });

    if (!user) throw new Error("User not found");
    return user.current_mentor_persona;
  } catch (error) {
    console.error("Error fetching current mentor persona:", error);
    throw error;
  }
}
