"use client";

import { useState, useCallback } from "react";
import { FoodLogForm } from "./food-components";
import { FoodList } from "./food-list";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/private/back-button";
import { Plus, X } from "lucide-react";
import type { Food } from "@prisma/client";

export function FoodPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<
    (Food & { id: string }) | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = useCallback((record: Food & { id: string }) => {
    setEditingRecord(record);
    setIsFormVisible(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setIsFormVisible(false);
    setEditingRecord(null);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleDataChange = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="bg-black py-18">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-2">
          <BackButton href="/profile" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-lg text-white/90">
              Nutrition Tracker
            </h1>
            <p className="font-mono text-sm text-white/60">
              Monitor your nutrition and food quality
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRecord(null);
              setIsFormVisible(!isFormVisible);
            }}
            className={`transition-colors font-mono text-xs ${
              isFormVisible
                ? "bg-red-500/20 hover:bg-red-500/30"
                : "bg-red-500/80 hover:bg-red-500"
            }`}
          >
            {isFormVisible ? (
              <>
                <X className="h-4 w-4 mr-2" />
                CLOSE
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                NEW ENTRY
              </>
            )}
          </Button>
        </div>

        {isFormVisible && (
          <div className="mb-8">
            <FoodLogForm
              onSuccess={handleFormSuccess}
              initialData={editingRecord || undefined}
            />
          </div>
        )}

        <FoodList
          key={refreshKey}
          onEdit={handleEdit}
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
}
