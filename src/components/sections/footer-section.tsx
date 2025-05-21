"use client";

import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useMediaQuery } from "@/hooks/use-media-query";
import { siteConfig } from "@/lib/config";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Logo } from "./logo";

export function FooterSection() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer id="footer" className="w-full bg-black border-t border-red-500/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="size-8 text-red-500" />
              <p className="text-xl font-bold text-white">MONKLOG</p>
            </Link>
            <p className="text-white/60 font-mono max-w-sm">
              Your sergeant. Hardwired for one mission: YOUR TRANSFORMATION.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8">
            {siteConfig.footerLinks.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-red-500">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.url}
                        className="group flex items-center gap-2 text-sm font-mono text-white/60 hover:text-white transition-colors"
                      >
                        <span>{link.title}</span>
                        <div className="size-4 border border-red-500/20 flex items-center justify-center translate-x-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                          <ChevronRightIcon className="size-3 text-red-500" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="h-48 relative overflow-hidden border-t border-red-500/20">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="absolute inset-0">
          <FlickeringGrid
            text={tablet ? "MONKLOG" : "FORGE YOUR FUTURE"}
            fontSize={tablet ? 70 : 90}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#EF4444"
            maxOpacity={0.2}
            flickerChance={0.15}
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-red-500/20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-mono text-white/40">
            NO WEAKNESS. NO EXCUSES. ONLY RESULTS.
          </p>
        </div>
      </div>
    </footer>
  );
}
