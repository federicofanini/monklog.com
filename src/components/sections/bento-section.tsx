"use client";

import { siteConfig } from "@/lib/config";

export function BentoSection() {
  const { title, description, items } = siteConfig.bentoSection;

  return (
    <section id="bento" className="w-full bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            {title}
          </h2>
          <p className="text-red-500 font-mono">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative border border-red-500/20 bg-black hover:border-red-500 transition-all"
            >
              <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.content}
                </div>
              </div>
              <div className="p-6 space-y-2 border-t border-red-500/20">
                <h3 className="text-lg font-bold font-mono text-white">
                  {item.title}
                </h3>
                <p className="text-sm font-mono text-white/60">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
