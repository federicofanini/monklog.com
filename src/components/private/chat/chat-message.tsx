import { cn } from "@/lib/utils";
import type { MentorType } from "./mentor-select";

const mentorNames: Record<MentorType, string> = {
  GHOST: "The Ghost",
  MONK: "The Monk",
  WARRIOR: "The Marine",
  CEO: "The CEO",
};

interface ChatMessageProps {
  message: string;
  isAI?: boolean;
  mentor?: MentorType;
}

export function ChatMessage({ message, isAI, mentor }: ChatMessageProps) {
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[90%] sm:max-w-[85%] space-y-1.5 ${
          isAI ? "text-left" : "text-right"
        }`}
      >
        <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-1">
          {isAI ? (mentor ? mentorNames[mentor] : "AI") : "YOU"}
        </div>
        <div
          className={cn(
            "rounded-lg p-3 font-mono text-sm leading-relaxed",
            isAI ? "bg-black/60 text-white/80" : "bg-red-500/10 text-white/90"
          )}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
