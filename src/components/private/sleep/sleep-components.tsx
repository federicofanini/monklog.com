"use client";

import { useState } from "react";
import {
  addSleepRecord,
  updateSleepRecord,
  type SleepData,
} from "../../../packages/database/user/sleep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Moon, Sun, Clock, Calendar } from "lucide-react";

interface SleepLogFormProps {
  onSuccess?: () => void;
  initialData?: SleepData & { id?: string };
}

// Convert minutes to hours and minutes for display
const minutesToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return {
    hours: hours.toString(),
    minutes: mins.toString().padStart(2, "0"),
  };
};

// Convert hours and minutes to total minutes
const hoursAndMinutesToMinutes = (hours: string, minutes: string) => {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  return h * 60 + m;
};

export function SleepLogForm({ onSuccess, initialData }: SleepLogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SleepData>({
    sleep_start: initialData?.sleep_start || new Date(),
    sleep_end: initialData?.sleep_end || new Date(),
    sleep_score: initialData?.sleep_score || 0,
    rem_sleep: initialData?.rem_sleep || 0,
    deep_sleep: initialData?.deep_sleep || 0,
    time_in_bed: initialData?.time_in_bed || 0,
    time_to_sleep: initialData?.time_to_sleep || 0,
  });

  // State for hours inputs
  const [timeInputs, setTimeInputs] = useState({
    rem_sleep: minutesToHoursAndMinutes(formData.rem_sleep),
    deep_sleep: minutesToHoursAndMinutes(formData.deep_sleep),
    time_in_bed: minutesToHoursAndMinutes(formData.time_in_bed),
    time_to_sleep: minutesToHoursAndMinutes(formData.time_to_sleep),
  });

  const handleDateChange = (
    field: "sleep_start" | "sleep_end",
    date: string
  ) => {
    const currentTime = formData[field].toTimeString().split(" ")[0];
    setFormData({
      ...formData,
      [field]: new Date(`${date}T${currentTime}`),
    });
  };

  const handleTimeChange = (
    field: "sleep_start" | "sleep_end",
    time: string
  ) => {
    const currentDate = formData[field].toISOString().split("T")[0];
    setFormData({
      ...formData,
      [field]: new Date(`${currentDate}T${time}`),
    });
  };

  const handleHoursChange = (
    field: "rem_sleep" | "deep_sleep" | "time_in_bed" | "time_to_sleep",
    type: "hours" | "minutes",
    value: string
  ) => {
    // Ensure value is a valid number or empty string
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    setTimeInputs((prev) => {
      const newInputs = {
        ...prev,
        [field]: {
          ...prev[field],
          [type]: sanitizedValue,
        },
      };

      // Update form data with total minutes
      setFormData((prevForm) => ({
        ...prevForm,
        [field]: hoursAndMinutesToMinutes(
          newInputs[field].hours,
          newInputs[field].minutes
        ),
      }));

      return newInputs;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData?.id) {
        result = await updateSleepRecord(initialData.id, formData);
      } else {
        result = await addSleepRecord(formData);
      }

      if (result.success) {
        toast.success(
          initialData?.id
            ? "Sleep record updated successfully"
            : "Sleep record added successfully"
        );
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save sleep record");
      }
    } catch (error) {
      console.error("Failed to save sleep record:", error);
      toast.error("Failed to save sleep record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-black">
      <ScrollArea className="flex-1 px-3 sm:px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <div className="space-y-1">
            <div className="font-mono text-xs text-red-500 uppercase tracking-wider">
              SLEEP LOG
            </div>
            <div className="font-mono text-base sm:text-lg text-white/80">
              Record your sleep metrics
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-red-500/20 pl-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs text-white/60">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    SLEEP START DATE
                  </Label>
                  <Input
                    type="date"
                    value={formData.sleep_start.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleDateChange("sleep_start", e.target.value)
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs text-white/60">
                    <Moon className="h-4 w-4 inline mr-2" />
                    SLEEP START TIME
                  </Label>
                  <Input
                    type="time"
                    value={formData.sleep_start.toTimeString().split(" ")[0]}
                    onChange={(e) =>
                      handleTimeChange("sleep_start", e.target.value)
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs text-white/60">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    SLEEP END DATE
                  </Label>
                  <Input
                    type="date"
                    value={formData.sleep_end.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleDateChange("sleep_end", e.target.value)
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs text-white/60">
                    <Sun className="h-4 w-4 inline mr-2" />
                    SLEEP END TIME
                  </Label>
                  <Input
                    type="time"
                    value={formData.sleep_end.toTimeString().split(" ")[0]}
                    onChange={(e) =>
                      handleTimeChange("sleep_end", e.target.value)
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  SLEEP SCORE (0-100)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sleep_score.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sleep_score: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  TIME TO SLEEP
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.time_to_sleep.hours}
                      onChange={(e) =>
                        handleHoursChange(
                          "time_to_sleep",
                          "hours",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      HRS
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.time_to_sleep.minutes}
                      onChange={(e) =>
                        handleHoursChange(
                          "time_to_sleep",
                          "minutes",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="00"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      MIN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  REM SLEEP
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.rem_sleep.hours}
                      onChange={(e) =>
                        handleHoursChange("rem_sleep", "hours", e.target.value)
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      HRS
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.rem_sleep.minutes}
                      onChange={(e) =>
                        handleHoursChange(
                          "rem_sleep",
                          "minutes",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="00"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      MIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  DEEP SLEEP
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.deep_sleep.hours}
                      onChange={(e) =>
                        handleHoursChange("deep_sleep", "hours", e.target.value)
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      HRS
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.deep_sleep.minutes}
                      onChange={(e) =>
                        handleHoursChange(
                          "deep_sleep",
                          "minutes",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="00"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      MIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  TIME IN BED
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.time_in_bed.hours}
                      onChange={(e) =>
                        handleHoursChange(
                          "time_in_bed",
                          "hours",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      HRS
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={timeInputs.time_in_bed.minutes}
                      onChange={(e) =>
                        handleHoursChange(
                          "time_in_bed",
                          "minutes",
                          e.target.value
                        )
                      }
                      className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                      placeholder="00"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                      MIN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full h-10 transition-colors font-mono text-xs ${
              isLoading ? "bg-red-500/50" : "bg-red-500/80 hover:bg-red-500"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            {initialData?.id ? "UPDATE SLEEP LOG" : "SAVE SLEEP LOG"}
          </Button>
        </form>
      </ScrollArea>
    </div>
  );
}
