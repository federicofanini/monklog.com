import { habitGeneratorPrompt } from "../habit-generator/habit-generator";
import { createSystemMessage, streamingJsonCompletion } from "../ai";
import { Message } from "ai";

export interface GenerateHabitsInput {
  userId: string;
  goals?: string[];
  timeCommitment?: string;
  constraints?: string[];
}

export interface GeneratedHabit {
  name: string;
  category: string;
  icon: string;
  isRelapsable: boolean;
  order: number;
  timeBlock: string;
  minutes: number;
  criteria: string;
}

export interface GeneratedHabitsResponse {
  habits: GeneratedHabit[];
  explanation: string;
}

export class HabitGeneratorService {
  private createUserMessage(input: GenerateHabitsInput): Message {
    return {
      role: "user",
      content: `Please generate a JSON response with strategic habits based on:
Goals: ${input.goals?.join(", ") || "Not specified"}
Time Commitment: ${input.timeCommitment || "Not specified"}
Constraints: ${input.constraints?.join(", ") || "None"}`,
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

  public async generateHabits(input: GenerateHabitsInput) {
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

      // Return the generated habits
      return parsed;
    } catch (error) {
      console.error("Error generating habits:", error);
      throw error;
    }
  }
}
