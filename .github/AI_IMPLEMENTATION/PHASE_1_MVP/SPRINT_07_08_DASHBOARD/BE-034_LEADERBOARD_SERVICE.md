# Task: BE-034 - Leaderboard Service

## Task Info

| Field | Value |
|-------|-------|
| **Task ID** | BE-034 |
| **Task Name** | Leaderboard Service |
| **Module** | Dashboard & Analytics |
| **Sprint** | 07-08 |
| **Estimated Hours** | 4h |
| **Priority** | P1 (High) |
| **Dependencies** | BE-028 |

---

## Description

Implement leaderboard service để:
- Xếp hạng users theo XP, score, streak
- Leaderboard theo period (weekly, monthly, all-time)
- Leaderboard theo VSTEP level
- User's rank và surrounding users
- Cache leaderboard data

---

## Acceptance Criteria

- [ ] Leaderboard rankings theo multiple criteria
- [ ] Period-based leaderboards (weekly/monthly/all-time)
- [ ] Level-filtered leaderboards (A2/B1/B2/C1)
- [ ] User rank với surrounding entries
- [ ] Friends/Class leaderboard
- [ ] Efficient caching và refresh strategy
- [ ] Rank change tracking

---

## Implementation

### 1. Leaderboard Entry Entity

```typescript
// src/modules/dashboard/entities/leaderboard-entry.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
}

export enum LeaderboardType {
  XP = 'xp',
  SCORE = 'score',
  STREAK = 'streak',
  STUDY_TIME = 'study_time',
  TESTS_COMPLETED = 'tests_completed',
}

@Entity('leaderboard_entries')
@Index(['period', 'type', 'vstepLevel', 'rank'])
@Index(['period', 'type', 'userId'], { unique: true })
@Index(['periodStart', 'periodEnd'])
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: LeaderboardPeriod })
  period: LeaderboardPeriod;

  @Column({ type: 'enum', enum: LeaderboardType })
  type: LeaderboardType;

  @Column({ name: 'vstep_level', type: 'varchar', length: 10, nullable: true })
  vstepLevel: string; // null = all levels

  @Column({ type: 'int' })
  rank: number;

  @Column({ name: 'previous_rank', type: 'int', nullable: true })
  previousRank: number;

  @Column({ type: 'int', default: 0 })
  value: number; // XP, score, streak days, etc.

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  // Cached user info for display
  @Column({ name: 'user_name', type: 'varchar', length: 100 })
  userName: string;

  @Column({ name: 'user_avatar', type: 'varchar', length: 500, nullable: true })
  userAvatar: string;

  @Column({ name: 'user_level', type: 'int', default: 1 })
  userLevel: number;

  @Column({ name: 'badges_count', type: 'int', default: 0 })
  badgesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed
  get rankChange(): number | null {
    if (this.previousRank === null) return null;
    return this.previousRank - this.rank; // Positive = improved
  }
}
```

### 2. Leaderboard Service

```typescript
// src/modules/dashboard/services/leaderboard.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, Not, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LeaderboardEntry, LeaderboardPeriod, LeaderboardType } from '../entities/leaderboard-entry.entity';
import { UserStatsRepository } from '../repositories/user-stats.repository';
import { UserStats } from '../entities/user-stats.entity';
import { User } from '../../users/entities/user.entity';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  startOfDay,
  subDays,
  format,
} from 'date-fns';

export interface LeaderboardUser {
  rank: number;
  previousRank: number | null;
  rankChange: number | null;
  userId: string;
  userName: string;
  userAvatar: string | null;
  userLevel: number;
  badgesCount: number;
  value: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  period: LeaderboardPeriod;
  type: LeaderboardType;
  vstepLevel: string | null;
  periodStart: Date;
  periodEnd: Date;
  entries: LeaderboardUser[];
  totalParticipants: number;
  currentUserRank: number | null;
  lastUpdated: Date;
}

@Injectable()
export class LeaderboardService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly DEFAULT_LIMIT = 100;

  constructor(
    @InjectRepository(LeaderboardEntry)
    private readonly leaderboardRepo: Repository<LeaderboardEntry>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userStatsRepo: UserStatsRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // ==================== Get Leaderboard ====================

  async getLeaderboard(
    period: LeaderboardPeriod,
    type: LeaderboardType,
    options?: {
      vstepLevel?: string;
      limit?: number;
      offset?: number;
      userId?: string; // For highlighting current user
    },
  ): Promise<LeaderboardResponse> {
    const cacheKey = this.getCacheKey(period, type, options?.vstepLevel);
    const cached = await this.cacheManager.get<LeaderboardResponse>(cacheKey);
    
    if (cached && !options?.userId) {
      return cached;
    }

    const { periodStart, periodEnd } = this.getPeriodDates(period);
    const limit = options?.limit || this.DEFAULT_LIMIT;
    const offset = options?.offset || 0;

    const query = this.leaderboardRepo
      .createQueryBuilder('entry')
      .where('entry.period = :period', { period })
      .andWhere('entry.type = :type', { type })
      .andWhere('entry.periodStart = :periodStart', { periodStart: format(periodStart, 'yyyy-MM-dd') })
      .orderBy('entry.rank', 'ASC')
      .skip(offset)
      .take(limit);

    if (options?.vstepLevel) {
      query.andWhere('entry.vstepLevel = :level', { level: options.vstepLevel });
    } else {
      query.andWhere('entry.vstepLevel IS NULL');
    }

    const [entries, total] = await query.getManyAndCount();

    // Find current user rank if provided
    let currentUserRank: number | null = null;
    if (options?.userId) {
      const userEntry = await this.leaderboardRepo.findOne({
        where: {
          userId: options.userId,
          period,
          type,
          periodStart: format(periodStart, 'yyyy-MM-dd') as any,
          vstepLevel: options.vstepLevel || IsNull() as any,
        },
      });
      currentUserRank = userEntry?.rank || null;
    }

    const leaderboardUsers: LeaderboardUser[] = entries.map(entry => ({
      rank: entry.rank,
      previousRank: entry.previousRank,
      rankChange: entry.rankChange,
      userId: entry.userId,
      userName: entry.userName,
      userAvatar: entry.userAvatar,
      userLevel: entry.userLevel,
      badgesCount: entry.badgesCount,
      value: entry.value,
      isCurrentUser: entry.userId === options?.userId,
    }));

    const response: LeaderboardResponse = {
      period,
      type,
      vstepLevel: options?.vstepLevel || null,
      periodStart,
      periodEnd,
      entries: leaderboardUsers,
      totalParticipants: total,
      currentUserRank,
      lastUpdated: entries[0]?.updatedAt || new Date(),
    };

    // Cache if no user-specific filtering
    if (!options?.userId) {
      await this.cacheManager.set(cacheKey, response, this.CACHE_TTL);
    }

    return response;
  }

  async getUserRankWithSurrounding(
    userId: string,
    period: LeaderboardPeriod,
    type: LeaderboardType,
    vstepLevel?: string,
    surrounding: number = 2,
  ): Promise<{
    userEntry: LeaderboardUser | null;
    surrounding: LeaderboardUser[];
  }> {
    const { periodStart } = this.getPeriodDates(period);

    // Find user's entry
    const userEntry = await this.leaderboardRepo.findOne({
      where: {
        userId,
        period,
        type,
        periodStart: format(periodStart, 'yyyy-MM-dd') as any,
        vstepLevel: vstepLevel || IsNull() as any,
      },
    });

    if (!userEntry) {
      return { userEntry: null, surrounding: [] };
    }

    // Get surrounding entries
    const minRank = Math.max(1, userEntry.rank - surrounding);
    const maxRank = userEntry.rank + surrounding;

    const surroundingEntries = await this.leaderboardRepo.find({
      where: {
        period,
        type,
        periodStart: format(periodStart, 'yyyy-MM-dd') as any,
        vstepLevel: vstepLevel || IsNull() as any,
        rank: Between(minRank, maxRank),
      },
      order: { rank: 'ASC' },
    });

    return {
      userEntry: {
        rank: userEntry.rank,
        previousRank: userEntry.previousRank,
        rankChange: userEntry.rankChange,
        userId: userEntry.userId,
        userName: userEntry.userName,
        userAvatar: userEntry.userAvatar,
        userLevel: userEntry.userLevel,
        badgesCount: userEntry.badgesCount,
        value: userEntry.value,
        isCurrentUser: true,
      },
      surrounding: surroundingEntries.map(entry => ({
        rank: entry.rank,
        previousRank: entry.previousRank,
        rankChange: entry.rankChange,
        userId: entry.userId,
        userName: entry.userName,
        userAvatar: entry.userAvatar,
        userLevel: entry.userLevel,
        badgesCount: entry.badgesCount,
        value: entry.value,
        isCurrentUser: entry.userId === userId,
      })),
    };
  }

  // ==================== Refresh Leaderboards ====================

  async refreshLeaderboard(
    period: LeaderboardPeriod,
    type: LeaderboardType,
    vstepLevel?: string,
  ): Promise<void> {
    const { periodStart, periodEnd } = this.getPeriodDates(period);

    // Get previous rankings for comparison
    const previousRankings = await this.getPreviousRankings(period, type, vstepLevel);

    // Build query based on type
    let statsQuery = this.userStatsRepo
      .createQueryBuilder('stats')
      .leftJoin('stats.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar']);

    // Add value selection based on type
    switch (type) {
      case LeaderboardType.XP:
        statsQuery = statsQuery.orderBy('stats.totalXp', 'DESC');
        break;
      case LeaderboardType.SCORE:
        statsQuery = statsQuery.orderBy('stats.averageScore', 'DESC');
        break;
      case LeaderboardType.STREAK:
        statsQuery = statsQuery.orderBy('stats.currentStreak', 'DESC');
        break;
      case LeaderboardType.STUDY_TIME:
        statsQuery = statsQuery.orderBy('stats.totalStudyMinutes', 'DESC');
        break;
      case LeaderboardType.TESTS_COMPLETED:
        statsQuery = statsQuery.orderBy('stats.totalTestsCompleted', 'DESC');
        break;
    }

    // Filter by VSTEP level if specified
    if (vstepLevel) {
      statsQuery = statsQuery.where('stats.currentVstepLevel = :level', { level: vstepLevel });
    }

    // Limit to active users with some activity
    statsQuery = statsQuery.andWhere('stats.totalXp > 0');

    const stats = await statsQuery.getMany();

    // Delete existing entries for this period
    await this.leaderboardRepo.delete({
      period,
      type,
      periodStart: format(periodStart, 'yyyy-MM-dd') as any,
      vstepLevel: vstepLevel || IsNull() as any,
    });

    // Create new entries
    const entries: Partial<LeaderboardEntry>[] = stats.map((stat, index) => {
      const value = this.getValueForType(stat, type);
      const previousRank = previousRankings.get(stat.userId);

      return {
        userId: stat.userId,
        period,
        type,
        vstepLevel: vstepLevel || null,
        rank: index + 1,
        previousRank: previousRank || null,
        value,
        periodStart,
        periodEnd,
        userName: stat.user?.name || 'Unknown',
        userAvatar: stat.user?.avatar || null,
        userLevel: stat.currentLevel,
        badgesCount: stat.totalBadges,
      };
    });

    // Batch insert
    if (entries.length > 0) {
      await this.leaderboardRepo.save(entries);
    }

    // Clear cache
    const cacheKey = this.getCacheKey(period, type, vstepLevel);
    await this.cacheManager.del(cacheKey);
  }

  async refreshAllLeaderboards(): Promise<void> {
    const periods = [
      LeaderboardPeriod.DAILY,
      LeaderboardPeriod.WEEKLY,
      LeaderboardPeriod.MONTHLY,
      LeaderboardPeriod.ALL_TIME,
    ];

    const types = [
      LeaderboardType.XP,
      LeaderboardType.SCORE,
      LeaderboardType.STREAK,
    ];

    const levels = [null, 'A2', 'B1', 'B2', 'C1'];

    for (const period of periods) {
      for (const type of types) {
        for (const level of levels) {
          await this.refreshLeaderboard(period, type, level || undefined);
        }
      }
    }
  }

  // ==================== Top Users Quick Access ====================

  async getTopUsers(
    type: LeaderboardType,
    limit: number = 10,
    vstepLevel?: string,
  ): Promise<LeaderboardUser[]> {
    const response = await this.getLeaderboard(
      LeaderboardPeriod.ALL_TIME,
      type,
      { vstepLevel, limit },
    );
    return response.entries;
  }

  async getWeeklyTopUsers(
    type: LeaderboardType,
    limit: number = 10,
  ): Promise<LeaderboardUser[]> {
    const response = await this.getLeaderboard(
      LeaderboardPeriod.WEEKLY,
      type,
      { limit },
    );
    return response.entries;
  }

  // ==================== Helper Methods ====================

  private getPeriodDates(period: LeaderboardPeriod): { periodStart: Date; periodEnd: Date } {
    const today = new Date();
    
    switch (period) {
      case LeaderboardPeriod.DAILY:
        return {
          periodStart: startOfDay(today),
          periodEnd: startOfDay(today),
        };
      case LeaderboardPeriod.WEEKLY:
        return {
          periodStart: startOfWeek(today, { weekStartsOn: 1 }),
          periodEnd: endOfWeek(today, { weekStartsOn: 1 }),
        };
      case LeaderboardPeriod.MONTHLY:
        return {
          periodStart: startOfMonth(today),
          periodEnd: endOfMonth(today),
        };
      case LeaderboardPeriod.ALL_TIME:
        return {
          periodStart: new Date('2024-01-01'), // System start date
          periodEnd: today,
        };
    }
  }

  private async getPreviousRankings(
    period: LeaderboardPeriod,
    type: LeaderboardType,
    vstepLevel?: string,
  ): Promise<Map<string, number>> {
    const { periodStart } = this.getPeriodDates(period);
    
    // Get previous period's start date
    let previousPeriodStart: Date;
    switch (period) {
      case LeaderboardPeriod.DAILY:
        previousPeriodStart = subDays(periodStart, 1);
        break;
      case LeaderboardPeriod.WEEKLY:
        previousPeriodStart = subDays(periodStart, 7);
        break;
      case LeaderboardPeriod.MONTHLY:
        previousPeriodStart = subDays(periodStart, 30);
        break;
      default:
        return new Map();
    }

    const entries = await this.leaderboardRepo.find({
      where: {
        period,
        type,
        periodStart: format(previousPeriodStart, 'yyyy-MM-dd') as any,
        vstepLevel: vstepLevel || IsNull() as any,
      },
    });

    return new Map(entries.map(e => [e.userId, e.rank]));
  }

  private getValueForType(stats: UserStats, type: LeaderboardType): number {
    switch (type) {
      case LeaderboardType.XP:
        return stats.totalXp;
      case LeaderboardType.SCORE:
        return Math.round(stats.averageScore * 100); // Store as integer
      case LeaderboardType.STREAK:
        return stats.currentStreak;
      case LeaderboardType.STUDY_TIME:
        return stats.totalStudyMinutes;
      case LeaderboardType.TESTS_COMPLETED:
        return stats.totalTestsCompleted;
      default:
        return 0;
    }
  }

  private getCacheKey(
    period: LeaderboardPeriod,
    type: LeaderboardType,
    vstepLevel?: string,
  ): string {
    return `leaderboard:${period}:${type}:${vstepLevel || 'all'}`;
  }
}
```

### 3. Leaderboard Controller

```typescript
// src/modules/dashboard/controllers/leaderboard.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../../../guards/optional-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { LeaderboardService } from '../services/leaderboard.service';
import { LeaderboardPeriod, LeaderboardType } from '../entities/leaderboard-entry.entity';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get leaderboard' })
  @ApiQuery({ name: 'period', enum: LeaderboardPeriod, required: false })
  @ApiQuery({ name: 'type', enum: LeaderboardType, required: false })
  @ApiQuery({ name: 'vstepLevel', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getLeaderboard(
    @CurrentUser('id') userId: string | undefined,
    @Query('period') period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
    @Query('type') type: LeaderboardType = LeaderboardType.XP,
    @Query('vstepLevel') vstepLevel?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.leaderboardService.getLeaderboard(period, type, {
      vstepLevel,
      limit,
      offset,
      userId,
    });
  }

  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user rank with surrounding users' })
  @ApiQuery({ name: 'period', enum: LeaderboardPeriod, required: false })
  @ApiQuery({ name: 'type', enum: LeaderboardType, required: false })
  @ApiQuery({ name: 'vstepLevel', required: false })
  async getMyRank(
    @CurrentUser('id') userId: string,
    @Query('period') period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
    @Query('type') type: LeaderboardType = LeaderboardType.XP,
    @Query('vstepLevel') vstepLevel?: string,
  ) {
    return this.leaderboardService.getUserRankWithSurrounding(
      userId,
      period,
      type,
      vstepLevel,
    );
  }

  @Get('top/:type')
  @ApiOperation({ summary: 'Get top users for a specific type' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'vstepLevel', required: false })
  async getTop(
    @Param('type') type: LeaderboardType,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('vstepLevel') vstepLevel?: string,
  ) {
    return this.leaderboardService.getTopUsers(type, limit, vstepLevel);
  }

  @Get('weekly-top')
  @ApiOperation({ summary: 'Get this week\'s top users' })
  @ApiQuery({ name: 'type', enum: LeaderboardType, required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWeeklyTop(
    @Query('type') type: LeaderboardType = LeaderboardType.XP,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.leaderboardService.getWeeklyTopUsers(type, limit);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Force refresh leaderboards (admin only)' })
  async refreshLeaderboards() {
    await this.leaderboardService.refreshAllLeaderboards();
    return { success: true, message: 'Leaderboards refreshed' };
  }
}
```

### 4. Leaderboard DTOs

```typescript
// src/modules/dashboard/dto/leaderboard.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeaderboardPeriod, LeaderboardType } from '../entities/leaderboard-entry.entity';

export class LeaderboardUserDto {
  @ApiProperty()
  rank: number;

  @ApiPropertyOptional()
  previousRank?: number;

  @ApiPropertyOptional()
  rankChange?: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName: string;

  @ApiPropertyOptional()
  userAvatar?: string;

  @ApiProperty()
  userLevel: number;

  @ApiProperty()
  badgesCount: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  isCurrentUser: boolean;
}

export class LeaderboardResponseDto {
  @ApiProperty({ enum: LeaderboardPeriod })
  period: LeaderboardPeriod;

  @ApiProperty({ enum: LeaderboardType })
  type: LeaderboardType;

  @ApiPropertyOptional()
  vstepLevel?: string;

  @ApiProperty()
  periodStart: Date;

  @ApiProperty()
  periodEnd: Date;

  @ApiProperty({ type: [LeaderboardUserDto] })
  entries: LeaderboardUserDto[];

  @ApiProperty()
  totalParticipants: number;

  @ApiPropertyOptional()
  currentUserRank?: number;

  @ApiProperty()
  lastUpdated: Date;
}

export class UserRankResponseDto {
  @ApiPropertyOptional({ type: LeaderboardUserDto })
  userEntry?: LeaderboardUserDto;

  @ApiProperty({ type: [LeaderboardUserDto] })
  surrounding: LeaderboardUserDto[];
}
```

### 5. Leaderboard Cron Job

```typescript
// src/modules/dashboard/crons/leaderboard.cron.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeaderboardService } from '../services/leaderboard.service';
import { LeaderboardPeriod, LeaderboardType } from '../entities/leaderboard-entry.entity';

@Injectable()
export class LeaderboardCronService {
  private readonly logger = new Logger(LeaderboardCronService.name);

  constructor(private readonly leaderboardService: LeaderboardService) {}

  // Refresh all leaderboards every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyRefresh(): Promise<void> {
    this.logger.log('Starting hourly leaderboard refresh...');
    
    try {
      // Refresh main leaderboards
      await this.leaderboardService.refreshLeaderboard(
        LeaderboardPeriod.WEEKLY,
        LeaderboardType.XP,
      );
      await this.leaderboardService.refreshLeaderboard(
        LeaderboardPeriod.WEEKLY,
        LeaderboardType.STREAK,
      );
      
      this.logger.log('Hourly leaderboard refresh completed');
    } catch (error) {
      this.logger.error('Error during leaderboard refresh:', error);
    }
  }

  // Full refresh at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyRefresh(): Promise<void> {
    this.logger.log('Starting daily full leaderboard refresh...');
    
    try {
      await this.leaderboardService.refreshAllLeaderboards();
      this.logger.log('Daily leaderboard refresh completed');
    } catch (error) {
      this.logger.error('Error during daily leaderboard refresh:', error);
    }
  }

  // Weekly leaderboard reset on Monday
  @Cron('0 0 * * 1') // Monday at midnight
  async handleWeeklyReset(): Promise<void> {
    this.logger.log('Starting weekly leaderboard reset...');
    
    try {
      // Archive previous week and create new entries
      await this.leaderboardService.refreshLeaderboard(
        LeaderboardPeriod.WEEKLY,
        LeaderboardType.XP,
      );
      await this.leaderboardService.refreshLeaderboard(
        LeaderboardPeriod.WEEKLY,
        LeaderboardType.SCORE,
      );
      await this.leaderboardService.refreshLeaderboard(
        LeaderboardPeriod.WEEKLY,
        LeaderboardType.STREAK,
      );
      
      this.logger.log('Weekly leaderboard reset completed');
    } catch (error) {
      this.logger.error('Error during weekly reset:', error);
    }
  }
}
```

### 6. Migration

```typescript
// src/migrations/XXXXXX-CreateLeaderboardTable.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLeaderboardTable1700000010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leaderboard_entries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'user_id', type: 'uuid' },
          {
            name: 'period',
            type: 'enum',
            enum: ['daily', 'weekly', 'monthly', 'all_time'],
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['xp', 'score', 'streak', 'study_time', 'tests_completed'],
          },
          { name: 'vstep_level', type: 'varchar', length: '10', isNullable: true },
          { name: 'rank', type: 'int' },
          { name: 'previous_rank', type: 'int', isNullable: true },
          { name: 'value', type: 'int', default: 0 },
          { name: 'period_start', type: 'date' },
          { name: 'period_end', type: 'date' },
          { name: 'user_name', type: 'varchar', length: '100' },
          { name: 'user_avatar', type: 'varchar', length: '500', isNullable: true },
          { name: 'user_level', type: 'int', default: 1 },
          { name: 'badges_count', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'leaderboard_entries',
      new TableIndex({
        name: 'IDX_leaderboard_period_type_level_rank',
        columnNames: ['period', 'type', 'vstep_level', 'rank'],
      }),
    );

    await queryRunner.createIndex(
      'leaderboard_entries',
      new TableIndex({
        name: 'IDX_leaderboard_period_type_user',
        columnNames: ['period', 'type', 'user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'leaderboard_entries',
      new TableIndex({
        name: 'IDX_leaderboard_period_dates',
        columnNames: ['period_start', 'period_end'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leaderboard_entries');
  }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaderboard` | Get leaderboard |
| GET | `/leaderboard/my-rank` | Get user rank with surrounding |
| GET | `/leaderboard/top/:type` | Get top users |
| GET | `/leaderboard/weekly-top` | Get weekly top |
| POST | `/leaderboard/refresh` | Force refresh (admin) |

---

## Next Task

Continue with **BE-035: Learning Roadmap Service** - Implement personalized learning paths.
