# BE-016: Practice Statistics Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-016 |
| **Phase** | 1 - MVP |
| **Sprint** | 3-4 |
| **Priority** | P2 (Medium) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-011, BE-013 |

---

## 🎯 Objective

Implement Practice Statistics Service với:
- User progress tracking
- Skill-based analytics
- Time spent analytics
- Performance trends

---

## 💻 Implementation

### Step 1: Statistics DTOs

```typescript
// src/modules/practice/dto/statistics-filter.dto.ts
import { IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SkillType, VstepLevel } from '@/shared/enums/practice.enums';

export enum StatsPeriod {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all',
}

export class StatsFilterDto {
  @ApiPropertyOptional({ enum: SkillType })
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;

  @ApiPropertyOptional({ enum: VstepLevel })
  @IsOptional()
  @IsEnum(VstepLevel)
  level?: VstepLevel;

  @ApiPropertyOptional({ enum: StatsPeriod, default: StatsPeriod.MONTH })
  @IsOptional()
  @IsEnum(StatsPeriod)
  period?: StatsPeriod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

// src/modules/practice/dto/statistics-response.dto.ts
export class OverallStatsDto {
  totalSessions: number;
  completedSessions: number;
  totalTimeSpent: number; // minutes
  averageScore: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
}

export class SkillStatsDto {
  skill: string;
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  accuracy: number;
  improvement: number; // percentage change
  lastPracticed: Date;
}

export class TrendDataPoint {
  date: string;
  score: number;
  accuracy: number;
  timeSpent: number;
}

export class ProgressTrendDto {
  period: string;
  data: TrendDataPoint[];
  scoreChange: number;
  accuracyChange: number;
}
```

### Step 2: Statistics Repository

```typescript
// src/modules/practice/repositories/statistics.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Between, MoreThanOrEqual } from 'typeorm';
import { PracticeSession } from '../entities/practice-session.entity';
import { PracticeAnswer } from '../entities/practice-answer.entity';
import { StatsFilterDto, StatsPeriod } from '../dto/statistics-filter.dto';

@Injectable()
export class StatisticsRepository {
  constructor(private dataSource: DataSource) {}

  /**
   * Get date range based on period
   */
  private getDateRange(period: StatsPeriod): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case StatsPeriod.WEEK:
        start.setDate(end.getDate() - 7);
        break;
      case StatsPeriod.MONTH:
        start.setMonth(end.getMonth() - 1);
        break;
      case StatsPeriod.QUARTER:
        start.setMonth(end.getMonth() - 3);
        break;
      case StatsPeriod.YEAR:
        start.setFullYear(end.getFullYear() - 1);
        break;
      case StatsPeriod.ALL:
        start.setFullYear(2020); // Platform launch date
        break;
    }

    return { start, end };
  }

  /**
   * Get overall statistics for a user
   */
  async getOverallStats(userId: string, filters: StatsFilterDto): Promise<any> {
    const { start, end } = this.getDateRange(filters.period || StatsPeriod.ALL);

    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select([
        'COUNT(DISTINCT ps.id) as totalSessions',
        'COUNT(DISTINCT CASE WHEN ps.status = :completed THEN ps.id END) as completedSessions',
        'SUM(ps.time_spent) as totalTimeSpent',
        'AVG(ps.score) as averageScore',
        'COUNT(pa.id) as totalQuestions',
        'SUM(CASE WHEN pa.is_correct = true THEN 1 ELSE 0 END) as correctAnswers',
      ])
      .from(PracticeSession, 'ps')
      .leftJoin(PracticeAnswer, 'pa', 'pa.session_id = ps.id')
      .where('ps.user_id = :userId', { userId })
      .andWhere('ps.created_at BETWEEN :start AND :end', { start, end })
      .setParameter('completed', 'completed');

    if (filters.skill) {
      queryBuilder.andWhere('ps.skill = :skill', { skill: filters.skill });
    }

    if (filters.level) {
      queryBuilder.andWhere('ps.level = :level', { level: filters.level });
    }

    return queryBuilder.getRawOne();
  }

  /**
   * Get statistics grouped by skill
   */
  async getStatsBySkill(userId: string, filters: StatsFilterDto): Promise<any[]> {
    const { start, end } = this.getDateRange(filters.period || StatsPeriod.MONTH);

    return this.dataSource
      .createQueryBuilder()
      .select([
        'ps.skill as skill',
        'COUNT(ps.id) as totalSessions',
        'AVG(ps.score) as averageScore',
        'MAX(ps.score) as bestScore',
        'SUM(ps.time_spent) as totalTimeSpent',
        'MAX(ps.created_at) as lastPracticed',
      ])
      .from(PracticeSession, 'ps')
      .where('ps.user_id = :userId', { userId })
      .andWhere('ps.status = :completed', { completed: 'completed' })
      .andWhere('ps.created_at BETWEEN :start AND :end', { start, end })
      .groupBy('ps.skill')
      .orderBy('totalSessions', 'DESC')
      .getRawMany();
  }

  /**
   * Get accuracy by skill
   */
  async getAccuracyBySkill(userId: string): Promise<any[]> {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'ps.skill as skill',
        'COUNT(pa.id) as totalQuestions',
        'SUM(CASE WHEN pa.is_correct = true THEN 1 ELSE 0 END) as correctAnswers',
        '(SUM(CASE WHEN pa.is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(pa.id)) as accuracy',
      ])
      .from(PracticeSession, 'ps')
      .innerJoin(PracticeAnswer, 'pa', 'pa.session_id = ps.id')
      .where('ps.user_id = :userId', { userId })
      .andWhere('ps.status = :completed', { completed: 'completed' })
      .groupBy('ps.skill')
      .getRawMany();
  }

  /**
   * Get daily progress trend
   */
  async getDailyTrend(userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.dataSource
      .createQueryBuilder()
      .select([
        'DATE(ps.created_at) as date',
        'COUNT(ps.id) as sessions',
        'AVG(ps.score) as averageScore',
        'SUM(ps.time_spent) as totalTime',
      ])
      .from(PracticeSession, 'ps')
      .where('ps.user_id = :userId', { userId })
      .andWhere('ps.status = :completed', { completed: 'completed' })
      .andWhere('ps.created_at >= :startDate', { startDate })
      .groupBy('DATE(ps.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  /**
   * Get current streak
   */
  async getCurrentStreak(userId: string): Promise<number> {
    const results = await this.dataSource
      .createQueryBuilder()
      .select('DISTINCT DATE(ps.created_at) as practice_date')
      .from(PracticeSession, 'ps')
      .where('ps.user_id = :userId', { userId })
      .andWhere('ps.status = :completed', { completed: 'completed' })
      .orderBy('practice_date', 'DESC')
      .limit(365)
      .getRawMany();

    if (results.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < results.length; i++) {
      const practiceDate = new Date(results[i].practice_date);
      practiceDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (practiceDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (i === 0 && practiceDate.getTime() === expectedDate.getTime() - 86400000) {
        // Yesterday was practiced, check from there
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get performance by question type
   */
  async getPerformanceByQuestionType(userId: string): Promise<any[]> {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'q.type as questionType',
        'COUNT(pa.id) as totalAttempts',
        'SUM(CASE WHEN pa.is_correct = true THEN 1 ELSE 0 END) as correct',
        'AVG(pa.time_spent) as avgTimeSpent',
      ])
      .from(PracticeAnswer, 'pa')
      .innerJoin('pa.question', 'q')
      .innerJoin('pa.session', 'ps')
      .where('ps.user_id = :userId', { userId })
      .groupBy('q.type')
      .getRawMany();
  }

  /**
   * Get weakest areas (question types with lowest accuracy)
   */
  async getWeakestAreas(userId: string, limit: number = 5): Promise<any[]> {
    return this.dataSource
      .createQueryBuilder()
      .select([
        'q.type as questionType',
        'ps.skill as skill',
        'COUNT(pa.id) as attempts',
        '(SUM(CASE WHEN pa.is_correct = true THEN 1 ELSE 0 END) * 100.0 / COUNT(pa.id)) as accuracy',
      ])
      .from(PracticeAnswer, 'pa')
      .innerJoin('pa.question', 'q')
      .innerJoin('pa.session', 'ps')
      .where('ps.user_id = :userId', { userId })
      .groupBy('q.type, ps.skill')
      .having('COUNT(pa.id) >= 5') // Minimum 5 attempts
      .orderBy('accuracy', 'ASC')
      .limit(limit)
      .getRawMany();
  }
}
```

### Step 3: Statistics Service

```typescript
// src/modules/practice/services/statistics.service.ts
import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from '../repositories/statistics.repository';
import { StatsFilterDto, StatsPeriod } from '../dto/statistics-filter.dto';
import { 
  OverallStatsDto, 
  SkillStatsDto, 
  ProgressTrendDto 
} from '../dto/statistics-response.dto';
import { CacheService } from '@/core/cache/cache.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly statsRepository: StatisticsRepository,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Get comprehensive statistics for a user
   */
  async getUserStatistics(userId: string, filters: StatsFilterDto): Promise<any> {
    const cacheKey = `user-stats:${userId}:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const [overall, bySkill, accuracy, trend, streak] = await Promise.all([
      this.getOverallStats(userId, filters),
      this.getSkillStats(userId, filters),
      this.statsRepository.getAccuracyBySkill(userId),
      this.getProgressTrend(userId, filters.period || StatsPeriod.MONTH),
      this.statsRepository.getCurrentStreak(userId),
    ]);

    // Merge accuracy into skill stats
    const skillsWithAccuracy = bySkill.map(skill => {
      const acc = accuracy.find(a => a.skill === skill.skill);
      return {
        ...skill,
        accuracy: acc?.accuracy || 0,
        totalQuestions: acc?.totalQuestions || 0,
        correctAnswers: acc?.correctAnswers || 0,
      };
    });

    const result = {
      overall: {
        ...overall,
        currentStreak: streak,
        accuracy: overall.totalQuestions > 0 
          ? (overall.correctAnswers / overall.totalQuestions * 100) 
          : 0,
      },
      bySkill: skillsWithAccuracy,
      trend,
      lastUpdated: new Date(),
    };

    await this.cacheService.set(cacheKey, result, 300); // 5 minutes
    return result;
  }

  /**
   * Get overall statistics
   */
  async getOverallStats(
    userId: string, 
    filters: StatsFilterDto
  ): Promise<OverallStatsDto> {
    const raw = await this.statsRepository.getOverallStats(userId, filters);

    return {
      totalSessions: parseInt(raw.totalSessions) || 0,
      completedSessions: parseInt(raw.completedSessions) || 0,
      totalTimeSpent: parseInt(raw.totalTimeSpent) || 0,
      averageScore: parseFloat(raw.averageScore) || 0,
      averageAccuracy: 0, // Calculated separately
      currentStreak: 0, // Fetched separately
      longestStreak: 0, // Stored in user_stats table
      totalQuestionsAnswered: parseInt(raw.totalQuestions) || 0,
      correctAnswers: parseInt(raw.correctAnswers) || 0,
    };
  }

  /**
   * Get statistics by skill
   */
  async getSkillStats(
    userId: string, 
    filters: StatsFilterDto
  ): Promise<SkillStatsDto[]> {
    const raw = await this.statsRepository.getStatsBySkill(userId, filters);

    return raw.map(r => ({
      skill: r.skill,
      totalSessions: parseInt(r.totalSessions) || 0,
      averageScore: parseFloat(r.averageScore) || 0,
      bestScore: parseFloat(r.bestScore) || 0,
      totalTimeSpent: parseInt(r.totalTimeSpent) || 0,
      accuracy: 0, // Calculated separately
      improvement: 0, // Calculate from historical data
      lastPracticed: r.lastPracticed,
    }));
  }

  /**
   * Get progress trend
   */
  async getProgressTrend(
    userId: string, 
    period: StatsPeriod
  ): Promise<ProgressTrendDto> {
    const days = period === StatsPeriod.WEEK ? 7 
               : period === StatsPeriod.MONTH ? 30 
               : period === StatsPeriod.QUARTER ? 90 
               : 365;

    const dailyData = await this.statsRepository.getDailyTrend(userId, days);

    // Calculate score change
    let scoreChange = 0;
    if (dailyData.length >= 2) {
      const firstWeek = dailyData.slice(0, 7);
      const lastWeek = dailyData.slice(-7);
      
      const firstAvg = firstWeek.reduce((a, b) => a + parseFloat(b.averageScore || 0), 0) / firstWeek.length;
      const lastAvg = lastWeek.reduce((a, b) => a + parseFloat(b.averageScore || 0), 0) / lastWeek.length;
      
      scoreChange = lastAvg - firstAvg;
    }

    return {
      period,
      data: dailyData.map(d => ({
        date: d.date,
        score: parseFloat(d.averageScore) || 0,
        accuracy: 0, // Calculate from answers
        timeSpent: parseInt(d.totalTime) || 0,
      })),
      scoreChange,
      accuracyChange: 0,
    };
  }

  /**
   * Get performance insights
   */
  async getInsights(userId: string): Promise<any> {
    const cacheKey = `user-insights:${userId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const [weakAreas, performanceByType] = await Promise.all([
      this.statsRepository.getWeakestAreas(userId),
      this.statsRepository.getPerformanceByQuestionType(userId),
    ]);

    const insights = {
      weakAreas: weakAreas.map(w => ({
        skill: w.skill,
        questionType: w.questionType,
        accuracy: parseFloat(w.accuracy),
        attempts: parseInt(w.attempts),
        recommendation: this.generateRecommendation(w.skill, w.questionType, parseFloat(w.accuracy)),
      })),
      strengths: performanceByType
        .filter(p => (parseInt(p.correct) / parseInt(p.totalAttempts)) > 0.8)
        .map(p => ({
          questionType: p.questionType,
          accuracy: (parseInt(p.correct) / parseInt(p.totalAttempts)) * 100,
        })),
      timeManagement: {
        averageTimePerQuestion: performanceByType.reduce(
          (a, b) => a + parseFloat(b.avgTimeSpent || 0), 0
        ) / performanceByType.length,
      },
    };

    await this.cacheService.set(cacheKey, insights, 600); // 10 minutes
    return insights;
  }

  /**
   * Generate learning recommendation
   */
  private generateRecommendation(
    skill: string, 
    questionType: string, 
    accuracy: number
  ): string {
    if (accuracy < 50) {
      return `Focus more on ${questionType} questions in ${skill}. Consider reviewing the fundamentals.`;
    } else if (accuracy < 70) {
      return `You're improving in ${questionType}. Practice more ${skill} exercises to build consistency.`;
    }
    return `Keep practicing to maintain your ${skill} skills.`;
  }

  /**
   * Get comparison with average
   */
  async getComparisonWithAverage(
    userId: string, 
    skill?: string
  ): Promise<any> {
    // Compare user's performance with platform average
    // Implementation depends on aggregate data collection
    return {
      userScore: 0,
      averageScore: 0,
      percentile: 0,
    };
  }

  /**
   * Invalidate user statistics cache
   */
  async invalidateCache(userId: string): Promise<void> {
    await this.cacheService.deleteByPattern(`user-stats:${userId}:*`);
    await this.cacheService.delete(`user-insights:${userId}`);
  }
}
```

### Step 4: Statistics Controller

```typescript
// src/modules/practice/controllers/statistics.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { StatisticsService } from '../services/statistics.service';
import { StatsFilterDto } from '../dto/statistics-filter.dto';

@ApiTags('Practice Statistics')
@Controller('practice/statistics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user practice statistics' })
  async getStatistics(
    @CurrentUser() user: User,
    @Query() filters: StatsFilterDto,
  ) {
    return this.statisticsService.getUserStatistics(user.id, filters);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get statistics by skill' })
  async getSkillStats(
    @CurrentUser() user: User,
    @Query() filters: StatsFilterDto,
  ) {
    return this.statisticsService.getSkillStats(user.id, filters);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get progress trend' })
  async getTrend(
    @CurrentUser() user: User,
    @Query() filters: StatsFilterDto,
  ) {
    return this.statisticsService.getProgressTrend(
      user.id, 
      filters.period
    );
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get learning insights and recommendations' })
  async getInsights(@CurrentUser() user: User) {
    return this.statisticsService.getInsights(user.id);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare with platform average' })
  async compare(
    @CurrentUser() user: User,
    @Query('skill') skill?: string,
  ) {
    return this.statisticsService.getComparisonWithAverage(user.id, skill);
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Overall stats calculated correctly
- [ ] Skill-based breakdown works
- [ ] Streak calculation is accurate
- [ ] Trend data shows correct periods
- [ ] Insights provide actionable recommendations
- [ ] Cache improves performance

---

## ⏭️ Next Task

→ `BE-017_DRAFT_SAVING_SERVICE.md` - Draft Saving Service
