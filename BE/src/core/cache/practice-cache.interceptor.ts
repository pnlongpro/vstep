import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

export interface PracticeCacheOptions {
  ttl?: number; // seconds
  keyGenerator?: (context: ExecutionContext) => string;
}

@Injectable()
export class PracticeCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly options: PracticeCacheOptions = {},
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const key = this.generateCacheKey(context);
    const ttl = this.options.ttl || 300; // Default 5 minutes

    // Try to get from cache
    const cached = await this.cacheService.get(key);
    if (cached !== null) {
      return of(cached);
    }

    // Execute handler and cache result
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheService.set(key, response, ttl);
      }),
    );
  }

  private generateCacheKey(context: ExecutionContext): string {
    if (this.options.keyGenerator) {
      return this.options.keyGenerator(context);
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, query, params } = request;

    return `practice:${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(params)}`;
  }
}

/**
 * Cache keys for practice module
 */
export const PRACTICE_CACHE_KEYS = {
  // Exam sets
  EXAM_SETS: 'exam-sets',
  EXAM_SET: (id: string) => `exam-sets:${id}`,
  EXAM_SETS_PUBLIC: (level?: string) => `exam-sets:public:${level || 'all'}`,

  // Questions
  QUESTIONS: 'questions',
  QUESTION: (id: string) => `questions:${id}`,
  QUESTIONS_BY_SKILL: (skill: string) => `questions:skill:${skill}`,
  QUESTIONS_BY_LEVEL: (level: string) => `questions:level:${level}`,

  // Sessions
  SESSION: (id: string) => `sessions:${id}`,
  USER_SESSIONS: (userId: string) => `sessions:user:${userId}`,

  // Statistics
  USER_STATS: (userId: string) => `stats:user:${userId}`,
  SKILL_STATS: (userId: string, skill: string) => `stats:user:${userId}:skill:${skill}`,

  // Leaderboard
  LEADERBOARD: (level: string, period: string) => `leaderboard:${level}:${period}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const PRACTICE_CACHE_TTL = {
  EXAM_SETS: 3600, // 1 hour
  QUESTIONS: 3600, // 1 hour
  SESSIONS: 300, // 5 minutes
  STATISTICS: 300, // 5 minutes
  LEADERBOARD: 600, // 10 minutes
};
