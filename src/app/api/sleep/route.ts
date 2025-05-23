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

    const sleepRecords = await prisma.sleep.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        sleep_start: "desc",
      },
    });

    return NextResponse.json(sleepRecords);
  } catch (error) {
    console.error("Error fetching sleep records:", error);
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
    const sleepRecord = await prisma.sleep.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(sleepRecord);
  } catch (error) {
    console.error("Error creating sleep record:", error);
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
    const existingRecord = await prisma.sleep.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const sleepRecord = await prisma.sleep.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(sleepRecord);
  } catch (error) {
    console.error("Error updating sleep record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
