export type MentorPersona = "GHOST" | "WARRIOR" | "MONK" | "SHADOW";

export interface MentorResponse {
  truth: string;
  challenge: string;
  reflection?: string;
}

export interface MentorInput {
  userId: string;
  habitLogId: string;
  streak: number;
  habits: {
    name: string;
    completed: boolean;
    relapsed: boolean;
  }[];
  reflection?: string;
  persona: MentorPersona;
}

export interface MentorConfig {
  maxResponseLength: number;
  rateLimitPerDay: number;
  cacheTimeout: number; // in seconds
}

export type MentorPromptTemplate = {
  [K in MentorPersona]: string;
};

export interface MentorError {
  code: "RATE_LIMIT" | "INVALID_INPUT" | "PROCESSING_ERROR";
  message: string;
  details?: unknown;
}
