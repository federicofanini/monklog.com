import { Dot } from "lucide-react";
import { ChatUserMenu } from "./chat-user";
export function ChatHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-red-500/20 bg-black/80 backdrop-blur-md">
      <div className="h-full flex items-center justify-between max-w-3xl mx-auto w-full px-4">
        <div className="font-mono text-sm text-red-500 font-bold">
          MonkLog AI
        </div>
        <div className="font-mono text-xs text-green-300 uppercase flex items-center gap-2">
          <Dot className="size-4 animate-pulse" />
          READY
          <ChatUserMenu />
        </div>
      </div>
    </header>
  );
}
