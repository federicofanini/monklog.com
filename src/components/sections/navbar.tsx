"use client";

import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = siteConfig.nav.links.map((item) =>
        item.href.substring(1)
      );
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  return (
    <header
      className={cn(
        "sticky z-50 top-0 w-full transition-all duration-300",
        hasScrolled
          ? "bg-black/90 backdrop-blur-sm border-b border-red-500/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="size-8 text-red-500" />
            <p className="text-xl font-bold text-white">MONKLOG</p>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig.nav.links.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "text-sm font-mono uppercase tracking-wider transition-colors",
                  activeSection === item.href.substring(1)
                    ? "text-red-500"
                    : "text-white/60 hover:text-white"
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/onboarding"
              className="hidden md:flex h-9 items-center px-6 bg-red-500 hover:bg-red-600 text-white font-mono text-sm uppercase tracking-wider transition-all duration-300"
            >
              ENLIST NOW
            </Link>
            <button
              className="md:hidden border border-red-500/20 size-10 flex items-center justify-center"
              onClick={toggleDrawer}
            >
              {isDrawerOpen ? (
                <X className="size-5 text-white" />
              ) : (
                <Menu className="size-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 bg-black border-t border-red-500/20 p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="space-y-6">
                {siteConfig.nav.links.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block text-lg font-mono uppercase tracking-wider text-white/60 hover:text-red-500"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <Link
                  href="/onboarding"
                  className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white font-mono text-center uppercase tracking-wider"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  ENLIST NOW
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
