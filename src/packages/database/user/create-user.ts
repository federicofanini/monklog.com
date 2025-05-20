"use server";

import { DAY } from "@/lib/time";
import { prisma } from "../prisma";

interface CreateUserInput {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
}

export async function createUser(input: CreateUserInput) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      cacheStrategy: { ttl: DAY },
    });

    if (existingUser) {
      return existingUser;
    }

    const user = await prisma.user.create({
      data: {
        id: input.id,
        email: input.email,
        full_name: input.full_name,
        avatar_url: input.avatar_url,
        role: "MONK",
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
