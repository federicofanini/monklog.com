"use client";

import { useState } from "react";
import {
  addFoodRecord,
  updateFoodRecord,
  type FoodData,
} from "../../../packages/database/user/food";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Apple } from "lucide-react";

interface FoodLogFormProps {
  onSuccess?: () => void;
  initialData?: FoodData & { id?: string };
}

export function FoodLogForm({ onSuccess, initialData }: FoodLogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FoodData>({
    carbs: initialData?.carbs || 0,
    protein: initialData?.protein || 0,
    fat: initialData?.fat || 0,
    calories: initialData?.calories || 0,
    food_quality: initialData?.food_quality || 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData?.id) {
        result = await updateFoodRecord(initialData.id, formData);
      } else {
        result = await addFoodRecord(formData);
      }

      if (result.success) {
        toast.success(
          initialData?.id
            ? "Food record updated successfully"
            : "Food record added successfully"
        );
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save food record");
      }
    } catch (error) {
      console.error("Failed to save food record:", error);
      toast.error("Failed to save food record");
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
              FOOD LOG
            </div>
            <div className="font-mono text-base sm:text-lg text-white/80">
              Record your nutrition metrics
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-red-500/20 pl-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  CALORIES
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calories: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm pr-12"
                    placeholder="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    KCAL
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  FOOD QUALITY (0-100)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.food_quality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      food_quality: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-black/40 border-red-500/20 font-mono text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">CARBS</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        carbs: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm pr-8"
                    placeholder="0"
                    step="0.1"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    g
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">
                  PROTEIN
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.protein}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        protein: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm pr-8"
                    placeholder="0"
                    step="0.1"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    g
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-white/60">FAT</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.fat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fat: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/40 border-red-500/20 font-mono text-sm pr-8"
                    placeholder="0"
                    step="0.1"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    g
                  </span>
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
              <Apple className="h-4 w-4 mr-2" />
            )}
            {initialData?.id ? "UPDATE FOOD LOG" : "SAVE FOOD LOG"}
          </Button>
        </form>
      </ScrollArea>
    </div>
  );
}
