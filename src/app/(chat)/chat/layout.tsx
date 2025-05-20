import { Dot } from "lucide-react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-black to-neutral-950">
      <header className="flex-none h-12 border-b border-red-500/20 bg-black/80 backdrop-blur-md">
        <div className="h-full flex items-center justify-between max-w-3xl mx-auto w-full px-4">
          <div className="font-mono text-sm text-red-500 font-bold">
            MonkLog AI
          </div>
          <div className="font-mono text-xs text-green-300 uppercase flex items-center gap-1">
            <Dot className="size-4 animate-pulse" />
            READY
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
