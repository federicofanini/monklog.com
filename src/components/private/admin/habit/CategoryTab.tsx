"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/packages/database/admin/habit/category";
import type { HabitCategory } from "@/packages/database/admin/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function CategoryTab() {
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCategory({ name, description });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Category created!");
        setName("");
        setDescription("");
        fetchCategories();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="mb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Mind & Discipline"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Category"}
          </Button>
        </form>
        <div>
          <h3 className="font-semibold mb-2">All Categories</h3>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found.
            </div>
          ) : (
            <ul className="divide-y">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cat.description}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cat.id)}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
