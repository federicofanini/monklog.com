import { SocialProofTestimonials } from "@/components/testimonial-scroll";
import { siteConfig } from "@/lib/config";

export function TestimonialSection() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="flex flex-col items-center justify-center w-full bg-black py-24"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto px-6 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
          WARRIORS WHO CONQUERED
        </h2>
        <p className="text-red-500 font-mono">
          These are not success stories. These are war stories.
        </p>
      </div>

      <SocialProofTestimonials testimonials={testimonials} />

      <div className="mt-12 text-center max-w-lg mx-auto px-6">
        <p className="text-white/40 font-mono text-sm">
          Every victory here was earned through sweat and discipline.
          <br />
          No shortcuts. No excuses.
        </p>
      </div>
    </section>
  );
}
