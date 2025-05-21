//import { Navbar } from "@/components/sections/navbar";
import { Navbar } from "@/components/sections/navbar";
import { siteConfig } from "@/lib/site";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto relative bg-background">
      <Navbar />
      {children}
    </div>
  );
}
