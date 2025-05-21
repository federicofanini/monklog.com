"use client";

import { siteConfig } from "@/lib/config";

export function GrowthSection() {
  const { title, description, items } = siteConfig.growthSection;

  return (
    <section id="growth" className="w-full bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            {title}
          </h2>
          <p className="text-red-500 font-mono">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-red-500/20">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative border border-red-500/20 p-8 min-h-[500px] flex flex-col justify-end hover:bg-red-500/5 transition-all"
            >
              <div className="absolute inset-0 flex items-center justify-center p-12">
                {item.content}
              </div>
              <div className="relative space-y-2">
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
