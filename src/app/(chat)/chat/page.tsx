"use client";

import { useState } from "react";
import { ChatContainer } from "@/components/private/chat/chat-container";
import { ChatInput } from "@/components/private/chat/chat-input";
import { nanoid } from "nanoid";
import type { MentorType } from "@/components/private/chat/mentor-select";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  mentor?: MentorType;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string, mentor: MentorType) => {
    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content,
      isAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // TODO: Add actual API call here with mentor type
    // For now, just simulate a response
    setTimeout(() => {
      const aiMessage: Message = {
        id: nanoid(),
        content: "This is a placeholder response. API integration coming soon.",
        isAI: true,
        mentor,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[90dvh] bg-black">
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        <ChatContainer messages={messages} loading={loading} />
        <ChatInput onSend={handleSend} disabled={loading} />
      </main>
    </div>
  );
}
