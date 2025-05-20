import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { Toaster } from "@/components/ui/sonner";
import { createUser } from "@/packages/database/user/create-user";
import { Sidebar } from "@/components/private/users/sidebar";
import { Header } from "@/components/private/users/header";

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
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.email) {
    redirect(paths.api.login);
  }

  // Create or get existing user in our database
  const user = await createUser({
    id: kindeUser.id,
    email: kindeUser.email,
    full_name: `${kindeUser.given_name || ""} ${
      kindeUser.family_name || ""
    }`.trim(),
    avatar_url: kindeUser.picture || undefined,
  });

  if (!user) {
    console.error("Failed to create/get user in database");
    redirect(paths.api.login);
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />

        <SidebarInset className="flex-1 bg-noise pb-8">
          <Header />

          <main className="pt-4">
            {children}

            <Toaster />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
