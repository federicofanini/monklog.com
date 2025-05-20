import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/private/admin/sidebar";
import { Header } from "@/components/private/admin/header";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Admin `,
    template: `%s - Admin - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function AdminLayout({
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
