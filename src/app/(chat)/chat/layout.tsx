import { ChatHeader } from "@/components/private/chat/chat-header";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-black to-neutral-950">
      <ChatHeader />
      {children}
    </div>
  );
}
