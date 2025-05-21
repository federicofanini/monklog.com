"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export type MentorType = "GHOST" | "MONK" | "WARRIOR" | "CEO";

interface Mentor {
  id: MentorType;
  name: string;
  description: string;
  style: string;
}

const mentors: Mentor[] = [
  {
    id: "GHOST",
    name: "The Ghost",
    description: "Silent, poetic killer. Speaks in short, sharp truths.",
    style: "No motivation. No explanation. Just the mirror.",
  },
  {
    id: "MONK",
    name: "The Monk",
    description: "Calm, disciplined Stoic warrior guide.",
    style: "Patient but firm. Never emotional, never flattering.",
  },
  {
    id: "WARRIOR",
    name: "The Marine",
    description: "Cold, hard mentor who delivers orders.",
    style: "Intense, no-nonsense, and brutally honest.",
  },
  {
    id: "CEO",
    name: "The CEO",
    description: "High-performance operator and strategic coach.",
    style: "Focused on long-term execution and systems.",
  },
];

interface MentorSelectProps {
  value: MentorType;
  onValueChange: (value: MentorType) => void;
}

export function MentorSelect({ value, onValueChange }: MentorSelectProps) {
  // Use client-side state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const currentMentor = mentors.find((m) => m.id === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[100px] h-8 bg-black/40 border-red-500/20 focus:ring-1 focus:ring-red-500/40 font-mono text-[10px]">
          <SelectValue>
            <span className="text-red-500/80">Loading...</span>
          </SelectValue>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px] h-8 bg-black/40 border-red-500/20 focus:ring-1 focus:ring-red-500/40 font-mono text-[10px]">
        <SelectValue>
          <span className="text-red-500/80">{currentMentor?.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="bg-black/95 border-red-500/20"
        align="end"
        side="top"
      >
        {mentors.map((mentor) => (
          <SelectItem
            key={mentor.id}
            value={mentor.id}
            className="font-mono text-xs group"
          >
            <div className="space-y-0.5 py-1">
              <div className="text-red-500">{mentor.name}</div>
              <div className="text-[10px] text-white/40 group-hover:text-white/60">
                {mentor.description}
              </div>
              <div className="text-[10px] text-white/40 group-hover:text-white/60 italic">
                {mentor.style}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
