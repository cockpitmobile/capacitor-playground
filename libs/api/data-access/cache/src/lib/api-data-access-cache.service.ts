import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const val = (await this.cacheManager.get(key)) as string | undefined;
    if (val) {
      return JSON.parse(val) as T;
    }
    return undefined;
  }

  set<T>(key: string, value: T, ttl: number): Promise<void> {
    return this.cacheManager.set(key, JSON.stringify(value), ttl);
  }

  del(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }
}
