import { Message } from "ai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Initialize OpenAI configuration
const model = "gpt-4-turbo-preview";

export async function streamingCompletion(messages: Message[]) {
  const { textStream } = streamText({
    model: openai(model),
    messages: messages.map((msg) => ({
      role: msg.role === "data" ? "user" : msg.role,
      content: msg.content,
    })),
    temperature: 0.7,
    maxTokens: 150,
  });

  return textStream;
}

export async function streamingJsonCompletion(messages: Message[]) {
  const { textStream } = streamText({
    model: openai(model),
    messages: [
      ...messages.map((msg) => ({
        role: msg.role === "data" ? "user" : msg.role,
        content: msg.content,
      })),
      {
        role: "system",
        content: "Remember to provide your response in valid JSON format.",
      },
    ],
    temperature: 0.7,
    maxTokens: 1000,
  });

  return textStream;
}

// Helper to create a system message with the mentor's prompt
export function createSystemMessage(mentorPrompt: string): Message {
  return { role: "system", content: mentorPrompt, id: "system" };
}

// Helper to create a user message with the daily log
export function createUserMessage(input: {
  streak: number;
  habits: { name: string; completed: boolean; relapsed: boolean }[];
  reflection?: string;
}): Message {
  const habitsStatus =
    input.habits.length > 0
      ? `Habits:\n${input.habits
          .map(
            (h) =>
              `${h.name}: ${h.completed ? "✅" : "❌"}${
                h.relapsed ? " (RELAPSED)" : ""
              }`
          )
          .join("\n")}`
      : "";

  const content = [
    `Streak: ${input.streak} days`,
    habitsStatus,
    input.reflection ? `Message: ${input.reflection}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    role: "user",
    content,
    id: crypto.randomUUID(),
  };
}
