import { habitGeneratorPrompt } from "./habit-generator";
import { createSystemMessage, streamingJsonCompletion } from "../ai";
import { Message } from "ai";
import type { GeneratedHabitsResponse } from "@/packages/shared/types/habits";
import type { UserContext } from "./user-context";
import type { PreviousHabit } from "./previous-habits";
import type { HabitSuccessRate } from "./habit-success-rate";

export interface GenerateHabitsInput {
  userId: string;
  goals?: string[];
  timeCommitment?: string;
  constraints?: string[];
  userContext?: UserContext;
  previousHabits?: PreviousHabit[];
  successRate?: HabitSuccessRate;
}

export class HabitGeneratorService {
  private createUserMessage(input: GenerateHabitsInput): Message {
    const context = input.userContext
      ? `
Current Level: ${input.userContext.level}
Mental Toughness: ${input.userContext.mentalToughnessScore}/100
Current Streak: ${input.userContext.currentStreak} days
Experience: ${input.userContext.experiencePoints} XP
Mentor: ${input.userContext.mentorPersona}`
      : "";

    const previousHabits = input.previousHabits?.length
      ? `
Previous Habits:
${input.previousHabits
  .map(
    (h) =>
      `- ${h.name} (${h.successRate.toFixed(1)}% success rate, ${
        h.totalDays
      } days, last used: ${h.lastUsed?.toLocaleDateString() || "never"})`
  )
  .join("\n")}`
      : "";

    const successRates = input.successRate
      ? `
Success Rates:
Overall: ${input.successRate.overall.toFixed(1)}%
Streak Quality: ${input.successRate.streakQuality.toFixed(1)}%
By Category: ${Object.entries(input.successRate.byCategory)
          .map(([cat, rate]) => `${cat}: ${rate.toFixed(1)}%`)
          .join(", ")}
By Time Block: ${Object.entries(input.successRate.byTimeBlock)
          .map(([block, rate]) => `${block}: ${rate.toFixed(1)}%`)
          .join(", ")}`
      : "";

    return {
      role: "user",
      content: `Generate a strategic habit system based on:

Goals: ${input.goals?.join(", ") || "Not specified"}
Time Commitment: ${input.timeCommitment || "Not specified"}
Constraints: ${input.constraints?.join(", ") || "None"}
${context}
${previousHabits}
${successRates}

Based on this data, generate a set of habits that:
1. Build on successful patterns from previous habits
2. Address weak areas in time blocks and categories
3. Match the user's current mental toughness level
4. Scale with their available time commitment
5. Account for their constraints

Focus on habits that are:
- Measurable and binary (pass/fail)
- Time-boxed and specific
- Focused on mental toughness
- Realistic to track daily
- Aligned with military precision`,
      id: crypto.randomUUID(),
    };
  }

  private cleanJsonText(text: string): string {
    // Remove markdown code blocks if present
    text = text.replace(/```json\n/g, "");
    text = text.replace(/```\n/g, "");
    text = text.replace(/```/g, "");

    // Remove any leading/trailing whitespace
    text = text.trim();

    return text;
  }

  public async generateHabits(
    input: GenerateHabitsInput
  ): Promise<GeneratedHabitsResponse> {
    try {
      // Create messages for completion
      const messages: Message[] = [
        createSystemMessage(habitGeneratorPrompt),
        this.createUserMessage(input),
      ];

      // Get the streaming response
      const stream = await streamingJsonCompletion(messages);

      // Accumulate the JSON text
      let jsonText = "";
      for await (const chunk of stream) {
        jsonText += chunk;
      }

      // Clean and parse the JSON response
      const cleanedJson = this.cleanJsonText(jsonText);
      const parsed = JSON.parse(cleanedJson) as GeneratedHabitsResponse;

      return parsed;
    } catch (error) {
      console.error("Error generating habits:", error);
      throw error;
    }
  }
}
