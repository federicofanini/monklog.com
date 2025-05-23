"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Apple, Edit, Trash2, Loader2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Food } from "@prisma/client";
import {
  getFoodRecords,
  deleteFoodRecord,
} from "@/packages/database/user/food";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FoodListProps {
  onEdit?: (record: Food & { id: string }) => void;
  onDataChange?: () => void;
}

export function FoodList({ onEdit, onDataChange }: FoodListProps) {
  const [foodRecords, setFoodRecords] = useState<(Food & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const result = await getFoodRecords();
      if (result.success && result.data) {
        setFoodRecords(result.data);
      } else {
        toast.error(result.error || "Failed to fetch food records");
      }
    } catch (error) {
      console.error("Error fetching food records:", error);
      toast.error("Failed to fetch food records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      const result = await deleteFoodRecord(recordToDelete);
      if (result.success) {
        toast.success("Food record deleted successfully");
        await fetchRecords();
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
        onDataChange?.();
      } else {
        toast.error(result.error || "Failed to delete food record");
      }
    } catch (error) {
      console.error("Error deleting food record:", error);
      toast.error("Failed to delete food record");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-red-500/50" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[500px] w-full">
        <div className="space-y-4 p-4">
          {foodRecords.map((record) => (
            <div
              key={record.id}
              className="border border-red-500/20 rounded-lg p-4 space-y-3 bg-black/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Apple className="h-4 w-4 text-red-500" />
                  <span className="font-mono text-xs text-white/60">
                    {format(new Date(record.created_at), "MMM dd, yyyy HH:mm")}
                  </span>
                  <span className="font-mono text-xs text-white/60 ml-2">
                    {record.calories} kcal
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(record)}
                      className="h-8 px-2 text-white/60 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(record.id)}
                    className="h-8 px-2 text-red-500/60 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === record.id ? null : record.id)
                    }
                    className="h-8 px-2"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedId === record.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${record.food_quality}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-white/60">
                  Quality: {record.food_quality}
                </span>
              </div>

              {expandedId === record.id && (
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-red-500/20">
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">CARBS</div>
                    <div className="font-mono text-sm text-white/80">
                      {record.carbs}g
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      PROTEIN
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {record.protein}g
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">FAT</div>
                    <div className="font-mono text-sm text-white/80">
                      {record.fat}g
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {foodRecords.length === 0 && (
            <div className="text-center py-8">
              <div className="font-mono text-sm text-white/40">
                No food records found
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-red-500/20">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg text-white/90">
              Delete Food Record
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-white/60">
              Are you sure you want to delete this food record? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="font-mono text-xs text-white/60"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="font-mono text-xs bg-red-500/80 hover:bg-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
