"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Habit, HabitCategory } from "@prisma/client";

interface HabitWithState extends Habit {
  isTracked: boolean;
  isCompleted: boolean;
  isRelapsed: boolean;
  category: HabitCategory;
}

interface HabitConfigProps {
  habits: HabitWithState[];
  onSave: (selectedHabits: string[]) => void;
}

const TIME_BLOCK_ICONS = {
  morning: "🌅",
  midday: "☀️",
  evening: "🌙",
};

export function HabitConfig({ habits, onSave }: HabitConfigProps) {
  const [selectedHabits, setSelectedHabits] = useState<string[]>(
    habits.filter((h) => h.isTracked).map((h) => h.id)
  );

  const habitsByCategory = habits.reduce((acc, habit) => {
    const category = habit.category.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {} as Record<string, HabitWithState[]>);

  const handleToggleHabit = (habitId: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(habitsByCategory).map(([category, habits]) => (
        <Card key={category} className="p-6 bg-black/40">
          <div className="space-y-4">
            <h3 className="font-mono text-red-500">{category.toUpperCase()}</h3>
            <div className="grid gap-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => handleToggleHabit(habit.id)}
                >
                  <Checkbox
                    id={habit.id}
                    checked={selectedHabits.includes(habit.id)}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {habit.icon && (
                        <span
                          className="text-lg"
                          role="img"
                          aria-label={habit.name}
                        >
                          {habit.icon}
                        </span>
                      )}
                      <label
                        htmlFor={habit.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {habit.name}
                      </label>
                    </div>
                    {habit.criteria && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {habit.criteria}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>
                        {
                          TIME_BLOCK_ICONS[
                            habit.time_block as keyof typeof TIME_BLOCK_ICONS
                          ]
                        }
                      </span>
                      <span>{habit.minutes}m</span>
                    </div>
                    {habit.is_relapsable && (
                      <span className="text-xs text-red-500">Relapsable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={() => onSave(selectedHabits)}
          className="bg-red-500 hover:bg-red-600"
          disabled={selectedHabits.length === 0}
        >
          Save Habits ({selectedHabits.length})
        </Button>
      </div>
    </div>
  );
}
