import { MentorPersona } from "@prisma/client";

export interface DailyLogInput {
  note: string;
  moodScore: number;
  habitIds: string[];
  relapseIds: string[];
}

export interface UserSettingsInput {
  morningCheckinEnabled: boolean;
  eveningLogEnabled: boolean;
  mentorMessagesEnabled: boolean;
  aggressiveToneEnabled: boolean;
  dailyChallengesEnabled: boolean;
  publicProfile: boolean;
  shareProgress: boolean;
}

export interface MentorPreferenceInput {
  persona: MentorPersona;
}
