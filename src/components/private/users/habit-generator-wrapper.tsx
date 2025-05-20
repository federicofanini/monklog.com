"use client";

import { useRouter } from "next/navigation";
import { HabitGenerator } from "./habit-generator";

export function HabitGeneratorWrapper() {
  const router = useRouter();

  return (
    <HabitGenerator
      onGenerated={() => {
        router.refresh();
      }}
    />
  );
}
