import Link from "next/link";
import { paths } from "@/lib/path";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full relative min-h-screen flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-50" />

      {/* GitHub Corner */}
      <a
        href={paths.links.github}
        className="absolute top-0 right-0 z-20"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          className="absolute top-0 right-0 border-0 text-black fill-white"
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            className="fill-red-500"
            style={{ transformOrigin: "130px 106px" }}
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            className="fill-red-500"
          />
        </svg>
      </a>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            STOP BEING WEAK.
          </h1>
          <p className="text-xl md:text-2xl text-red-500 font-mono">
            You know the excuses. The bullsh*t. The comfortable path to
            mediocrity.
          </p>
          <p className="text-xl md:text-2xl text-white/80">
            MonkLog is your sergeant, hardwired for one mission:{" "}
            <span className="text-red-500">YOUR TRANSFORMATION.</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link
            href={paths.api.login}
            className="bg-red-500 hover:bg-red-600 text-white font-mono px-8 py-4 rounded-none transition-all duration-300 text-lg uppercase tracking-wider w-full max-w-sm"
          >
            FORGE YOUR FUTURE, NOW.
          </Link>

          <div className="space-y-2 font-mono text-sm">
            <p className="text-white/60">
              100% Open Source. No Excuses. No Bullshit.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <p className="text-yellow-500 uppercase tracking-wider">
                Under Development
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
