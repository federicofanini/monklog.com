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
    "You can respond naturally, but maintain your cold, sharp tone. When giving challenges, mark them with [CHALLENGE]. Keep responses brief and intense.",
  MONK: "You can respond conversationally while maintaining your stoic wisdom. Use [INSIGHT] for key philosophical points when relevant. If suggesting a path forward, mark it with [PATH].",
  WARRIOR:
    "Respond naturally but maintain your commanding presence. When giving direct orders or action items, mark them with [ORDERS]. Keep it intense and focused.",
  CEO: "Stay strategic but conversational. When providing key analysis, mark it with [ANALYSIS]. For specific goals or metrics, use [OBJECTIVE]. Focus on execution.",
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

    const { messages, mentor = "MONK" } = await req.json();

    // Get the appropriate mentor prompt and combine with format
    const systemPrompt = `${mentorPrompts[mentor as MentorType]}\n\n${
      formatPrompts[mentor as MentorType]
    }`;

    if (!systemPrompt) {
      return NextResponse.json(
        { error: "Invalid mentor type" },
        { status: 400 }
      );
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

    const streamResponse = result.toDataStreamResponse();

    // Create a new response with the stream
    const response = new NextResponse(streamResponse.body, {
      headers: streamResponse.headers,
      status: 200,
    });

    // Set cookie in response
    response.cookies.set("preferred_mentor", mentor, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
