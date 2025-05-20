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
    if (input.trim() && !disabled) {
      onSend(input.trim(), mentor);
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  return (
    <div className="flex-none border-t border-red-500/20 bg-black/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share your truth... (Press Enter to send)"
              className="min-h-[44px] max-h-[200px] bg-black/40 resize-none border-red-500/20 focus:ring-1 focus:ring-red-500/40 placeholder:text-white/20 text-sm font-mono pr-2"
              rows={1}
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <MentorSelect value={mentor} onValueChange={setMentor} />
            <Button
              onClick={handleSend}
              type="button"
              size="sm"
              className={`h-8 px-3 transition-colors font-mono text-xs ${
                disabled ? "bg-red-500/50" : "bg-red-500/80 hover:bg-red-500"
              }`}
              disabled={disabled}
            >
              {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : "SEND"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
