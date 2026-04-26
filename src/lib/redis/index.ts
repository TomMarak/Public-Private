import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    await redis.connect();
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};
