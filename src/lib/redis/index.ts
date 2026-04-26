import dotenv from 'dotenv';
import { createClient, type RedisClientType } from 'redis';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in the environment');
}

let redisClient: RedisClientType | null = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: redisUrl,
    });
    redisClient.on('error', (error) => {
      console.error('Redis client error:', error);
    });
    await redisClient.connect();
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
