"use server";

import { revalidatePath } from "next/cache";
import {
  updateMentorPreference,
  createMentorResponse,
} from "@/packages/database/user/mentor";
import type { MentorPersona, MentorMessage } from "@prisma/client";
import { paths } from "@/lib/path";
import { MentorService } from "@/packages/ai/mentors/mentor-service";

const mentorService = new MentorService();

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

export type SendMentorMessageResponse =
  | {
      success: true;
      message: MentorMessage;
    }
  | {
      success: false;
      error: string;
    };

export async function sendMentorMessage(
  userId: string,
  message: string,
  persona: MentorPersona
): Promise<SendMentorMessageResponse> {
  try {
    // Generate AI response
    const stream = await mentorService.generateResponse({
      userId,
      habitLogId: null,
      streak: 0,
      habits: [],
      reflection: message,
      persona,
    });

    // Accumulate the streamed response
    let fullResponse = "";
    let challenge = "";
    let isInChallenge = false;

    for await (const chunk of stream) {
      const text = chunk.toString().trim();

      // Skip empty chunks
      if (!text) continue;

      // Check for challenge section
      if (text.toLowerCase().includes("challenge:")) {
        isInChallenge = true;
        challenge = text.split("challenge:")[1].trim();
        continue;
      }

      // Add to appropriate section
      if (isInChallenge) {
        challenge += " " + text;
      } else {
        fullResponse += (fullResponse ? " " : "") + text;
      }
    }

    // Clean up the response
    fullResponse = fullResponse.trim();
    challenge = challenge.trim();

    // Store the response
    const storedMessage = await createMentorResponse(
      userId,
      null,
      fullResponse,
      message,
      challenge || undefined // Use undefined instead of null to match the type
    );

    revalidatePath(paths.monk.mentor);
    return { success: true, message: storedMessage };
  } catch (error) {
    console.error("Error sending mentor message:", error);
    return { success: false, error: "Failed to send message" };
  }
}
