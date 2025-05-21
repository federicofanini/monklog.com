import { paths } from "@/lib/path";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
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

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect(paths.api.login);
  }

  // Get user's paid status and initialize chat usage if not paid
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { paid: true },
  });

  if (!dbUser?.paid) {
    await initUserChatUsage(user.id);
  }

  return <>{children}</>;
}
