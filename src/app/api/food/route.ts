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

    const foodRecords = await prisma.food.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(foodRecords);
  } catch (error) {
    console.error("Error fetching food records:", error);
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
    const foodRecord = await prisma.food.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(foodRecord);
  } catch (error) {
    console.error("Error creating food record:", error);
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
    const existingRecord = await prisma.food.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingRecord) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const foodRecord = await prisma.food.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(foodRecord);
  } catch (error) {
    console.error("Error updating food record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
