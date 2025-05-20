import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  count: number;
  className?: string;
}

export function StreakCounter({ count, className }: StreakCounterProps) {
  return (
    <div className={cn("flex items-center gap-2 text-red-500", className)}>
      <Flame className="h-5 w-5" />
      <span className="font-mono font-bold">Day {count}</span>
    </div>
  );
}
