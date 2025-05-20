export interface Achievement {
  name: string;
  description: string;
  points: number;
  icon: string;
  unlockedAt?: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon_url?: string;
}

export interface GamificationResult {
  experienceGained: number;
  newLevel?: number;
  achievements?: Achievement[];
}
