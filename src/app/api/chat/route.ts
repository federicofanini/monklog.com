import { openai } from "@ai-sdk/openai";
import { streamText, Message } from "ai";
import { NextResponse } from "next/server";
import { ghostPrompt } from "@/packages/ai/mentors/ghost";
import { monkPrompt } from "@/packages/ai/mentors/monk";
import { marinePrompt } from "@/packages/ai/mentors/marine";
import { ceoPrompt } from "@/packages/ai/mentors/ceo";
import type { MentorType } from "@/components/private/chat/mentor-select";

const mentorPrompts: Record<MentorType, string> = {
  GHOST: ghostPrompt,
  MONK: monkPrompt,
  WARRIOR: marinePrompt,
  CEO: ceoPrompt,
};

export const maxDuration = 10; // Allow streaming responses up to 30 seconds

export async function POST(req: Request) {
  try {
    const { messages, mentor = "MONK" } = await req.json();

    // Get the appropriate mentor prompt
    const systemPrompt = mentorPrompts[mentor as MentorType];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: "Invalid mentor type" },
        { status: 400 }
      );
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
