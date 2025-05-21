import { ghostPrompt } from "./ghost";
import { monkPrompt } from "./monk";
import { marinePrompt } from "./marine";
import { ceoPrompt } from "./ceo";
import type {
  MentorInput,
  MentorResponse,
  MentorError,
} from "@/packages/shared/types/mentor";
import {
  streamingCompletion,
  createSystemMessage,
  createUserMessage,
} from "../ai";
import { kv } from "@/packages/kv/redis";
import { prisma } from "@/packages/database/prisma";
import { MentorPersona } from "@prisma/client";

const CACHE_PREFIX = "mentor:";
const DEFAULT_CACHE_TIMEOUT = 3600; // 1 hour
const MAX_RESPONSES_PER_DAY = 10;

// Map frontend mentor types to schema enum
const mentorTypeToPersona: Record<string, MentorPersona> = {
  GHOST: MentorPersona.GHOST,
  MONK: MentorPersona.MONK,
  WARRIOR: MentorPersona.WARRIOR,
  CEO: MentorPersona.SHADOW,
};

const mentorPrompts: Record<string, string> = {
  GHOST: ghostPrompt,
  MONK: monkPrompt,
  WARRIOR: marinePrompt,
  CEO: ceoPrompt,
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
    // Include the reflection in the cache key to differentiate between different messages
    const messageHash = input.reflection
      ? Buffer.from(input.reflection).toString("base64").slice(0, 32)
      : "no-message";
    return `${CACHE_PREFIX}${input.userId}:${input.habitLogId}:${messageHash}`;
  }

  private async getCachedResponse(key: string): Promise<MentorResponse | null> {
    // Only use cache for habit logs, not for chat messages
    if (key.includes(":no-message:")) {
      return kv.get(key);
    }
    return null;
  }

  private async cacheResponse(
    key: string,
    response: MentorResponse
  ): Promise<void> {
    // Only cache habit logs, not chat messages
    if (key.includes(":no-message:")) {
      await kv.set(key, response, { ex: DEFAULT_CACHE_TIMEOUT });
    }
  }

  public async *generateResponse(input: MentorInput): AsyncGenerator<string> {
    try {
      // Check rate limit
      const withinLimit = await this.checkRateLimit(input.userId);
      if (!withinLimit) {
        throw {
          code: "RATE_LIMIT",
          message: "Daily mentor interaction limit reached",
        } as MentorError;
      }

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
          habits: input.habits || [],
          reflection: input.reflection,
        }),
      ];

      // Generate streaming response
      const stream = await streamingCompletion(messages);

      // Process the stream and extract message and challenge
      let fullMessage = "";
      let challenge = "";
      let isInChallenge = false;

      for await (const chunk of stream) {
        const text = chunk.toString().trim();

        // Skip empty chunks
        if (!text) continue;

        // Check for challenge section
        if (text.toLowerCase().includes("challenge:")) {
          isInChallenge = true;
          const [, challengeText] = text.split(/challenge:/i);
          if (challengeText) {
            challenge = challengeText.trim();
          }
          continue;
        }

        // Add to appropriate section
        if (isInChallenge) {
          challenge += (challenge ? " " : "") + text;
        } else {
          fullMessage += (fullMessage ? " " : "") + text;
        }

        // Yield the chunk for streaming
        yield text;
      }

      // Clean up the response
      fullMessage = fullMessage.trim();
      challenge = challenge.trim();

      // Store the complete message in the database
      await prisma.mentorMessage.create({
        data: {
          userId: input.userId,
          message: fullMessage,
          role: "assistant",
          mentor_type: mentorTypeToPersona[input.persona],
        },
      });

      // Only cache if this is a habit log response
      const cacheKey = this.getCacheKey(input);
      if (cacheKey.includes(":no-message:")) {
        await this.cacheResponse(cacheKey, {
          truth: fullMessage,
          challenge,
        });
      }
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
