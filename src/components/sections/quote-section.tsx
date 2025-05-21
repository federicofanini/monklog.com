/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/lib/config";

export function QuoteSection() {
  const { quoteSection } = siteConfig;

  return (
    <section
      id="quote"
      className="w-full bg-black border-y border-red-500/20 py-24"
    >
      <div className="max-w-4xl mx-auto px-6">
        <blockquote className="space-y-8">
          <p className="text-2xl md:text-3xl font-mono text-white leading-relaxed tracking-tight">
            &ldquo;{quoteSection.quote}&rdquo;
          </p>

          <div className="flex items-center gap-4">
            <div className="size-12 border border-red-500/20 p-0.5">
              <img
                src={quoteSection.author.image}
                alt={quoteSection.author.name}
                className="size-full object-cover grayscale"
              />
            </div>
            <div>
              <cite className="not-italic">
                <span className="block text-lg font-mono text-red-500">
                  {quoteSection.author.name}
                </span>
                <span className="block text-sm font-mono text-white/40">
                  {quoteSection.author.role}
                </span>
              </cite>
            </div>
          </div>
        </blockquote>
      </div>
    </section>
  );
}
