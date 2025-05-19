"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitTracker } from "./HabitTracker";
import { HabitStats } from "./HabitStats";

export function HabitTabs() {
  return (
    <Tabs defaultValue="track" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="track">Track Habits</TabsTrigger>
        <TabsTrigger value="stats">Stats & Achievements</TabsTrigger>
      </TabsList>
      <TabsContent value="track" className="mt-0">
        <HabitTracker />
      </TabsContent>
      <TabsContent value="stats" className="mt-0">
        <HabitStats
          longestStreak={14}
          currentStreak={7}
          level={5}
          experiencePoints={750}
          nextLevelPoints={1000}
        />
      </TabsContent>
    </Tabs>
  );
}
