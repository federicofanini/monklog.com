import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/packages/database/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify ownership
    const existingRecord = await prisma.food.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.food.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting food record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
