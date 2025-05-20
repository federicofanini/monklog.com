"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateHabitsInput } from "@/app/(private)/(users)/monk/habits/actions";

interface GeneratorResult {
  habits: {
    id: string;
    name: string;
    categoryId: string;
    icon: string | null;
    is_relapsable: boolean;
    order: number;
  }[];
  explanation: string;
}

export function HabitGenerator({ onGenerated }: { onGenerated?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState<string>("");
  const [result, setResult] = useState<GeneratorResult | null>(null);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setStreamedText("");
    setResult(null);

    try {
      // Parse form data
      const goals =
        formData
          .get("goals")
          ?.toString()
          .split(",")
          .map((g) => g.trim()) || [];
      const timeCommitment = formData.get("timeCommitment")?.toString();
      const constraints =
        formData
          .get("constraints")
          ?.toString()
          .split(",")
          .map((c) => c.trim()) || [];

      const input: GenerateHabitsInput = {
        goals,
        timeCommitment,
        constraints: constraints.filter(Boolean),
      };

      // Start the streaming response
      const response = await fetch("/api/habits/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to generate habits");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available");
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and update the UI
        const text = new TextDecoder().decode(value);
        setStreamedText((prev) => prev + text);
      }

      // Parse the final response
      const jsonResponse = await response.json();
      if (!jsonResponse.success) {
        throw new Error(jsonResponse.error);
      }

      setResult({
        habits: jsonResponse.habits,
        explanation: jsonResponse.explanation,
      });

      onGenerated?.();
    } catch (err) {
      console.error("Error generating habits:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate habits"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6 bg-black/40">
      <form action={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-mono text-red-500">GENERATE HABITS</h3>
          <p className="text-sm text-muted-foreground">
            Let the AI mentor design a strategic habit system based on your
            goals and constraints.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="goals" className="block text-sm font-medium mb-2">
              Goals (comma-separated)
            </label>
            <Textarea
              id="goals"
              name="goals"
              placeholder="Build mental toughness, Improve focus, Physical strength"
              className="bg-black/60"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="timeCommitment"
              className="block text-sm font-medium mb-2"
            >
              Daily Time Commitment
            </label>
            <Input
              type="text"
              id="timeCommitment"
              name="timeCommitment"
              placeholder="e.g. 2 hours per day"
              className="bg-black/60"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="constraints"
              className="block text-sm font-medium mb-2"
            >
              Constraints (comma-separated)
            </label>
            <Textarea
              id="constraints"
              name="constraints"
              placeholder="Full-time job, Early riser, Limited equipment"
              className="bg-black/60"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        {streamedText && (
          <div className="text-sm text-muted-foreground font-mono border border-white/10 rounded-md p-4 bg-black/20">
            {streamedText}
          </div>
        )}

        {result && (
          <div className="space-y-4 border-t border-white/10 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Generated Habits</h4>
              <div className="space-y-2">
                {result.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{habit.icon}</span>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.explanation}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Strategic Habits"}
        </Button>
      </form>
    </Card>
  );
}
