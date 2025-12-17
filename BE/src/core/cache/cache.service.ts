import { Injectable, Logger } from '@nestjs/common';

/**
 * In-memory cache service for MVP
 * Can be replaced with Redis in production
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Delete values matching pattern
   */
  async deleteByPattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get or set with callback
   */
  async getOrSet<T>(key: string, callback: () => Promise<T>, ttlSeconds: number = 3600): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, ttlSeconds);

    return value;
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }
}
