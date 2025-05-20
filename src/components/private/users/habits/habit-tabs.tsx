"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitTracker } from "./habit-tracker";
import { HabitStats } from "./stats/habit-stats";

export function HabitTabs({ userId }: { userId: string }) {
  return (
    <Tabs defaultValue="track" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="track">Track Habits</TabsTrigger>
        <TabsTrigger value="stats">Stats & Achievements</TabsTrigger>
      </TabsList>
      <TabsContent value="track" className="mt-0">
        <HabitTracker userId={userId} />
      </TabsContent>
      <TabsContent value="stats" className="mt-0">
        <HabitStats userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
