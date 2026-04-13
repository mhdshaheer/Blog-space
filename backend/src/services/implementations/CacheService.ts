import { ICacheService } from '../interfaces/ICacheService';
import { redisClient } from '../../utils/redis';

export class CacheService implements ICacheService {
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
