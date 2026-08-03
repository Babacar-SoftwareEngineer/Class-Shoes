import { createClient, type RedisClientType } from 'redis';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

let redisClient: RedisClientType | null = null;
let connectionPromise: Promise<RedisClientType | null> | null = null;

const buildRedisClient = (): RedisClientType => {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on('error', (error) => {
    console.error('Redis client error:', error.message);
  });

  return client;
};

export const getRedisClient = async (): Promise<RedisClientType | null> => {
  if (redisClient) {
    return redisClient;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        const client = buildRedisClient();
        await client.connect();
        redisClient = client;
        return client;
      } catch (error) {
        console.error('Redis connection failed, continuing without cache:', error);
        connectionPromise = null;
        return null;
      }
    })();
  }

  return await connectionPromise;
};

export const getCachedValue = async <T>(key: string): Promise<T | null> => {
  const client = await getRedisClient();

  if (!client) {
    return null;
  }

  try {
    const cachedValue = await client.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue) as T;
  } catch (error) {
    console.error(`Failed to read Redis cache for key ${key}:`, error);
    return null;
  }
};

export const setCachedValue = async <T>(key: string, value: T, ttlSeconds: number): Promise<void> => {
  const client = await getRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error(`Failed to write Redis cache for key ${key}:`, error);
  }
};

export const invalidateProductCache = async (productId?: number): Promise<void> => {
  const client = await getRedisClient();

  if (!client) {
    return;
  }

  try {
    if (productId !== undefined) {
      await client.del(`product:details:${productId}`);
    }

    const productListKeys = await client.keys('product:list:*');

    if (productListKeys.length > 0) {
      await client.del(productListKeys);
    }
  } catch (error) {
    console.error('Failed to invalidate product cache:', error);
  }
};
