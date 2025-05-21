import { prisma } from "@/packages/database/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete all messages for this user
    await prisma.mentorMessage.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return new NextResponse("Messages cleared", { status: 200 });
  } catch (error) {
    console.error("Failed to clear messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
