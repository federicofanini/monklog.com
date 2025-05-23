"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export type UsernameError = {
  type: "TAKEN" | "INVALID" | "TOO_SHORT" | "TOO_LONG" | "UNAUTHORIZED";
  message: string;
};

export type UsernameResponse = {
  success: boolean;
  error?: UsernameError;
  username?: string;
};

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 20;

export async function checkUsernameAvailability(
  username: string
): Promise<UsernameResponse> {
  try {
    // Basic validation
    if (username.length < MIN_LENGTH) {
      return {
        success: false,
        error: {
          type: "TOO_SHORT",
          message: `Username must be at least ${MIN_LENGTH} characters long`,
        },
      };
    }

    if (username.length > MAX_LENGTH) {
      return {
        success: false,
        error: {
          type: "TOO_LONG",
          message: `Username must be no more than ${MAX_LENGTH} characters long`,
        },
      };
    }

    if (!USERNAME_REGEX.test(username)) {
      return {
        success: false,
        error: {
          type: "INVALID",
          message:
            "Username can only contain letters, numbers, underscores, and hyphens",
        },
      };
    }

    // Check if username is taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        error: {
          type: "TAKEN",
          message: "This username is already taken",
        },
      };
    }

    return {
      success: true,
      username,
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return {
      success: false,
      error: {
        type: "INVALID",
        message: "Failed to check username availability",
      },
    };
  }
}

export async function updateUsername(
  username: string
): Promise<UsernameResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "You must be logged in to update your username",
        },
      };
    }

    // Check availability first
    const availabilityCheck = await checkUsernameAvailability(username);
    if (!availabilityCheck.success) {
      return availabilityCheck;
    }

    // Update username
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username },
      select: { username: true },
    });

    // Revalidate relevant paths
    revalidatePath("/profile");
    revalidatePath(`/${username}`);

    return {
      success: true,
      username: updatedUser.username || undefined,
    };
  } catch (error) {
    console.error("Error updating username:", error);
    return {
      success: false,
      error: {
        type: "INVALID",
        message: "Failed to update username",
      },
    };
  }
}

export async function getCurrentUsername(): Promise<UsernameResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "You must be logged in to get your username",
        },
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true },
    });

    return {
      success: true,
      username: dbUser?.username || undefined,
    };
  } catch (error) {
    console.error("Error getting current username:", error);
    return {
      success: false,
      error: {
        type: "INVALID",
        message: "Failed to get current username",
      },
    };
  }
}
