"use client";

import { useState, useEffect } from "react";
import {
  getAvailableRewards,
  claimReward,
} from "@/packages/database/user/habits";
import type {
  Achievement,
  Reward,
  GamificationResult,
} from "@/packages/shared/types/gamification";

interface GamificationState {
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  availableRewards: Reward[];
  unlockedAchievements: Achievement[];
}

const DEFAULT_STATE: GamificationState = {
  level: 1,
  experiencePoints: 0,
  nextLevelPoints: 1000,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [
    {
      name: "7-Day Warrior",
      description: "Completed all habits for 7 days straight",
      points: 100,
      icon: "⚡️",
    },
    {
      name: "Early Riser",
      description: "Woke up before 6:30 AM for 5 days",
      points: 50,
      icon: "🌊",
    },
    {
      name: "Focus Master",
      description: "Completed 4+ hours of deep work for 3 days",
      points: 75,
      icon: "🎯",
    },
    {
      name: "Discipline Master",
      description: "No bad habits for 10 days straight",
      points: 150,
      icon: "💪",
    },
  ],
  availableRewards: [],
  unlockedAchievements: [],
};

export function useGamification(userId: string | undefined) {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  // Load initial gamification data
  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      if (!userId) {
        console.error("No user ID provided");
        return;
      }
      const rewards = await getAvailableRewards(userId);
      setState((prev) => ({
        ...prev,
        availableRewards: rewards.map((r) => ({
          ...r,
          icon_url: r.icon_url || undefined,
        })),
      }));
    } catch (error) {
      console.error("Error loading gamification data:", error);
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      const claimedReward = await claimReward(userId, rewardId);
      // Update state after claiming reward
      setState((prev) => ({
        ...prev,
        experiencePoints: prev.experiencePoints - claimedReward.cost,
        availableRewards: prev.availableRewards.filter(
          (r) => r.id !== rewardId
        ),
      }));
      return {
        ...claimedReward,
        icon_url: claimedReward.icon_url || undefined,
      };
    } catch (error) {
      console.error("Error claiming reward:", error);
      throw error;
    }
  };

  const updateGamificationState = (result: GamificationResult) => {
    setState((prev) => {
      const newXP = prev.experiencePoints + result.experienceGained;
      const newLevel = result.newLevel || prev.level;
      const nextLevelPoints = newLevel * 1000;

      return {
        ...prev,
        experiencePoints: newXP,
        level: newLevel,
        nextLevelPoints,
        unlockedAchievements: [
          ...prev.unlockedAchievements,
          ...(result.achievements || []),
        ],
      };
    });
  };

  return {
    ...state,
    claimReward: handleClaimReward,
    updateGamification: updateGamificationState,
  };
}
