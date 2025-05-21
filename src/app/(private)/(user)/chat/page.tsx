"use client";

import { useChat, Message } from "ai/react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  MentorSelect,
  MentorType,
} from "@/components/private/chat/mentor-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CornerDownLeft, Trash2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UpgradePrompt } from "@/components/private/chat/upgrade-prompt";
import Cookies from "js-cookie";
import { freeMessages } from "@/packages/ai/free-messages";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { usePWAInstall } from "@/hooks/use-pwa-install";

// Define a base message type that includes offline flag
interface BaseMessage extends Omit<Message, "createdAt"> {
  createdAt: string; // Change to string to avoid hydration issues
  offline?: boolean;
}

export default function ChatPage() {
  // PWA and network status hooks
  const { isOnline } = useNetworkStatus();
  const { canInstall, install } = usePWAInstall();
  const [isInstallPromptShown, setIsInstallPromptShown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );

  // Refs for scroll and textarea
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true);

  // Get saved mentor from cookie
  const savedMentor = Cookies.get("preferred_mentor") as MentorType | undefined;
  const [mentor, setMentor] = useState<MentorType>(savedMentor || "MONK");

  // Store offline messages
  const [offlineMessages, setOfflineMessages] = useState<BaseMessage[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("offline_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    body: {
      mentor,
    },
    onError: (error) => {
      if (error.message.includes("Daily message limit reached")) {
        toast.error(
          "Daily message limit reached. Upgrade to continue chatting."
        );
        fetchRemainingMessages();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    },
    onFinish: (message) => {
      // Remove any corresponding offline message if it exists
      setOfflineMessages((prev) =>
        prev.filter((msg) => msg.id !== `offline-${message.id}`)
      );
    },
  });

  // Save offline messages to localStorage
  useEffect(() => {
    if (offlineMessages.length > 0) {
      localStorage.setItem("offline_messages", JSON.stringify(offlineMessages));
    } else {
      localStorage.removeItem("offline_messages");
    }
  }, [offlineMessages]);

  // Handle mentor change
  useEffect(() => {
    Cookies.set("preferred_mentor", mentor, { expires: 365 });
  }, [mentor]);

  // Show PWA install prompt
  useEffect(() => {
    if (canInstall && !isInstallPromptShown) {
      setIsInstallPromptShown(true);
      toast.message("Install MonkLog", {
        description: "Install our app for the best experience",
        action: {
          label: "Install",
          onClick: () => install(),
        },
        duration: 10000,
      });
    }
  }, [canInstall, install, isInstallPromptShown]);

  const fetchRemainingMessages = useCallback(async () => {
    if (!isOnline) return;
    try {
      const response = await fetch("/api/chat/usage/status");
      const data = await response.json();
      setIsPaid(data.paid);
      if (!data.paid) {
        const usageResponse = await fetch("/api/chat/usage");
        const usageData = await usageResponse.json();
        setRemainingMessages(freeMessages - usageData.usage);
      }
    } catch (error) {
      console.error("Failed to fetch message limit status:", error);
    }
  }, [isOnline]);

  // Initial data loading
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchRemainingMessages();
    }
  }, [fetchRemainingMessages]);

  // Handle offline message submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOnline) {
      const offlineMessage: BaseMessage = {
        id: `offline-${Date.now()}`,
        role: "user",
        content: input,
        createdAt: new Date().toISOString(),
        offline: true,
      };

      setOfflineMessages((prev) => [...prev, offlineMessage]);
      // Cast the message to Message type for useChat compatibility
      setMessages((prev) => [
        ...prev,
        { ...offlineMessage, createdAt: new Date(offlineMessage.createdAt) },
      ]);

      toast.warning(
        "Message saved offline. Will sync when connection is restored."
      );
      return;
    }

    aiHandleSubmit(e);
  };

  const syncOfflineMessages = useCallback(async () => {
    if (!isOnline || !offlineMessages.length) return;

    setIsSyncing(true);
    try {
      for (const msg of offlineMessages) {
        await aiHandleSubmit(new Event("submit"), {
          data: {
            mentor,
            message: msg.content,
          },
        });
      }

      setOfflineMessages([]);
      toast.success("Offline messages synced successfully");
    } catch (error) {
      console.error("Failed to sync offline messages:", error);
      toast.error("Failed to sync some offline messages");
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, offlineMessages, mentor, aiHandleSubmit]);

  // Sync offline messages when coming back online
  useEffect(() => {
    if (isOnline && offlineMessages.length > 0 && !isSyncing) {
      syncOfflineMessages();
    }
  }, [isOnline, offlineMessages.length, syncOfflineMessages, isSyncing]);

  const clearChat = useCallback(async () => {
    try {
      setMessages([]);
      setOfflineMessages([]);
      localStorage.removeItem("offline_messages");
      toast.success("Chat cleared");
    } catch (error) {
      console.error("Failed to clear chat:", error);
      toast.error("Failed to clear chat");
    }
  }, [setMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {!isOnline && (
        <div className="px-4 py-2 bg-yellow-500/10 text-yellow-400 text-sm font-mono flex items-center gap-2 justify-center">
          <WifiOff className="h-4 w-4" />
          Offline Mode
        </div>
      )}
      {isSyncing && (
        <div className="px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-mono flex items-center gap-2 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          Syncing offline messages...
        </div>
      )}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-12">
        {!isPaid &&
          remainingMessages !== null &&
          remainingMessages < freeMessages && (
            <div className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-mono mb-4 rounded-lg">
              {remainingMessages > 0
                ? `${remainingMessages} / ${freeMessages} free messages remaining today`
                : "Daily message limit reached. Upgrade to continue chatting."}
            </div>
          )}
        <ScrollArea ref={scrollRef} className="flex-1 px-3 sm:px-4 py-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Message count indicator */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-1 py-2 bg-black/80 backdrop-blur-sm border-b border-red-500/10 mb-4">
              <div className="flex items-center gap-4">
                <div className="font-mono text-[10px] text-white/30">
                  {isLoading
                    ? "Loading history..."
                    : messages.length > 0
                    ? `${messages.length} message${
                        messages.length !== 1 ? "s" : ""
                      }`
                    : "No messages"}
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1 text-[10px] font-mono text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
              {!isPaid && (
                <div className="font-mono text-[10px] text-white/30">
                  {remainingMessages !== null
                    ? `${remainingMessages} / ${freeMessages} free messages remaining`
                    : "Loading..."}
                </div>
              )}
              {isPaid && (
                <div className="font-mono text-[10px] text-red-500/50">
                  PRO ACCESS
                </div>
              )}
            </div>

            {messages.length === 0 && !isLoading ? (
              <div className="space-y-6 px-1">
                {/* Welcome Message */}
                <div className="space-y-1">
                  <div className="font-mono text-xs text-red-500 uppercase tracking-wider">
                    TRANSMISSION INITIALIZED
                  </div>
                  <div className="font-mono text-base sm:text-lg">
                    Ready to push your limits?
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
              messages.map((message) => {
                const msg = message as unknown as BaseMessage;
                return (
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
                      <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-1 flex items-center gap-2 justify-end">
                        {message.role === "user" ? "YOU" : mentor}
                        {msg.offline && <WifiOff className="h-3 w-3" />}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-red-500/10 text-white/90"
                            : "bg-black/60 text-white/80",
                          msg.offline && "opacity-50"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Show upgrade prompt when limit is reached */}
            {!isPaid && remainingMessages === 0 && (
              <div className="mt-8">
                <UpgradePrompt />
              </div>
            )}

            {/* Add extra spacing at the bottom */}
            <div className="h-20" />
          </div>
        </ScrollArea>

        <div className="flex-none border-t border-red-500/20 bg-black/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" && !e.shiftKey) ||
                        (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      ) {
                        e.preventDefault();
                        handleSubmit(
                          e as unknown as React.FormEvent<HTMLFormElement>
                        );
                      }
                    }}
                    placeholder={
                      isOnline
                        ? "Share your truth..."
                        : "Offline mode - Messages will sync when online"
                    }
                    className="min-h-[44px] max-h-[200px] bg-black/40 resize-none border-red-500/20 focus:ring-1 focus:ring-red-500/40 placeholder:text-white/20 text-sm font-mono pr-12"
                    rows={1}
                    disabled={isLoading || (!isPaid && remainingMessages === 0)}
                  />
                  <div className="absolute right-3 bottom-2 flex items-center gap-2 pointer-events-none">
                    <span className="text-[10px] font-mono text-white/20">
                      Press <CornerDownLeft className="h-3 w-3 inline" />
                    </span>
                  </div>
                </div>
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
                    disabled={isLoading || (!isPaid && remainingMessages === 0)}
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
