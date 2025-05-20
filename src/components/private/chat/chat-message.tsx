import { cn } from "@/lib/utils";
import type { MentorType } from "./mentor-select";
import { parseMentorResponse } from "@/packages/ai/mentors/parse-mentor-response";
import ReactMarkdown from "react-markdown";

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
  // Only parse AI messages with a mentor type
  const parsedMessage =
    isAI && mentor ? parseMentorResponse(message, mentor) : null;

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

        {parsedMessage ? (
          <div className="rounded-lg bg-black/60 p-4 space-y-4 font-mono text-sm leading-relaxed">
            {/* Main Section */}
            <div className="space-y-2">
              <span className="text-red-500 font-bold uppercase tracking-wider">
                {parsedMessage.main.title}
              </span>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <span className="text-white/90">{children}</span>
                  ),
                  blockquote: ({ children }) => (
                    <span className="text-white/70 italic">{children}</span>
                  ),
                }}
              >
                {`- ${parsedMessage.main.content}`}
              </ReactMarkdown>
            </div>

            {/* Challenge Section */}
            <div className="space-y-2">
              <span className="text-red-500 font-bold uppercase tracking-wider">
                {parsedMessage.challenge.title}
              </span>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <span className="text-white/90">{children}</span>
                  ),
                  strong: ({ children }) => (
                    <span className="text-red-500/90 font-bold">
                      {children}
                    </span>
                  ),
                }}
              >
                {`- ${parsedMessage.challenge.content}`}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "rounded-lg p-3 font-mono text-sm leading-relaxed",
              isAI ? "bg-black/60 text-white/80" : "bg-red-500/10 text-white/90"
            )}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
