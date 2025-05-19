"use client";

import { useEffect, useState, useTransition } from "react";
import { getCategories } from "@/packages/database/admin/habit/category";
import type { HabitCategory } from "@/packages/database/admin/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createHabit } from "@/packages/database/admin/habit/createHabit";

export default function BulkInsertTab() {
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [bulkText, setBulkText] = useState("");
  const [bulkCategoryId, setBulkCategoryId] = useState<string>("");
  const [bulkOrder, setBulkOrder] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      if (data.length > 0 && !bulkCategoryId) setBulkCategoryId(data[0].id);
    });
  }, [bulkCategoryId]);

  function toSnakeCase(str: string) {
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/\s+/g, "_")
      .replace(/-+/g, "_")
      .toLowerCase();
  }

  const handleBulkInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      toast.error("Please enter at least one habit.");
      return;
    }
    if (!bulkCategoryId) {
      toast.error("Please select a category.");
      return;
    }
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast.error("No valid habits found.");
      return;
    }
    startTransition(async () => {
      let successCount = 0;
      let errorCount = 0;
      for (const label of lines) {
        const name = toSnakeCase(label);
        const res = await createHabit({
          name,
          categoryId: bulkCategoryId,
          order: bulkOrder,
        });
        if (res.error) {
          errorCount++;
        } else {
          successCount++;
        }
      }
      if (successCount > 0) toast.success(`${successCount} habits created!`);
      if (errorCount > 0) toast.error(`${errorCount} habits failed to create.`);
      setBulkText("");
      setBulkOrder(0);
    });
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleBulkInsert}>
        <CardHeader>
          <CardTitle>Bulk Insert Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-habits">Habits (one per line)</Label>
            <textarea
              id="bulk-habits"
              className="w-full border rounded p-2 min-h-[120px]"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Wake up early\nTrain\nRead a book"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-category">Category</Label>
            <Select value={bulkCategoryId} onValueChange={setBulkCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-order">Order (optional, default 0)</Label>
            <Input
              id="bulk-order"
              type="number"
              value={bulkOrder}
              onChange={(e) => setBulkOrder(Number(e.target.value))}
              min={0}
            />
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Button type="submit" disabled={isPending} className="w-full">
            Bulk Insert
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
