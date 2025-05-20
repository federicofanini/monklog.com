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
};
