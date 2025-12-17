# BE-019: Practice Caching Strategy

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-019 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-010, BE-011, BE-014 |

---

## 🎯 Objective

Implement comprehensive caching strategy với:
- Redis cache cho exam sets, questions
- Cache invalidation patterns
- Cache warming strategies
- Distributed cache locking

---

## 💻 Implementation

### Step 1: Cache Configuration

```typescript
// src/core/cache/cache.config.ts
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

export const getCacheConfig = async (
  configService: ConfigService,
): Promise<CacheModuleOptions> => {
  return {
    store: redisStore as any,
    host: configService.get('REDIS_HOST', 'localhost'),
    port: configService.get('REDIS_PORT', 6379),
    password: configService.get('REDIS_PASSWORD', ''),
    db: configService.get('REDIS_CACHE_DB', 1),
    ttl: 3600, // Default 1 hour
    max: 10000, // Max cached items
  };
};

// Cache key prefixes
export const CACHE_KEYS = {
  // Exam Sets
  EXAM_SET: 'exam-set',
  EXAM_SETS_LIST: 'exam-sets:list',
  EXAM_SETS_PUBLIC: 'exam-sets:public',
  EXAM_SETS_STATS: 'exam-sets:stats',
  
  // Sections
  SECTION: 'section',
  SECTIONS_BY_EXAM: 'sections:exam',
  
  // Questions
  QUESTION: 'question',
  QUESTIONS_BY_SECTION: 'questions:section',
  QUESTIONS_BY_PASSAGE: 'questions:passage',
  QUESTIONS_RANDOM: 'questions:random',
  
  // Practice Sessions
  SESSION: 'session',
  SESSION_QUESTIONS: 'session:questions',
  
  // User Statistics
  USER_STATS: 'user-stats',
  USER_INSIGHTS: 'user-insights',
  
  // Leaderboard
  LEADERBOARD: 'leaderboard',
} as const;

// TTL configurations (in seconds)
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400,// 24 hours
  
  // Specific TTLs
  EXAM_SET: 3600,
  QUESTIONS: 1800,
  USER_STATS: 300,
  LEADERBOARD: 600,
} as const;
```

### Step 2: Enhanced Cache Service

```typescript
// src/core/cache/cache.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly redisClient: Redis;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    // Get underlying Redis client for advanced operations
    this.redisClient = (cacheManager as any).store.getClient();
  }

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value) {
        this.logger.debug(`Cache HIT: ${key}`);
      } else {
        this.logger.debug(`Cache MISS: ${key}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Cache GET error for ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Set cached value
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache SET error for ${key}: ${error.message}`);
    }
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DELETE: ${key}`);
    } catch (error) {
      this.logger.error(`Cache DELETE error for ${key}: ${error.message}`);
    }
  }

  /**
   * Delete by pattern (uses Redis SCAN)
   */
  async deleteByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.scanKeys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
        this.logger.debug(`Cache DELETE PATTERN: ${pattern} (${keys.length} keys)`);
      }
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache DELETE PATTERN error for ${pattern}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Scan keys matching pattern
   */
  private async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, foundKeys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');

    return keys;
  }

  /**
   * Get or set with callback
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redisClient.mget(...keys);
      return values.map(v => (v ? JSON.parse(v) : null));
    } catch (error) {
      this.logger.error(`Cache MGET error: ${error.message}`);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys at once
   */
  async mset(items: { key: string; value: any; ttl?: number }[]): Promise<void> {
    try {
      const pipeline = this.redisClient.pipeline();
      
      for (const item of items) {
        pipeline.setex(item.key, item.ttl || 3600, JSON.stringify(item.value));
      }

      await pipeline.exec();
      this.logger.debug(`Cache MSET: ${items.length} keys`);
    } catch (error) {
      this.logger.error(`Cache MSET error: ${error.message}`);
    }
  }

  /**
   * Acquire distributed lock
   */
  async acquireLock(
    key: string,
    ttl: number = 10000, // 10 seconds default
  ): Promise<string | null> {
    const lockKey = `lock:${key}`;
    const lockValue = Date.now().toString();

    try {
      const result = await this.redisClient.set(
        lockKey,
        lockValue,
        'PX',
        ttl,
        'NX',
      );

      if (result === 'OK') {
        return lockValue;
      }
      return null;
    } catch (error) {
      this.logger.error(`Lock acquire error for ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Release distributed lock
   */
  async releaseLock(key: string, lockValue: string): Promise<boolean> {
    const lockKey = `lock:${key}`;

    try {
      // Use Lua script for atomic check-and-delete
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

      const result = await this.redisClient.eval(script, 1, lockKey, lockValue);
      return result === 1;
    } catch (error) {
      this.logger.error(`Lock release error for ${key}: ${error.message}`);
      return false;
    }
  }

  /**
   * Execute with lock
   */
  async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 10000,
    retries: number = 3,
    retryDelay: number = 100,
  ): Promise<T> {
    let attempts = 0;

    while (attempts < retries) {
      const lockValue = await this.acquireLock(key, ttl);

      if (lockValue) {
        try {
          return await fn();
        } finally {
          await this.releaseLock(key, lockValue);
        }
      }

      attempts++;
      if (attempts < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error(`Failed to acquire lock for ${key} after ${retries} attempts`);
  }

  /**
   * Increment counter
   */
  async increment(key: string, by: number = 1): Promise<number> {
    return this.redisClient.incrby(key, by);
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, by: number = 1): Promise<number> {
    return this.redisClient.decrby(key, by);
  }

  /**
   * Add to sorted set (for leaderboards)
   */
  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redisClient.zadd(key, score, member);
  }

  /**
   * Get sorted set range (for leaderboards)
   */
  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.zrevrange(key, start, stop);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  /**
   * Extend TTL
   */
  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }
}
```

### Step 3: Cache Decorators

```typescript
// src/core/cache/cache.decorators.ts
import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

export const CACHE_KEY_METADATA = 'cache_key';
export const CACHE_TTL_METADATA = 'cache_ttl';
export const CACHE_OPTIONS_METADATA = 'cache_options';

interface CacheOptionsInterface {
  key?: string | ((...args: any[]) => string);
  ttl?: number;
  condition?: (...args: any[]) => boolean;
}

/**
 * Custom cache decorator with options
 */
export function Cached(options: CacheOptionsInterface = {}) {
  return applyDecorators(
    SetMetadata(CACHE_OPTIONS_METADATA, options),
    UseInterceptors(CacheInterceptor),
  );
}

/**
 * Cache with dynamic key from method arguments
 */
export function CacheResult(keyFactory: (...args: any[]) => string, ttl?: number) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = (this as any).cacheService;
      if (!cacheService) {
        return originalMethod.apply(this, args);
      }

      const cacheKey = keyFactory(...args);
      const cached = await cacheService.get(cacheKey);

      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);

      return result;
    };

    return descriptor;
  };
}

/**
 * Invalidate cache after method execution
 */
export function InvalidateCache(keyPattern: string | ((...args: any[]) => string)) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      const cacheService = (this as any).cacheService;
      if (cacheService) {
        const pattern = typeof keyPattern === 'function' 
          ? keyPattern(...args) 
          : keyPattern;
        await cacheService.deleteByPattern(pattern);
      }

      return result;
    };

    return descriptor;
  };
}
```

### Step 4: Cache Warming Service

```typescript
// src/core/cache/cache-warming.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSet } from '@/modules/exams/entities/exam-set.entity';
import { CacheService } from './cache.service';
import { CACHE_KEYS, CACHE_TTL } from './cache.config';

@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmingService.name);

  constructor(
    private readonly cacheService: CacheService,
    @InjectRepository(ExamSet)
    private readonly examSetRepository: Repository<ExamSet>,
  ) {}

  async onModuleInit() {
    // Warm cache on startup
    await this.warmCache();
  }

  /**
   * Warm all essential caches
   */
  async warmCache(): Promise<void> {
    this.logger.log('Starting cache warming...');
    const start = Date.now();

    try {
      await Promise.all([
        this.warmPublicExamSets(),
        this.warmExamSetStats(),
      ]);

      const duration = Date.now() - start;
      this.logger.log(`Cache warming completed in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Cache warming failed: ${error.message}`);
    }
  }

  /**
   * Warm public exam sets cache (runs every 30 minutes)
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async warmPublicExamSets(): Promise<void> {
    this.logger.debug('Warming public exam sets cache...');

    const examSets = await this.examSetRepository.find({
      where: { isActive: true },
      relations: ['sections'],
      order: { createdAt: 'DESC' },
    });

    // Cache all public exam sets
    await this.cacheService.set(
      `${CACHE_KEYS.EXAM_SETS_PUBLIC}:all`,
      examSets,
      CACHE_TTL.LONG,
    );

    // Cache by level
    const byLevel = new Map<string, ExamSet[]>();
    for (const examSet of examSets) {
      const level = examSet.level;
      if (!byLevel.has(level)) {
        byLevel.set(level, []);
      }
      byLevel.get(level)!.push(examSet);
    }

    for (const [level, sets] of byLevel) {
      await this.cacheService.set(
        `${CACHE_KEYS.EXAM_SETS_PUBLIC}:${level}`,
        sets,
        CACHE_TTL.LONG,
      );
    }

    // Cache individual exam sets
    const cacheItems = examSets.map(es => ({
      key: `${CACHE_KEYS.EXAM_SET}:${es.id}`,
      value: es,
      ttl: CACHE_TTL.LONG,
    }));

    await this.cacheService.mset(cacheItems);

    this.logger.debug(`Warmed ${examSets.length} public exam sets`);
  }

  /**
   * Warm exam set statistics (runs hourly)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async warmExamSetStats(): Promise<void> {
    this.logger.debug('Warming exam set stats cache...');

    const stats = await this.examSetRepository
      .createQueryBuilder('examSet')
      .select('examSet.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN examSet.isActive = true THEN 1 ELSE 0 END)', 'activeCount')
      .groupBy('examSet.level')
      .getRawMany();

    const total = await this.examSetRepository.count();
    const active = await this.examSetRepository.count({ where: { isActive: true } });

    await this.cacheService.set(
      CACHE_KEYS.EXAM_SETS_STATS,
      { total, active, inactive: total - active, byLevel: stats },
      CACHE_TTL.MEDIUM,
    );

    this.logger.debug('Warmed exam set stats');
  }

  /**
   * Warm specific exam set (call after update)
   */
  async warmExamSet(examSetId: string): Promise<void> {
    const examSet = await this.examSetRepository.findOne({
      where: { id: examSetId },
      relations: ['sections', 'sections.passages', 'sections.passages.questions'],
    });

    if (examSet) {
      await this.cacheService.set(
        `${CACHE_KEYS.EXAM_SET}:${examSetId}`,
        examSet,
        CACHE_TTL.LONG,
      );
    }
  }
}
```

### Step 5: Caching in Services

```typescript
// Example usage in exam-set.service.ts

@Injectable()
export class ExamSetService {
  constructor(
    private readonly examSetRepository: ExamSetRepository,
    private readonly cacheService: CacheService,
    private readonly cacheWarming: CacheWarmingService,
  ) {}

  /**
   * Find exam set with caching
   */
  async findById(id: string): Promise<ExamSet> {
    const cacheKey = `${CACHE_KEYS.EXAM_SET}:${id}`;

    // Try cache first
    const cached = await this.cacheService.get<ExamSet>(cacheKey);
    if (cached) return cached;

    // Cache miss - fetch from database
    const examSet = await this.examSetRepository.findByIdWithSections(id);
    if (!examSet) {
      throw new NotFoundException(`Exam set ${id} not found`);
    }

    // Cache the result
    await this.cacheService.set(cacheKey, examSet, CACHE_TTL.EXAM_SET);

    return examSet;
  }

  /**
   * Update with cache invalidation
   */
  async update(id: string, dto: UpdateExamSetDto): Promise<ExamSet> {
    const examSet = await this.findById(id);
    Object.assign(examSet, dto);

    await this.examSetRepository.save(examSet);

    // Invalidate related caches
    await Promise.all([
      this.cacheService.delete(`${CACHE_KEYS.EXAM_SET}:${id}`),
      this.cacheService.deleteByPattern(`${CACHE_KEYS.EXAM_SETS_PUBLIC}:*`),
      this.cacheService.delete(CACHE_KEYS.EXAM_SETS_STATS),
    ]);

    // Warm the updated exam set
    await this.cacheWarming.warmExamSet(id);

    return this.findById(id);
  }

  /**
   * Get public exam sets with caching
   */
  async findPublicExamSets(level?: string): Promise<ExamSet[]> {
    const cacheKey = `${CACHE_KEYS.EXAM_SETS_PUBLIC}:${level || 'all'}`;

    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const query = this.examSetRepository
          .createQueryBuilder('examSet')
          .leftJoinAndSelect('examSet.sections', 'sections')
          .where('examSet.isActive = :isActive', { isActive: true })
          .orderBy('examSet.createdAt', 'DESC');

        if (level) {
          query.andWhere('examSet.level = :level', { level });
        }

        return query.getMany();
      },
      CACHE_TTL.MEDIUM,
    );
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Redis cache integrated with NestJS
- [ ] Cache warming runs on startup
- [ ] Pattern-based invalidation works
- [ ] Distributed locking prevents race conditions
- [ ] Cache hit rate > 80% for exam sets
- [ ] No stale data after updates

---

## ⏭️ Next Task

→ `FE-016_PRACTICE_HOME.md` - Practice Home Page
