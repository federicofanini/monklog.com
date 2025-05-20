import { ghostPrompt } from "./ghost";
import { monkPrompt } from "./monk";
import { marinePrompt } from "./marine";
import { ceoPrompt } from "./ceo";
import type {
  MentorInput,
  MentorResponse,
  MentorError,
  MentorPromptTemplate,
} from "@/packages/shared/types/mentor";
import {
  streamingCompletion,
  createSystemMessage,
  createUserMessage,
} from "../openai";
import { kv } from "@/packages/kv/redis";
import { prisma } from "@/packages/database/prisma";

const CACHE_PREFIX = "mentor:";
const DEFAULT_CACHE_TIMEOUT = 3600; // 1 hour
const MAX_RESPONSES_PER_DAY = 10;

const mentorPrompts: MentorPromptTemplate = {
  GHOST: ghostPrompt,
  MONK: monkPrompt,
  WARRIOR: marinePrompt,
  SHADOW: ceoPrompt,
};

export class MentorService {
  private async checkRateLimit(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split("T")[0];
    const key = `${CACHE_PREFIX}${userId}:${today}:count`;
    const count = await kv.incr(key);
    await kv.expire(key, 86400); // 24 hours
    return count <= MAX_RESPONSES_PER_DAY;
  }

  private getCacheKey(input: MentorInput): string {
    return `${CACHE_PREFIX}${input.userId}:${input.habitLogId}`;
  }

  private async getCachedResponse(key: string): Promise<MentorResponse | null> {
    return kv.get(key);
  }

  private async cacheResponse(
    key: string,
    response: MentorResponse
  ): Promise<void> {
    await kv.set(key, response, { ex: DEFAULT_CACHE_TIMEOUT });
  }

  public async generateResponse(input: MentorInput) {
    try {
      // Check rate limit
      const withinLimit = await this.checkRateLimit(input.userId);
      if (!withinLimit) {
        throw {
          code: "RATE_LIMIT",
          message: "Daily mentor interaction limit reached",
        } as MentorError;
      }

      // Check cache
      const cacheKey = this.getCacheKey(input);
      const cached = await this.getCachedResponse(cacheKey);
      if (cached) return cached;

      // Get mentor prompt
      const prompt = mentorPrompts[input.persona];
      if (!prompt) {
        throw {
          code: "INVALID_INPUT",
          message: "Invalid mentor persona",
        } as MentorError;
      }

      // Create messages for completion
      const messages = [
        createSystemMessage(prompt),
        createUserMessage({
          streak: input.streak,
          habits: input.habits,
          reflection: input.reflection,
        }),
      ];

      // Generate streaming response
      const stream = await streamingCompletion(messages);

      // Store interaction in database asynchronously
      prisma.mentorMessage
        .create({
          data: {
            userId: input.userId,
            habitLogId: input.habitLogId,
            persona: input.persona,
            message: "Streaming response",
            challenge: "Streaming response",
          },
        })
        .catch((error) => {
          console.error("Failed to store mentor message:", error);
        });

      return stream;
    } catch (error) {
      console.error("Mentor service error:", error);
      throw {
        code: "PROCESSING_ERROR",
        message: "Failed to generate mentor response",
        details: error,
      } as MentorError;
    }
  }
}
