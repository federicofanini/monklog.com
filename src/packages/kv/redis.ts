import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL environment variable is not set");
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN || "",
});

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    return redis.get(key);
  },

  async set(
    key: string,
    value: unknown,
    options?: { ex?: number }
  ): Promise<void> {
    if (options?.ex) {
      await redis.setex(key, options.ex, value);
    } else {
      await redis.set(key, value);
    }
  },

  async incr(key: string): Promise<number> {
    return redis.incr(key);
  },

  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  },

  // Chat rate limiting functions
  async getChatUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split("T")[0];
    const key = `chat:${userId}:${today}`;
    const usage = await redis.get<number>(key);
    return usage || 0;
  },

  async incrementChatUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split("T")[0];
    const key = `chat:${userId}:${today}`;
    const usage = await redis.incr(key);

    // Set expiry for the key to end of day
    const secondsUntilMidnight = Math.ceil(
      (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000
    );
    await redis.expire(key, secondsUntilMidnight);

    return usage;
  },

  async isUserAllowedToChat(userId: string, isPaid: boolean): Promise<boolean> {
    if (isPaid) return true;
    const usage = await this.getChatUsage(userId);
    return usage < 3; // Free users get 3 messages per day
  },
};
