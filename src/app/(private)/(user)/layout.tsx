import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { ChatHeader } from "@/components/private/chat/chat-header";
import { Toaster } from "@/components/ui/sonner";

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

  if (!kindeUser || kindeUser.email !== "federico.monklog@gmail.com") {
    redirect(paths.users.home);
  }

  if (!kindeUser || !kindeUser.email) {
    redirect(paths.api.login);
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-black to-neutral-950">
      <ChatHeader />
      {children}
      <Toaster />
    </div>
  );
}
