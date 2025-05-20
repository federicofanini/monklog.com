"use server";

import { prisma } from "../prisma";
import { createUser } from "./create-user";
import { updateUserSettings } from "./profile";
import { updateMentorPreference } from "./mentor";
import { MentorPersona, User } from "@prisma/client";

interface OnboardUserResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export type OnboardUserInput = {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  mentor?: MentorPersona;
  commitment?: "warrior" | "monk" | "ghost";
};

// Default habits aligned with the military-grade mentoring concept
const DEFAULT_HABITS = [
  {
    name: "Wake Early",
    categoryName: "Physical",
    icon: "🌅",
    isRelapsable: true,
    timeBlock: "morning",
    minutes: 0,
    criteria: "Wake up at 5 AM sharp. No excuses.",
    order: 1,
  },
  {
    name: "Cold Shower",
    categoryName: "Physical",
    icon: "🚿",
    isRelapsable: false,
    timeBlock: "morning",
    minutes: 3,
    criteria: "3 minutes. Ice cold. Full immersion.",
    order: 2,
  },
  {
    name: "Deep Work",
    categoryName: "Mission",
    icon: "⚔️",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 240,
    criteria: "4 hours of focused, uninterrupted work on your mission.",
    order: 3,
  },
  {
    name: "No Social",
    categoryName: "Mental",
    icon: "📵",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 0,
    criteria: "Zero social media. Zero scrolling. Zero excuses.",
    order: 4,
  },
  {
    name: "Training",
    categoryName: "Physical",
    icon: "💪",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 60,
    criteria: "1 hour of intense physical training.",
    order: 5,
  },
];

export async function onboardUser(
  input: OnboardUserInput
): Promise<OnboardUserResponse> {
  try {
    // 1. Create the user
    const user = await createUser({
      id: input.id,
      email: input.email,
      full_name: input.full_name,
      avatar_url: input.avatar_url,
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    // 2. Set up default user settings - aligned with military-grade mentoring
    await updateUserSettings(user.id, {
      morningCheckinEnabled: true,
      eveningLogEnabled: true,
      mentorMessagesEnabled: true,
      aggressiveToneEnabled:
        input.mentor === MentorPersona.GHOST ||
        input.mentor === MentorPersona.WARRIOR,
      dailyChallengesEnabled: input.commitment === "warrior",
      publicProfile: false,
      shareProgress: false,
    });

    // 3. Set mentor persona based on selection or default to GHOST
    await updateMentorPreference(user.id, {
      persona: input.mentor || MentorPersona.GHOST,
    });

    // 4. Create default habit categories if they don't exist
    const categories = await Promise.all(
      ["Physical", "Mental", "Mission"].map((name) =>
        prisma.habitCategory.upsert({
          where: { name },
          create: {
            name,
            description: `${name} habits for mental toughness`,
          },
          update: {},
        })
      )
    );

    // Create a map of category names to IDs
    const categoryMap = categories.reduce<Record<string, string>>(
      (acc, cat) => {
        acc[cat.name] = cat.id;
        return acc;
      },
      {}
    );

    // 5. Create habits based on commitment level
    const habitsToCreate = DEFAULT_HABITS.slice(
      0,
      input.commitment === "ghost" ? 1 : input.commitment === "monk" ? 3 : 5
    );

    await Promise.all(
      habitsToCreate.map((habit) =>
        prisma.habit.create({
          data: {
            name: habit.name,
            categoryId: categoryMap[habit.categoryName],
            icon: habit.icon,
            is_relapsable: habit.isRelapsable,
            time_block: habit.timeBlock,
            minutes: habit.minutes,
            criteria: habit.criteria,
            order: habit.order,
          },
        })
      )
    );

    // 6. Create initial mission
    const mission = await prisma.mission.create({
      data: {
        name: "30 Days of Dawn",
        description:
          "Wake up at 5 AM for 30 consecutive days. This is your first test of will.",
        duration_days: 30,
        icon: "🌅",
      },
    });

    await prisma.userMission.create({
      data: {
        userId: user.id,
        missionId: mission.id,
      },
    });

    // 7. Create and assign first achievement
    const achievement = await prisma.achievement.create({
      data: {
        name: "First Blood",
        description: "Begin your journey to mental toughness",
        icon: "🩸",
        points: 100,
        condition: JSON.stringify({ type: "ONBOARDING_COMPLETE" }),
      },
    });

    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId: achievement.id,
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Error onboarding user:", error);
    return {
      success: false,
      error: "Failed to complete user onboarding",
    };
  }
}
