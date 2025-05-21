import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { ghostPrompt } from "@/packages/ai/mentors/ghost";
import { monkPrompt } from "@/packages/ai/mentors/monk";
import { marinePrompt } from "@/packages/ai/mentors/marine";
import { ceoPrompt } from "@/packages/ai/mentors/ceo";
import type { MentorType } from "@/components/private/chat/mentor-select";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { kv } from "@/packages/kv/redis";
import { prisma } from "@/packages/database/prisma";
import { MentorPersona, MessageRole } from "@prisma/client";

interface AIMessage {
  role: string;
  content: string;
}

const mentorPrompts: Record<MentorType, string> = {
  GHOST: ghostPrompt,
  MONK: monkPrompt,
  WARRIOR: marinePrompt,
  CEO: ceoPrompt,
};

// Enhanced system prompts to ensure consistent formatting
const formatPrompts: Record<MentorType, string> = {
  GHOST:
    "Respond in this exact format:\n[TRUTH]\nYour sharp, direct message\n\n[CHALLENGE]\nOne clear challenge",
  MONK: "Respond in this exact format:\n[INSIGHT]\nYour philosophical insight\n\n[PATH]\nThe way forward",
  WARRIOR:
    "Respond in this exact format:\n[ASSESSMENT]\nYour direct evaluation\n\n[ORDERS]\nSpecific instructions",
  CEO: "Respond in this exact format:\n[ANALYSIS]\nYour strategic assessment\n\n[OBJECTIVE]\nNext measurable goal",
};

export const maxDuration = 10; // Allow streaming responses up to 30 seconds

// Map frontend mentor types to schema enum
const mentorTypeToPersona: Record<MentorType, MentorPersona> = {
  GHOST: MentorPersona.GHOST,
  MONK: MentorPersona.MONK,
  WARRIOR: MentorPersona.WARRIOR,
  CEO: MentorPersona.SHADOW,
};

export async function POST(req: Request) {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's paid status from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { paid: true },
    });

    const isPaid = dbUser?.paid || false;
    const isAllowed = await kv.isUserAllowedToChat(user.id, isPaid);

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Daily message limit reached. Upgrade to continue chatting." },
        { status: 429 }
      );
    }

    const { messages, mentor = "MONK" } = await req.json();

    // Get the appropriate mentor prompt
    const systemPrompt = `${mentorPrompts[mentor as MentorType]}\n\n${
      formatPrompts[mentor as MentorType]
    }`;
    if (!systemPrompt) {
      return NextResponse.json(
        { error: "Invalid mentor type" },
        { status: 400 }
      );
    }

    // Increment usage before processing the message
    if (!isPaid) {
      await kv.incrementChatUsage(user.id);
    }

    // First ensure the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      // Create the user if they don't exist
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || "",
          full_name: user.given_name || "Anonymous",
        },
      });
    }

    // Store the user's message
    const userMessage = messages[messages.length - 1];
    if (userMessage && userMessage.role === "user") {
      await prisma.mentorMessage.create({
        data: {
          userId: user.id,
          message: userMessage.content,
          role: MessageRole.user,
          mentor_type: mentorTypeToPersona[mentor as MentorType],
        },
      });
    }

    // Get AI response
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: AIMessage) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      maxTokens: 500,
      onFinish: async (completion) => {
        try {
          // Get the final response from the completion
          const lastStep = completion.steps[completion.steps.length - 1];
          const response = lastStep?.text;

          if (typeof response !== "string") {
            console.error("Invalid response format from AI");
            return;
          }

          // Store the AI response
          await prisma.mentorMessage.create({
            data: {
              userId: user.id,
              message: response,
              role: MessageRole.assistant,
              mentor_type: mentorTypeToPersona[mentor as MentorType],
            },
          });
        } catch (error) {
          console.error("Failed to save chat message:", error);
        }
      },
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
