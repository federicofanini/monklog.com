"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateHabits, saveGeneratedHabits, deleteHabits } from "./actions";
import type { GeneratedHabit } from "@/packages/shared/types/habits";

export default function HabitGeneratorPage() {
  const [goals, setGoals] = useState<string[]>([""]);
  const [timeCommitment, setTimeCommitment] = useState("");
  const [constraints, setConstraints] = useState<string[]>([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHabits, setGeneratedHabits] = useState<GeneratedHabit[]>([]);
  const [explanation, setExplanation] = useState("");

  const handleAddGoal = () => {
    setGoals([...goals, ""]);
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleAddConstraint = () => {
    setConstraints([...constraints, ""]);
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleConstraintChange = (index: number, value: string) => {
    const newConstraints = [...constraints];
    newConstraints[index] = value;
    setConstraints(newConstraints);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const filteredGoals = goals.filter(Boolean);
      const filteredConstraints = constraints.filter(Boolean);

      if (filteredGoals.length === 0) {
        toast.error("Please add at least one goal");
        return;
      }

      const result = await generateHabits({
        goals: filteredGoals,
        timeCommitment,
        constraints: filteredConstraints,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to generate habits");
      }

      setGeneratedHabits(result.habits);
      setExplanation(result.explanation);
    } catch (error) {
      console.error("Error generating habits:", error);
      toast.error("Failed to generate habits. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveGeneratedHabits(generatedHabits);
      if (!result.success) {
        throw new Error(result.error || "Failed to save habits");
      }
      toast.success("Habits saved successfully");
      // Clear the form
      setGoals([""]);
      setTimeCommitment("");
      setConstraints([""]);
      setGeneratedHabits([]);
      setExplanation("");
    } catch (error) {
      console.error("Error saving habits:", error);
      toast.error("Failed to save habits. Please try again.");
    }
  };

  const handleReset = async () => {
    try {
      const result = await deleteHabits();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete habits");
      }
      toast.success("Habits reset successfully");
    } catch (error) {
      console.error("Error resetting habits:", error);
      toast.error("Failed to reset habits. Please try again.");
    }
  };

  return (
    <div className="container max-w-2xl py-18 space-y-8 mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Habit Generator</h1>
        <p className="text-muted-foreground">
          Let AI design a strategic habit system based on your goals and
          constraints.
        </p>
      </div>

      <Card className="p-6 bg-black/40 space-y-6">
        {/* Goals Section */}
        <div className="space-y-4">
          <h2 className="font-mono text-red-500">GOALS</h2>
          {goals.map((goal, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder="e.g., Build mental toughness"
                className="bg-black/40 border-red-500/20"
              />
              {goals.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveGoal(index)}
                  className="hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={handleAddGoal}
            className="w-full border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Time Commitment */}
        <div className="space-y-4">
          <h2 className="font-mono text-red-500">TIME COMMITMENT</h2>
          <Textarea
            value={timeCommitment}
            onChange={(e) => setTimeCommitment(e.target.value)}
            placeholder="Describe your available time (e.g., 2 hours in the morning, 1 hour in the evening)"
            className="bg-black/40 border-red-500/20 resize-none"
          />
        </div>

        {/* Constraints Section */}
        <div className="space-y-4">
          <h2 className="font-mono text-red-500">CONSTRAINTS</h2>
          {constraints.map((constraint, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={constraint}
                onChange={(e) => handleConstraintChange(index, e.target.value)}
                placeholder="e.g., Limited gym access"
                className="bg-black/40 border-red-500/20"
              />
              {constraints.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveConstraint(index)}
                  className="hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={handleAddConstraint}
            className="w-full border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Constraint
          </Button>
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full bg-red-500 hover:bg-red-600"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Habits"
          )}
        </Button>
      </Card>

      {/* Generated Habits */}
      {generatedHabits.length > 0 && (
        <Card className="p-6 bg-black/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-red-500">GENERATED HABITS</h2>
            <Button
              variant="outline"
              onClick={handleSave}
              className="border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
            >
              Save Habits
            </Button>
          </div>

          {explanation && (
            <p className="text-sm text-muted-foreground border-l-2 border-red-500/20 pl-4">
              {explanation}
            </p>
          )}

          <div className="space-y-4">
            {generatedHabits.map((habit, index) => (
              <div
                key={index}
                className="p-4 bg-black/60 rounded-lg border border-red-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{habit.icon}</div>
                    <div>
                      <h4 className="font-medium">{habit.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {habit.criteria}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {habit.category}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {habit.minutes} min • {habit.timeBlock}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reset Section */}
      <Card className="p-6 bg-black/40">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-red-500">NEED A RESET?</h3>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="bg-red-900 hover:bg-red-800 text-sm"
            >
              Delete All Habits
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Start fresh with a new set of habits. This will delete all your
            current habits and their history.
          </p>
        </div>
      </Card>
    </div>
  );
}
