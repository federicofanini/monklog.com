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

    // Get user's paid status from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { paid: true },
    });

    return NextResponse.json({ paid: dbUser?.paid || false });
  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json(
      { error: "Failed to get user status" },
      { status: 500 }
    );
  }
}
