import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { ChatHeader } from "@/components/private/chat/chat-header";
import { Toaster } from "@/components/ui/sonner";
import { prisma } from "@/packages/database/prisma";
import { kv } from "@/packages/kv/redis";

async function initUserChatUsage(userId: string) {
  try {
    // Get today's date key
    const today = new Date().toISOString().split("T")[0];
    const key = `chat:${userId}:${today}`;

    // Check if usage exists for today
    const usage = await kv.get<number>(key);

    if (usage === null) {
      // Initialize with 0 if no usage exists
      await kv.set(key, 0, {
        // Set expiry to end of day
        ex: Math.ceil((new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000),
      });
    }
  } catch (error) {
    console.error("Failed to initialize chat usage:", error);
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `MonkLog`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = await getKindeServerSession();
  const kindeUser = await getUser();

  // If no user is logged in, redirect to login
  if (!kindeUser || !kindeUser.email) {
    redirect(paths.api.login);
  }

  try {
    // Check if user exists and create if not
    let user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      select: { id: true, paid: true },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: kindeUser.id,
          email: kindeUser.email,
          full_name:
            `${kindeUser.given_name || ""} ${
              kindeUser.family_name || ""
            }`.trim() || "Anonymous User",
          avatar_url: kindeUser.picture || undefined,
          role: "MONK",
        },
        select: { id: true, paid: true },
      });
    }

    // Initialize chat usage for free users
    if (user && !user.paid) {
      await initUserChatUsage(kindeUser.id);
    }

    return (
      <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-black to-neutral-950">
        <ChatHeader />
        {children}
        <Toaster />
      </div>
    );
  } catch (error) {
    console.error("Error in chat layout:", error);
    redirect(paths.api.login);
  }
}
