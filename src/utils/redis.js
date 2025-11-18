import { createClient } from 'redis';

import ENV from './constants.js';

export const redisClient = createClient({
  url: ENV.REDIS_HOST,
  socket: {
    tls: false,
    connectTimeout: 20000 // optional: increase timeout
  }
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Could not connect to Redis:', error.message);
    // Allow the app to run even if Redis is down
  }
};

redisClient.on('error', (err) =>
  console.log('Redis Client Error:', err.message)
);
