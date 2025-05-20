import { prisma } from "@/packages/database/prisma";

export interface UserContext {
  mentalToughnessScore: number;
  currentStreak: number;
  experiencePoints: number;
  level: number;
  mentorPersona: string;
}

export async function getUserContext(userId: string): Promise<UserContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      mental_toughness_score: true,
      current_streak: true,
      experience_points: true,
      level: true,
      current_mentor_persona: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    mentalToughnessScore: user.mental_toughness_score,
    currentStreak: user.current_streak,
    experiencePoints: user.experience_points,
    level: user.level,
    mentorPersona: user.current_mentor_persona,
  };
}
