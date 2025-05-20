"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  loading?: boolean;
}

export function ChatContainer({ messages, loading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
            <ChatMessage
              key={message.id}
              message={message.content}
              isAI={message.isAI}
            />
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[85%] space-y-1.5">
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-1">
                AI
              </div>
              <div className="rounded-lg p-3 bg-black/60 w-8 h-8 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500/80 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
