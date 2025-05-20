"use client";

import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MentorSelect, MentorType } from "./mentor-select";

interface ChatInputProps {
  onSend: (message: string, mentor: MentorType) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [mentor, setMentor] = useState<MentorType>("MONK");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input, mentor);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-none border-t border-red-500/20 bg-black/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative"
        >
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your truth..."
              className="min-h-[44px] max-h-[200px] bg-black/40 resize-none border-red-500/20 focus:ring-1 focus:ring-red-500/40 placeholder:text-white/20 text-sm font-mono"
              rows={1}
              disabled={disabled}
            />
            <div className="flex flex-col justify-end gap-2">
              <MentorSelect value={mentor} onValueChange={setMentor} />
              <Button
                type="submit"
                size="sm"
                className={`h-8 px-3 transition-colors font-mono text-xs ${
                  disabled ? "bg-red-500/50" : "bg-red-500/80 hover:bg-red-500"
                }`}
                disabled={disabled}
              >
                {disabled ? (
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
  );
}
