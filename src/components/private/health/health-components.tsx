"use client";

import { useState } from "react";
import {
  addHealthRecord,
  updateHealthRecord,
  type HealthData,
} from "../../../packages/database/user/health";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mood } from "@prisma/client";

interface HealthLogFormProps {
  onSuccess?: () => void;
  initialData?: HealthData & { id?: string };
}

export function HealthLogForm({ onSuccess, initialData }: HealthLogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<HealthData>({
    water: initialData?.water || 0,
    steps: initialData?.steps || 0,
    cardio: initialData?.cardio || 0,
    daily_light: initialData?.daily_light || 0,
    daily_strength: initialData?.daily_strength || 0,
    daily_mood: initialData?.daily_mood || "OK",
    caffeine: initialData?.caffeine || 0,
    alcohol: initialData?.alcohol || 0,
    sigarettes: initialData?.sigarettes || 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData?.id) {
        result = await updateHealthRecord(initialData.id, formData);
      } else {
        result = await addHealthRecord(formData);
      }

      if (result.success) {
        toast.success(
          initialData?.id
            ? "Health record updated successfully"
            : "Health record added successfully"
        );
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save health record");
      }
    } catch (error) {
      console.error("Failed to save health record:", error);
      toast.error("Failed to save health record");
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
              HEALTH LOG
            </div>
            <div className="font-mono text-base sm:text-lg text-white/80">
              Record your daily health metrics
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-red-500/20 pl-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  DAILY MOOD
                </Label>
                <Select
                  value={formData.daily_mood}
                  onValueChange={(value: Mood) =>
                    setFormData({ ...formData, daily_mood: value })
                  }
                >
                  <SelectTrigger className="bg-black/40 border-red-500/20 font-mono text-sm">
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-500/20">
                    {Object.values(Mood).map((mood) => (
                      <SelectItem
                        key={mood}
                        value={mood}
                        className="font-mono text-sm"
                      >
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">STEPS</Label>
                <Input
                  type="number"
                  value={formData.steps}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      steps: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  CARDIO (MIN)
                </Label>
                <Input
                  type="number"
                  value={formData.cardio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardio: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  LIGHT ACTIVITY (MIN)
                </Label>
                <Input
                  type="number"
                  value={formData.daily_light}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      daily_light: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  STRENGTH (MIN)
                </Label>
                <Input
                  type="number"
                  value={formData.daily_strength}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      daily_strength: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  WATER (ML)
                </Label>
                <Input
                  type="number"
                  value={formData.water}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      water: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  CAFFEINE (MG)
                </Label>
                <Input
                  type="number"
                  value={formData.caffeine}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caffeine: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  ALCOHOL (G)
                </Label>
                <Input
                  type="number"
                  value={formData.alcohol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alcohol: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-xs text-white/60">
                CIGARETTES
              </Label>
              <Input
                type="number"
                value={formData.sigarettes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sigarettes: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-black/40 border-red-500/20 font-mono text-sm"
                placeholder="0"
              />
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
              <Heart className="h-4 w-4 mr-2" />
            )}
            {initialData?.id ? "UPDATE HEALTH LOG" : "SAVE HEALTH LOG"}
          </Button>
        </form>
      </ScrollArea>
    </div>
  );
}
