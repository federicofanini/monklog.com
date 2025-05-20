import OpenAI from "openai";
import { Message } from "ai";
import type { ChatCompletionMessageParam } from "openai/resources";

// Initialize OpenAI client once
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function streamingCompletion(messages: Message[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: messages.map((msg) => ({
      role: msg.role === "data" ? "user" : msg.role,
      content: msg.content,
    })) as ChatCompletionMessageParam[],
    temperature: 0.7,
    max_tokens: 150,
    stream: true,
  });

  // Return the streaming response
  return response;
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
  const habitsStatus = input.habits
    .map(
      (h) =>
        `${h.name}: ${h.completed ? "✅" : "❌"}${
          h.relapsed ? " (RELAPSED)" : ""
        }`
    )
    .join("\n");

  return {
    role: "user",
    content: `
Streak: ${input.streak} days
Habits:
${habitsStatus}
${input.reflection ? `\nReflection: ${input.reflection}` : ""}`,
    id: crypto.randomUUID(),
  };
}
