import { createClient } from "redis";
import logger from "../utils/logger";

// Create Redis client
export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),

    reconnectStrategy: (retries) => {
      return Math.min(retries * 200, 5000);
    },
  },
});

//  shutdown helper
export const closeRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    logger.info("Redis connection closed gracefully");
  }
};
