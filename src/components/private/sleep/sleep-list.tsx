"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Clock, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Sleep } from "@prisma/client";
import {
  getSleepRecords,
  deleteSleepRecord,
} from "@/packages/database/user/sleep";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SleepListProps {
  onEdit?: (record: Sleep & { id: string }) => void;
  onDataChange?: () => void;
}

export function SleepList({ onEdit, onDataChange }: SleepListProps) {
  const [sleepRecords, setSleepRecords] = useState<(Sleep & { id: string })[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const result = await getSleepRecords();
      if (result.success && result.data) {
        setSleepRecords(result.data);
      } else {
        toast.error(result.error || "Failed to fetch sleep records");
      }
    } catch (error) {
      console.error("Error fetching sleep records:", error);
      toast.error("Failed to fetch sleep records");
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
      const result = await deleteSleepRecord(recordToDelete);
      if (result.success) {
        toast.success("Sleep record deleted successfully");
        await fetchRecords();
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
        onDataChange?.();
      } else {
        toast.error(result.error || "Failed to delete sleep record");
      }
    } catch (error) {
      console.error("Error deleting sleep record:", error);
      toast.error("Failed to delete sleep record");
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
          {sleepRecords.map((record) => (
            <div
              key={record.id}
              className="border border-red-500/20 rounded-lg p-4 space-y-3 bg-black/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-red-500" />
                  <span className="font-mono text-xs text-white/60">
                    {format(new Date(record.sleep_start), "MMM dd, yyyy HH:mm")}
                  </span>
                  <Sun className="h-4 w-4 text-red-500 ml-2" />
                  <span className="font-mono text-xs text-white/60">
                    {format(new Date(record.sleep_end), "HH:mm")}
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
                    <Clock
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
                    style={{ width: `${record.sleep_score}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-white/60">
                  Score: {record.sleep_score}
                </span>
              </div>

              {expandedId === record.id && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-red-500/20">
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      REM SLEEP
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {formatDuration(record.rem_sleep)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      DEEP SLEEP
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {formatDuration(record.deep_sleep)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      TIME IN BED
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {formatDuration(record.time_in_bed)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-white/40">
                      TIME TO SLEEP
                    </div>
                    <div className="font-mono text-sm text-white/80">
                      {formatDuration(record.time_to_sleep)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {sleepRecords.length === 0 && (
            <div className="text-center py-8">
              <div className="font-mono text-sm text-white/40">
                No sleep records found
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black border border-red-500/20">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg text-white/90">
              Delete Sleep Record
            </DialogTitle>
            <DialogDescription className="font-mono text-sm text-white/60">
              Are you sure you want to delete this sleep record? This action
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
