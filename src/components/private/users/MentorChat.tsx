"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MentorMessage, MentorPersona } from "@prisma/client";
import { sendMentorMessage } from "@/app/(private)/(admin)/(users)/monk/mentor/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface MentorChatProps {
  userId: string;
  currentMentor: {
    id: MentorPersona;
    name: string;
    welcomeMessage: string;
  };
  initialMessages: MentorMessage[];
}

export function MentorChat({
  userId,
  currentMentor,
  initialMessages,
}: MentorChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMac(window.navigator.platform.toLowerCase().includes("mac"));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    // Immediately add user's message to the chat
    const userMessage = {
      id: `temp-${Date.now()}`,
      userId: "user",
      habitLogId: null,
      persona: currentMentor.id,
      message: input.trim(),
      reflection: null,
      challenge: null,
      created_at: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await sendMentorMessage(userId, input, currentMentor.id);
      if (!result.success)
        throw new Error(result.error || "Failed to send message");

      // Update messages, replacing the temporary user message and adding the response
      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);
        return [
          ...withoutTemp,
          {
            id: `user-${Date.now()}`,
            userId: "user",
            habitLogId: null,
            persona: currentMentor.id,
            message: input.trim(),
            reflection: null,
            challenge: null,
            created_at: new Date(),
          },
          {
            ...result.message,
            // Ensure the message is properly formatted
            message: result.message.message?.trim() || "",
            challenge: result.message.challenge?.trim() || null,
          },
        ];
      });

      setInput("");
      router.refresh();
    } catch (error: unknown) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      // Remove the temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  return (
    <div className=" inset-0 flex flex-col bg-gradient-to-b from-black to-neutral-950">
      {/* Header */}
      <div className="flex-none h-12 border-b border-red-500/20 bg-black/80 backdrop-blur-md px-4">
        <div className="h-full flex items-center justify-between max-w-3xl mx-auto w-full">
          <div className="font-mono text-sm text-red-500 font-bold">
            MONK MODE
          </div>
          <div className="font-mono text-xs text-white/40 uppercase">
            {currentMentor.name}
          </div>
        </div>
      </div>

      {/* Messages Area */}
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
                  {currentMentor.welcomeMessage}
                </div>
              </div>

              {/* Protocol */}
              <div className="space-y-2 border-l-2 border-red-500/20 pl-4">
                <div className="font-mono text-xs text-white/60 uppercase">
                  PROTOCOL
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  <p>1. Report your daily progress</p>
                  <p>2. Share your challenges and victories</p>
                  <p>3. Await mentor assessment</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId !== userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] space-y-1.5 ${
                    message.userId !== userId ? "text-right" : "text-left"
                  }`}
                >
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-1">
                    {message.userId !== userId ? "YOU" : currentMentor.name}
                  </div>
                  <div
                    className={`rounded-lg p-3 font-mono text-sm leading-relaxed ${
                      message.userId !== userId
                        ? "bg-red-500/10 text-white/90"
                        : "bg-black/60 text-white/80"
                    }`}
                  >
                    {message.message}
                    {message.challenge && (
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <div className="text-[10px] text-red-500 uppercase tracking-wider mb-1">
                          Challenge
                        </div>
                        <div className="text-red-500/90">
                          {message.challenge}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-none border-t border-red-500/20 bg-black/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Report status..."
                className="min-h-[44px] max-h-[200px] pr-[4.5rem] bg-black/40 resize-none border-red-500/20 focus:ring-1 focus:ring-red-500/40 placeholder:text-white/20 text-sm font-mono"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className={`absolute bottom-1.5 right-1.5 h-8 px-3 transition-colors font-mono text-xs ${
                  isLoading ? "bg-red-500/50" : "bg-red-500/80 hover:bg-red-500"
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
            <div className="flex justify-center gap-2 text-[10px] text-white/40">
              <kbd className="px-1.5 py-0.5 font-mono bg-white/5 rounded border border-white/10">
                {isMac ? "⌘" : "Ctrl"} + Enter
              </kbd>
              <span>to send</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
