"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import {
  MentorSelect,
  MentorType,
} from "@/components/private/chat/mentor-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [mentor, setMentor] = useState<MentorType>("MONK");
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        mentor,
      },
    });

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-12">
        <ScrollArea className="flex-1 px-3 sm:px-4 py-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="space-y-6 px-1">
                {/* Welcome Message */}
                <div className="space-y-1">
                  <div className="font-mono text-xs text-red-500 uppercase tracking-wider">
                    TRANSMISSION INITIALIZED
                  </div>
                  <div className="font-mono text-base sm:text-lg">
                    Welcome to MonkLog AI. Ready to push your limits?
                  </div>
                </div>

                {/* Protocol */}
                <div className="space-y-2 border-l-2 border-red-500/20 pl-4">
                  <div className="font-mono text-xs text-white/60 uppercase">
                    PROTOCOL
                  </div>
                  <div className="space-y-1 text-sm text-white/80">
                    <p>1. Share your truth - no filters</p>
                    <p>2. Receive mentor guidance</p>
                    <p>3. Transform through action</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] space-y-1.5 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-1">
                      {message.role === "user" ? "YOU" : mentor}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg p-3 font-mono text-sm leading-relaxed",
                        message.role === "user"
                          ? "bg-red-500/10 text-white/90"
                          : "bg-black/60 text-white/80"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex-none border-t border-red-500/20 bg-black/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Share your truth..."
                  className="min-h-[44px] max-h-[200px] bg-black/40 resize-none border-red-500/20 focus:ring-1 focus:ring-red-500/40 placeholder:text-white/20 text-sm font-mono"
                  rows={1}
                  disabled={isLoading}
                />
                <div className="flex flex-col justify-end gap-2">
                  <MentorSelect value={mentor} onValueChange={setMentor} />
                  <Button
                    type="submit"
                    size="sm"
                    className={`h-8 px-3 transition-colors font-mono text-xs ${
                      isLoading
                        ? "bg-red-500/50"
                        : "bg-red-500/80 hover:bg-red-500"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "SEND"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
