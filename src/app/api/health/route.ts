import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/packages/database/prisma";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const healthRecords = await prisma.health.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error("Error fetching health records:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const healthRecord = await prisma.health.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error("Error creating health record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    // Verify ownership
    const existingRecord = await prisma.health.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const healthRecord = await prisma.health.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error("Error updating health record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
