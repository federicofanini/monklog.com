"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import {
  MentorSelect,
  MentorType,
} from "@/components/private/chat/mentor-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { UpgradePrompt } from "@/components/private/chat/upgrade-prompt";
import { useSearchParams, useRouter } from "next/navigation";

export default function ChatPage() {
  const [mentor, setMentor] = useState<MentorType>("MONK");
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const [isPaid, setIsPaid] = useState(false);
  const { user } = useKindeAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
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
    });

  const checkUserStatus = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/chat/usage/status");
      const data = await response.json();
      setIsPaid(data.paid);
      if (!data.paid) {
        fetchRemainingMessages();
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
    }
  };

  const fetchRemainingMessages = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/chat/usage?userId=${user.id}`);
      const data = await response.json();
      setRemainingMessages(3 - data.usage);

      // Show warning toast when user has 1 message remaining
      if (3 - data.usage === 1) {
        toast.warning("You have 1 message remaining today.");
      }
    } catch (error) {
      console.error("Failed to fetch remaining messages:", error);
      toast.error("Failed to fetch message limit status.");
    }
  };

  useEffect(() => {
    if (user?.id) {
      checkUserStatus();
    }
  }, [user?.id]);

  // Handle successful payment
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      toast.success("Welcome to MonkLog Pro! You now have unlimited access.", {
        duration: 5000,
      });
      checkUserStatus(); // Refresh user status
      // Remove the success parameter from the URL
      router.replace("/chat");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-12">
        {!isPaid && remainingMessages !== null && remainingMessages < 3 && (
          <div className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-mono mb-4 rounded-lg">
            {remainingMessages > 0
              ? `${remainingMessages} free messages remaining today`
              : "Daily message limit reached. Upgrade to continue chatting."}
          </div>
        )}
        <ScrollArea className="flex-1 px-3 sm:px-4 py-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Message count indicator */}
            <div className="sticky top-0 z-10 flex justify-between items-center px-1 py-2 bg-black/80 backdrop-blur-sm border-b border-red-500/10 mb-4">
              <div className="font-mono text-[10px] text-white/30">
                {messages.length > 0
                  ? `${messages.length} message${
                      messages.length !== 1 ? "s" : ""
                    }`
                  : "No messages"}
              </div>
              {!isPaid && (
                <div className="font-mono text-[10px] text-white/30">
                  {remainingMessages !== null
                    ? `${remainingMessages} / 3 free messages remaining`
                    : "Loading..."}
                </div>
              )}
              {isPaid && (
                <div className="font-mono text-[10px] text-red-500/50">
                  PRO ACCESS
                </div>
              )}
            </div>

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

            {/* Show upgrade prompt when limit is reached */}
            {!isPaid && remainingMessages === 0 && (
              <div className="mt-8">
                <UpgradePrompt />
              </div>
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
                  disabled={isLoading || (!isPaid && remainingMessages === 0)}
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
