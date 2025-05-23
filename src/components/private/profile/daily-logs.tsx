"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DailyAggregation } from "@/packages/database/user/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Activity, Brain, Moon, Utensils } from "lucide-react";
import { useState } from "react";

interface DailyLogsProps {
  onDateChange: (date: Date) => void;
  dailyData: DailyAggregation[];
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  unit?: string;
  subStats?: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
}

function StatItem({ icon, label, value, unit, subStats }: StatItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="rounded-lg bg-red-500/20 p-2">{icon}</div>
      <div className="space-y-2 flex-1">
        <div className="space-y-1">
          <p className="font-mono text-sm text-white/90">{label}</p>
          <p className="font-mono text-sm text-white/90">
            {value !== null ? `${value}${unit || ""}` : "Not logged"}
          </p>
        </div>
        {subStats && (
          <div className="grid grid-cols-3 gap-4">
            {subStats.map((stat, index) => (
              <div key={index}>
                <p className="font-mono text-xs text-white/60">{stat.label}</p>
                <p className="font-mono text-sm text-white/90">
                  {stat.value}
                  {stat.unit || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DailyLogs({ onDateChange, dailyData }: DailyLogsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const currentDayData = dailyData[0];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateChange(date);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-2 bg-black/40 border-red-500/20">
        <CardHeader>
          <CardTitle className="font-mono text-xs text-white/90">
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full font-mono"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption:
                "flex justify-center pt-1 relative items-center font-mono text-white/90",
              caption_label: "text-sm font-mono",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 text-white/60 hover:text-white/90 border-red-500/20"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-white/60 rounded-md w-9 font-mono text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-red-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-mono hover:bg-red-500/20 focus:bg-red-500/20",
                "text-white/90 hover:text-white aria-selected:bg-red-500/80"
              ),
              day_selected:
                "bg-red-500/80 text-white hover:bg-red-500 focus:bg-red-500",
              day_today: "bg-red-500/20 text-white",
              day_outside: "text-white/40 opacity-50",
              day_disabled: "text-white/20",
              day_hidden: "invisible",
            }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 bg-black/40 border-red-500/20">
        <CardHeader>
          <CardTitle className="font-mono text-xs text-white/90">
            Daily Summary - {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatItem
            icon={<Activity className="h-4 w-4 text-red-500/80" />}
            label="Physical Activity"
            value={currentDayData.health.steps}
            unit=" steps"
            subStats={[
              {
                label: "Cardio",
                value: currentDayData.health.cardio_minutes,
                unit: "min",
              },
              {
                label: "Strength",
                value: currentDayData.health.strength_minutes,
                unit: "min",
              },
              {
                label: "Water",
                value: currentDayData.health.water_ml,
                unit: "ml",
              },
            ]}
          />

          <Separator className="bg-red-500/20" />

          <StatItem
            icon={<Moon className="h-4 w-4 text-red-500/80" />}
            label="Sleep Quality"
            value={currentDayData.sleep.score}
            unit="/100"
            subStats={[
              {
                label: "Duration",
                value: `${Math.floor(
                  currentDayData.sleep.duration_minutes / 60
                )}h ${currentDayData.sleep.duration_minutes % 60}m`,
              },
            ]}
          />

          <Separator className="bg-red-500/20" />

          <StatItem
            icon={<Utensils className="h-4 w-4 text-red-500/80" />}
            label="Nutrition"
            value={currentDayData.nutrition.food_quality}
            unit="/10"
            subStats={[
              {
                label: "Calories",
                value: currentDayData.nutrition.calories,
                unit: "kcal",
              },
              {
                label: "Protein",
                value: currentDayData.nutrition.protein,
                unit: "g",
              },
              {
                label: "Carbs",
                value: currentDayData.nutrition.carbs,
                unit: "g",
              },
            ]}
          />

          <Separator className="bg-red-500/20" />

          <StatItem
            icon={<Brain className="h-4 w-4 text-red-500/80" />}
            label="Daily Mood"
            value={currentDayData.health.mood}
          />
        </CardContent>
      </Card>
    </div>
  );
}
