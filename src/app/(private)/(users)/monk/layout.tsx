import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/private/users/sidebar";
import { Header } from "@/components/private/users/header";
import { getUserProfile } from "@/packages/database/user";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Monk`,
    template: `%s - Monk - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    redirect(paths.api.login);
  }

  if (!user) {
    console.error("Failed to create/get user in database");
    redirect(paths.api.login);
  }

  // Check if user needs onboarding
  const profile = await getUserProfile(user.id);
  const needsOnboarding = !profile.settings; // No settings means new user

  if (needsOnboarding) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <SidebarInset className="flex-1 bg-noise pb-8">
          <Header />

          <main className="pt-4 mx-auto max-w-4xl px-4">
            {children}

            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
