"use client";

import { useEffect, useState, useTransition } from "react";
import { getHabits } from "@/packages/database/admin/habit/getHabits";
import { deleteHabit } from "@/packages/database/admin/habit/deleteHabit";
import type { Habit } from "@/packages/database/admin/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HabitListTab() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchHabits = async () => {
    setLoading(true);
    const data = await getHabits();
    setHabits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteHabit(id);
      if (res.success) {
        toast.success("Habit deleted");
        fetchHabits();
      } else {
        toast.error(res.error || "Failed to delete habit");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Habits</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading habits...
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No habits found.
          </div>
        ) : (
          <ul className="divide-y">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="font-medium">{habit.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {habit.category?.name || "No category"} &middot; Order:{" "}
                    {habit.order}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(habit.id)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
