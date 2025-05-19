import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/private/admin/app-sidebar";
import { SiteHeader } from "@/components/private/admin/site-header";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { paths } from "@/lib/path";
import { Toaster } from "@/components/ui/sonner";

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
    <div className="mx-auto py-2">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
