import { siteConfig } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CompanyShowcase() {
  const { companyShowcase } = siteConfig;
  return (
    <section id="company" className="w-full bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center font-mono text-red-500 mb-12">
          TRUSTED BY THOSE WHO DEMAND EXCELLENCE
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-red-500/20">
          {companyShowcase.companyLogos.map((logo) => (
            <Link
              href="#"
              className="group relative border-x border-red-500/20 h-32 flex items-center justify-center p-6"
              key={logo.id}
            >
              <div className="transition-all duration-300 translate-y-0 group-hover:-translate-y-2">
                {logo.logo}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-2 transition-all duration-300">
                <span className="flex items-center gap-2 text-sm font-mono text-white/60">
                  Learn More <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
