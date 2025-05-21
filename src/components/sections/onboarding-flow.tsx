"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MentorPersona } from "@prisma/client";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/path";
import { completeOnboarding } from "@/app/(private)/(user)/onboarding/actions";
import { toast } from "sonner";

interface OnboardingFlowProps {
  userId: string;
}

interface OnboardingResult {
  success: boolean;
  error?: string;
}

const MENTOR_PERSONAS = [
  {
    id: MentorPersona.GHOST,
    name: "The Ghost",
    description:
      "Silent, poetic killer. Short, sharp truths. No motivation, just clarity.",
    style: "bg-gradient-to-br from-gray-900 to-gray-800",
  },
  {
    id: MentorPersona.WARRIOR,
    name: "The Marine",
    description:
      "Cold, hard drill sergeant focused on results and brutal honesty.",
    style: "bg-gradient-to-br from-red-900 to-red-800",
  },
  {
    id: MentorPersona.MONK,
    name: "The Monk",
    description:
      "Stoic warrior combining ancient wisdom with modern discipline.",
    style: "bg-gradient-to-br from-blue-900 to-blue-800",
  },
  {
    id: MentorPersona.SHADOW,
    name: "The CEO",
    description:
      "Strategic operator focused on metrics, execution, and long-term results.",
    style: "bg-gradient-to-br from-purple-900 to-purple-800",
  },
];

const COMMITMENT_LEVELS = [
  {
    id: "warrior",
    name: "Warrior Mode",
    description: "5 habits, aggressive tone, daily challenges",
    habits: 5,
  },
  {
    id: "monk",
    name: "Monk Mode",
    description: "3 habits, balanced approach, weekly challenges",
    habits: 3,
  },
  {
    id: "ghost",
    name: "Ghost Mode",
    description: "1 habit, pure focus, monthly challenges",
    habits: 1,
  },
] as const;

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<MentorPersona>();
  const [selectedCommitment, setSelectedCommitment] =
    useState<(typeof COMMITMENT_LEVELS)[number]["id"]>();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (!selectedMentor || !selectedCommitment) return;

    setLoading(true);
    try {
      const result = (await completeOnboarding(userId, {
        mentor: selectedMentor,
        commitment: selectedCommitment,
      })) as OnboardingResult;

      if (!result.success) {
        throw new Error(result.error || "Failed to complete onboarding");
      }

      toast.success("Welcome to MonkLog", {
        duration: 3000,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(paths.users.home);
      router.refresh();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding",
        {
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Choose Mentor */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Choose Your Mentor</h2>
          <div className="grid gap-4">
            {MENTOR_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  persona.style
                } ${
                  selectedMentor === persona.id
                    ? "ring-2 ring-red-500"
                    : "hover:ring-2 hover:ring-red-500/50"
                }`}
                onClick={() => setSelectedMentor(persona.id)}
              >
                <h3 className="font-bold">{persona.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {persona.description}
                </p>
              </div>
            ))}
          </div>
          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            disabled={!selectedMentor}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Choose Commitment Level */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Choose Your Commitment</h2>
          <div className="grid gap-4">
            {COMMITMENT_LEVELS.map((level) => (
              <div
                key={level.id}
                className={`p-4 rounded-lg cursor-pointer transition-all bg-black/40 ${
                  selectedCommitment === level.id
                    ? "ring-2 ring-red-500"
                    : "hover:ring-2 hover:ring-red-500/50"
                }`}
                onClick={() => setSelectedCommitment(level.id)}
              >
                <h3 className="font-bold">{level.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={!selectedCommitment || loading}
              onClick={handleComplete}
            >
              {loading ? "Setting Up..." : "Begin Training"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
