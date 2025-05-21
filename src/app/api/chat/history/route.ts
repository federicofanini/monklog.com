import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/packages/database/prisma";

export async function GET() {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch chat history for the user
    const chatHistory = await prisma.mentorMessage.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        created_at: "asc", // Order by creation time ascending to maintain conversation flow
      },
      take: 50, // Limit to last 50 messages
      select: {
        id: true,
        message: true,
        role: true,
        mentor_type: true,
        created_at: true,
      },
    });

    // Transform the messages into the format expected by the chat UI
    const formattedHistory = chatHistory.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.message,
      mentor: msg.mentor_type,
      createdAt: msg.created_at,
    }));

    return NextResponse.json({ messages: formattedHistory });
  } catch (error) {
    console.error("Chat history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
