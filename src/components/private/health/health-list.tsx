"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart, Edit, Trash2, Loader2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Health } from "@prisma/client";
import {
  getHealthRecords,
  deleteHealthRecord,
} from "@/packages/database/user/health";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HealthListProps {
  onEdit?: (record: Health & { id: string }) => void;
  onDataChange?: () => void;
}

export function HealthList({ onEdit, onDataChange }: HealthListProps) {
  const [healthRecords, setHealthRecords] = useState<
    (Health & { id: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const result = await getHealthRecords();
      if (result.success && result.data) {
        setHealthRecords(result.data);
      } else {
        toast.error(result.error || "Failed to fetch health records");
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast.error("Failed to fetch health records");
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
      const result = await deleteHealthRecord(recordToDelete);
      if (result.success) {
        toast.success("Health record deleted successfully");
        await fetchRecords();
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
        onDataChange?.();
      } else {
        toast.error(result.error || "Failed to delete health record");
      }
    } catch (error) {
      console.error("Error deleting health record:", error);
      toast.error("Failed to delete health record");
    }
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
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
          {healthRecords.map((record) => (
            <div
              key={record.id}
              className="border border-red-500/20 rounded-lg p-4 space-y-3 bg-black/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-mono text-xs text-white/60">
                    {format(new Date(record.created_at), "MMM dd, yyyy HH:mm")}
                  </span>
                  <span
                    className={`font-mono text-xs px-2 py-1 rounded ${
                      record.daily_mood === "GREAT"
                        ? "bg-green-500/20 text-green-500"
                        : record.daily_mood === "GOOD"
                        ? "bg-blue-500/20 text-blue-500"
                        : record.daily_mood === "OK"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : record.daily_mood === "BAD"
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {record.daily_mood}
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
                    style={{
                      width: `${
                        ((record.cardio +
                          record.daily_light +
                          record.daily_strength) /
                          180) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="font-mono text-xs text-white/60">
                  {record.steps} steps
                </span>
              </div>

              {expandedId === record.id && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-red-500/20">
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      ACTIVITIES
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-sm text-white/80">
                        Cardio: {formatDuration(record.cardio)}
                      </div>
                      <div className="font-mono text-sm text-white/80">
                        Light: {formatDuration(record.daily_light)}
                      </div>
                      <div className="font-mono text-sm text-white/80">
                        Strength: {formatDuration(record.daily_strength)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      CONSUMPTION
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-sm text-white/80">
                        Water: {record.water}ml
                      </div>
                      <div className="font-mono text-sm text-white/80">
                        Caffeine: {record.caffeine}mg
                      </div>
                      <div className="font-mono text-sm text-white/80">
                        Alcohol: {record.alcohol}g
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">OTHER</div>
                    <div className="font-mono text-sm text-white/80">
                      Cigarettes: {record.sigarettes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {healthRecords.length === 0 && (
            <div className="text-center py-8">
              <div className="font-mono text-sm text-white/40">
                No health records found
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-red-500/20">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg text-white/90">
              Delete Health Record
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-white/60">
              Are you sure you want to delete this health record? This action
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
