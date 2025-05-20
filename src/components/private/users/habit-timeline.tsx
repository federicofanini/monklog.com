import { Card } from "@/components/ui/card";
import type { Habit, HabitCategory } from "@prisma/client";

interface HabitWithState extends Habit {
  isTracked: boolean;
  isCompleted: boolean;
  isRelapsed: boolean;
  category: HabitCategory;
}

interface TimeBlock {
  name: string;
  icon: string;
  habits: HabitWithState[];
}

interface HabitTimelineProps {
  habits: HabitWithState[];
}

const TIME_BLOCKS: TimeBlock[] = [
  { name: "morning", icon: "🌅", habits: [] },
  { name: "midday", icon: "☀️", habits: [] },
  { name: "evening", icon: "🌙", habits: [] },
];

export function HabitTimeline({ habits }: HabitTimelineProps) {
  // Organize habits by time block
  const timeBlocks = TIME_BLOCKS.map((block) => ({
    ...block,
    habits: habits
      .filter((h) => h.time_block === block.name)
      .sort((a, b) => a.order - b.order),
  }));

  // Calculate total minutes for each time block
  const getBlockDuration = (habits: HabitWithState[]) =>
    habits.reduce((total, habit) => total + habit.minutes, 0);

  return (
    <div className="space-y-6">
      {timeBlocks.map((block) => (
        <Card key={block.name} className="p-6 bg-black/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-red-500 flex items-center gap-2">
                <span>{block.icon}</span>
                {block.name.toUpperCase()}
              </h3>
              <span className="text-sm text-muted-foreground">
                {getBlockDuration(block.habits)} min
              </span>
            </div>

            {block.habits.length > 0 ? (
              <div className="space-y-3">
                {block.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      habit.isTracked ? "bg-red-500/10" : "bg-gray-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-lg"
                        role="img"
                        aria-label={habit.name}
                      >
                        {habit.icon}
                      </span>
                      <div>
                        <div className="font-medium">{habit.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {habit.criteria}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {habit.minutes} min
                      </span>
                      {habit.is_relapsable && (
                        <span className="text-xs text-red-500">Relapsable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No habits scheduled for this time block
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
