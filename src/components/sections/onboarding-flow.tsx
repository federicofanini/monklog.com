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
    name: "THE GHOST",
    description:
      "Silent assassin. Ruthless efficiency. No motivation needed, just pure execution.",
    style: "bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/50",
  },
  {
    id: MentorPersona.WARRIOR,
    name: "THE MARINE",
    description:
      "Drill sergeant from hell. Zero tolerance for weakness. Maximum intensity.",
    style: "bg-gradient-to-br from-red-900 to-red-800 border-red-700/50",
  },
  {
    id: MentorPersona.MONK,
    name: "THE WARLORD",
    description:
      "Strategic commander. Brutal wisdom. Forges mental steel through ancient discipline.",
    style: "bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700/50",
  },
  {
    id: MentorPersona.SHADOW,
    name: "THE SHADOW",
    description:
      "Special forces operator. Silent killer of mediocrity. Tactical precision in all things.",
    style:
      "bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700/50",
  },
];

const COMMITMENT_LEVELS = [
  {
    id: "warrior",
    name: "WARRIOR MODE",
    description:
      "5 core habits. Daily missions. Maximum pressure. For the elite 1%.",
    habits: 5,
  },
  {
    id: "monk",
    name: "MONK MODE",
    description:
      "3 foundational habits. Weekly challenges. Intense but focused.",
    habits: 3,
  },
  {
    id: "ghost",
    name: "GHOST MODE",
    description: "1 critical habit. Monthly targets. Pure, lethal focus.",
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

      toast.success("Welcome to the crucible", {
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
    <div className="space-y-8 max-w-4xl mx-auto px-6 py-12 bg-black text-white">
      {/* Step 1: Choose Mentor */}
      {step === 1 && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter">
              CHOOSE YOUR DRILL SERGEANT
            </h2>
            <p className="text-red-500 font-mono">
              Select your master. Choose wisely. There is no easy path.
            </p>
          </div>

          <div className="grid gap-4">
            {MENTOR_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className={`p-6 border cursor-pointer transition-all ${
                  persona.style
                } ${
                  selectedMentor === persona.id
                    ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "border-transparent hover:border-red-500/50"
                }`}
                onClick={() => setSelectedMentor(persona.id)}
              >
                <h3 className="text-xl font-bold font-mono mb-2">
                  {persona.name}
                </h3>
                <p className="text-white/60 font-mono text-sm">
                  {persona.description}
                </p>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600 h-12 font-mono tracking-wider"
            disabled={!selectedMentor}
            onClick={() => setStep(2)}
          >
            CONFIRM SELECTION
          </Button>
        </div>
      )}

      {/* Step 2: Choose Commitment Level */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter">
              SET YOUR INTENSITY
            </h2>
            <p className="text-red-500 font-mono">
              Choose your battle rhythm. Each path demands total commitment.
            </p>
          </div>

          <div className="grid gap-4">
            {COMMITMENT_LEVELS.map((level) => (
              <div
                key={level.id}
                className={`p-6 border cursor-pointer transition-all bg-black ${
                  selectedCommitment === level.id
                    ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    : "border-red-500/20 hover:border-red-500/50"
                }`}
                onClick={() => setSelectedCommitment(level.id)}
              >
                <h3 className="text-xl font-bold font-mono mb-2">
                  {level.name}
                </h3>
                <p className="text-white/60 font-mono text-sm">
                  {level.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 font-mono tracking-wider border-red-500/20 text-white hover:bg-red-500/10"
              onClick={() => setStep(1)}
            >
              BACK
            </Button>
            <Button
              className="h-12 font-mono tracking-wider bg-red-500 hover:bg-red-600"
              disabled={!selectedCommitment || loading}
              onClick={handleComplete}
            >
              {loading ? "INITIALIZING..." : "BEGIN TRAINING"}
            </Button>
          </div>

          <p className="text-center text-white/40 font-mono text-sm">
            There is no turning back after this point.
            <br />
            Your transformation begins now.
          </p>
        </div>
      )}
    </div>
  );
}
