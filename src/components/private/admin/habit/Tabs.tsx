"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BulkInsertTab from "./BulkInsertTab";
import HabitListTab from "./HabitListTab";
import CategoryTab from "./CategoryTab";

export default function AdminHabitTabs() {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="bulk">Bulk Insert</TabsTrigger>
        <TabsTrigger value="list">Habit List</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="bulk">
        <BulkInsertTab />
      </TabsContent>
      <TabsContent value="list">
        <HabitListTab />
      </TabsContent>
      <TabsContent value="categories">
        <CategoryTab />
      </TabsContent>
    </Tabs>
  );
}
