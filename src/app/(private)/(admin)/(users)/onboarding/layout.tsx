import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { paths } from "@/lib/path";
import { prisma } from "@/packages/database/prisma";
import { Toaster } from "sonner";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = await getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.id || !kindeUser?.email) {
    redirect(paths.api.login);
  }

  try {
    // Create or get existing user in our database with transaction
    const user = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: kindeUser.id },
        include: {
          settings: true,
        },
      });

      if (existingUser) {
        // If user exists and has settings, redirect to habits
        if (existingUser.settings) {
          redirect(paths.monk.habits);
        }
        return existingUser;
      }

      // At this point we know email exists due to the check above
      const email = kindeUser.email!;
      const fullName = `${kindeUser.given_name || ""} ${
        kindeUser.family_name || ""
      }`.trim();

      // Create new user
      const newUser = await tx.user.create({
        data: {
          id: kindeUser.id,
          email,
          full_name: fullName || "Anonymous User",
          avatar_url: kindeUser.picture || undefined,
          role: "MONK",
        },
      });

      if (!newUser) {
        throw new Error("Failed to create user in database");
      }

      return newUser;
    });

    if (!user) {
      throw new Error("Failed to create/get user in database");
    }

    return (
      <>
        {children}
        <Toaster />
      </>
    );
  } catch (error) {
    console.error("Error in onboarding layout:", error);
    redirect(paths.api.login);
  }
}
