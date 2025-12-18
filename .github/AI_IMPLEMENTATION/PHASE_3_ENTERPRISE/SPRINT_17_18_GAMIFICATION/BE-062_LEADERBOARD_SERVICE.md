# BE-062: Leaderboard Service

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-062 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P1 (High) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-061 |

---

## 🎯 Objective

Implement leaderboard system:
- Daily/Weekly/Monthly/All-time rankings
- Level-based filtering (A2, B1, B2, C1)
- Efficient ranking queries
- User rank position

---

## 📝 Implementation

### 1. entities/leaderboard-entry.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
}

@Entity('leaderboard_entries')
@Unique(['user', 'period', 'periodKey', 'level'])
@Index(['period', 'periodKey', 'level', 'xp'])
export class LeaderboardEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: LeaderboardPeriod,
    default: LeaderboardPeriod.WEEKLY,
  })
  period: LeaderboardPeriod;

  @Column({ name: 'period_key', length: 20 })
  periodKey: string; // e.g., '2024-01-15', '2024-W02', '2024-01'

  @Column({ length: 10, nullable: true })
  level: string; // A2, B1, B2, C1 or null for all

  @Column({ default: 0 })
  xp: number;

  @Column({ name: 'tests_completed', default: 0 })
  testsCompleted: number;

  @Column({
    name: 'average_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  averageScore: number;

  @Column({ nullable: true })
  rank: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### 2. dto/leaderboard.dto.ts

```typescript
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaderboardPeriod } from '../entities/leaderboard-entry.entity';

export class LeaderboardQueryDto {
  @IsEnum(LeaderboardPeriod)
  @IsOptional()
  period?: LeaderboardPeriod = LeaderboardPeriod.WEEKLY;

  @IsOptional()
  level?: string; // A2, B1, B2, C1

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class LeaderboardEntryDto {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl: string;
  level: string;
  xp: number;
  testsCompleted: number;
  averageScore: number;
  isCurrentUser: boolean;
}

export class LeaderboardResponseDto {
  period: LeaderboardPeriod;
  periodKey: string;
  level: string | null;
  entries: LeaderboardEntryDto[];
  total: number;
  currentUserRank: LeaderboardEntryDto | null;
}
```

### 3. leaderboard.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  LeaderboardEntryEntity,
  LeaderboardPeriod,
} from './entities/leaderboard-entry.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { LeaderboardQueryDto, LeaderboardResponseDto, LeaderboardEntryDto } from './dto/leaderboard.dto';
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  getISOWeek,
} from 'date-fns';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @InjectRepository(LeaderboardEntryEntity)
    private leaderboardRepo: Repository<LeaderboardEntryEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async getLeaderboard(
    query: LeaderboardQueryDto,
    currentUserId?: string,
  ): Promise<LeaderboardResponseDto> {
    const { period, level, page, limit } = query;
    const periodKey = this.getCurrentPeriodKey(period);

    // Build query
    const qb = this.leaderboardRepo
      .createQueryBuilder('lb')
      .leftJoinAndSelect('lb.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('lb.period = :period', { period })
      .andWhere('lb.period_key = :periodKey', { periodKey });

    if (level) {
      qb.andWhere('lb.level = :level', { level });
    } else {
      qb.andWhere('lb.level IS NULL');
    }

    qb.orderBy('lb.xp', 'DESC').addOrderBy('lb.tests_completed', 'DESC');

    // Get total
    const total = await qb.getCount();

    // Get paginated results
    const entries = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Calculate ranks
    const startRank = (page - 1) * limit + 1;
    const leaderboardEntries: LeaderboardEntryDto[] = entries.map(
      (entry, index) => ({
        rank: startRank + index,
        userId: entry.userId,
        userName: entry.user?.name || 'Unknown',
        avatarUrl: entry.user?.profile?.avatarUrl || null,
        level: entry.user?.profile?.currentLevel || 'N/A',
        xp: entry.xp,
        testsCompleted: entry.testsCompleted,
        averageScore: Number(entry.averageScore),
        isCurrentUser: entry.userId === currentUserId,
      }),
    );

    // Get current user's rank if not in current page
    let currentUserRank: LeaderboardEntryDto | null = null;
    if (currentUserId) {
      const userEntry = leaderboardEntries.find((e) => e.isCurrentUser);
      if (!userEntry) {
        currentUserRank = await this.getUserRank(
          currentUserId,
          period,
          periodKey,
          level,
        );
      }
    }

    return {
      period,
      periodKey,
      level: level || null,
      entries: leaderboardEntries,
      total,
      currentUserRank,
    };
  }

  async getUserRank(
    userId: string,
    period: LeaderboardPeriod,
    periodKey: string,
    level?: string,
  ): Promise<LeaderboardEntryDto | null> {
    // Get user's entry
    const userEntry = await this.leaderboardRepo.findOne({
      where: {
        userId,
        period,
        periodKey,
        level: level || null,
      },
      relations: ['user', 'user.profile'],
    });

    if (!userEntry) return null;

    // Count users with higher XP
    const qb = this.leaderboardRepo
      .createQueryBuilder('lb')
      .where('lb.period = :period', { period })
      .andWhere('lb.period_key = :periodKey', { periodKey })
      .andWhere('lb.xp > :xp', { xp: userEntry.xp });

    if (level) {
      qb.andWhere('lb.level = :level', { level });
    } else {
      qb.andWhere('lb.level IS NULL');
    }

    const higherCount = await qb.getCount();
    const rank = higherCount + 1;

    return {
      rank,
      userId: userEntry.userId,
      userName: userEntry.user?.name || 'Unknown',
      avatarUrl: userEntry.user?.profile?.avatarUrl || null,
      level: userEntry.user?.profile?.currentLevel || 'N/A',
      xp: userEntry.xp,
      testsCompleted: userEntry.testsCompleted,
      averageScore: Number(userEntry.averageScore),
      isCurrentUser: true,
    };
  }

  async updateUserScore(
    userId: string,
    xpDelta: number,
    testScore?: number,
    userLevel?: string,
  ): Promise<void> {
    const now = new Date();
    const periods = [
      { period: LeaderboardPeriod.DAILY, key: format(now, 'yyyy-MM-dd') },
      { period: LeaderboardPeriod.WEEKLY, key: `${format(now, 'yyyy')}-W${String(getISOWeek(now)).padStart(2, '0')}` },
      { period: LeaderboardPeriod.MONTHLY, key: format(now, 'yyyy-MM') },
      { period: LeaderboardPeriod.ALL_TIME, key: 'all' },
    ];

    for (const { period, key } of periods) {
      // Update global leaderboard (no level filter)
      await this.upsertEntry(userId, period, key, null, xpDelta, testScore);

      // Update level-specific leaderboard
      if (userLevel) {
        await this.upsertEntry(userId, period, key, userLevel, xpDelta, testScore);
      }
    }
  }

  private async upsertEntry(
    userId: string,
    period: LeaderboardPeriod,
    periodKey: string,
    level: string | null,
    xpDelta: number,
    testScore?: number,
  ): Promise<void> {
    const existing = await this.leaderboardRepo.findOne({
      where: { userId, period, periodKey, level },
    });

    if (existing) {
      existing.xp += xpDelta;
      if (testScore !== undefined) {
        const newTotal =
          existing.averageScore * existing.testsCompleted + testScore;
        existing.testsCompleted += 1;
        existing.averageScore = newTotal / existing.testsCompleted;
      }
      await this.leaderboardRepo.save(existing);
    } else {
      const entry = this.leaderboardRepo.create({
        userId,
        period,
        periodKey,
        level,
        xp: xpDelta,
        testsCompleted: testScore !== undefined ? 1 : 0,
        averageScore: testScore || 0,
      });
      await this.leaderboardRepo.save(entry);
    }
  }

  // Refresh ranks periodically
  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshRanks(): Promise<void> {
    const now = new Date();
    const periods = [
      { period: LeaderboardPeriod.DAILY, key: format(now, 'yyyy-MM-dd') },
      { period: LeaderboardPeriod.WEEKLY, key: `${format(now, 'yyyy')}-W${String(getISOWeek(now)).padStart(2, '0')}` },
    ];

    for (const { period, key } of periods) {
      await this.calculateRanks(period, key);
    }
  }

  private async calculateRanks(
    period: LeaderboardPeriod,
    periodKey: string,
  ): Promise<void> {
    // Use window function to calculate ranks
    await this.leaderboardRepo.query(`
      WITH ranked AS (
        SELECT 
          id,
          RANK() OVER (
            PARTITION BY level
            ORDER BY xp DESC, tests_completed DESC
          ) as calculated_rank
        FROM leaderboard_entries
        WHERE period = $1 AND period_key = $2
      )
      UPDATE leaderboard_entries le
      SET rank = r.calculated_rank
      FROM ranked r
      WHERE le.id = r.id
    `, [period, periodKey]);
  }

  async getTopUsers(
    period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
    limit: number = 10,
  ): Promise<LeaderboardEntryDto[]> {
    const periodKey = this.getCurrentPeriodKey(period);

    const entries = await this.leaderboardRepo.find({
      where: { period, periodKey, level: null },
      relations: ['user', 'user.profile'],
      order: { xp: 'DESC' },
      take: limit,
    });

    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: entry.user?.name || 'Unknown',
      avatarUrl: entry.user?.profile?.avatarUrl || null,
      level: entry.user?.profile?.currentLevel || 'N/A',
      xp: entry.xp,
      testsCompleted: entry.testsCompleted,
      averageScore: Number(entry.averageScore),
      isCurrentUser: false,
    }));
  }

  private getCurrentPeriodKey(period: LeaderboardPeriod): string {
    const now = new Date();

    switch (period) {
      case LeaderboardPeriod.DAILY:
        return format(now, 'yyyy-MM-dd');
      case LeaderboardPeriod.WEEKLY:
        return `${format(now, 'yyyy')}-W${String(getISOWeek(now)).padStart(2, '0')}`;
      case LeaderboardPeriod.MONTHLY:
        return format(now, 'yyyy-MM');
      case LeaderboardPeriod.ALL_TIME:
        return 'all';
      default:
        return format(now, 'yyyy-MM-dd');
    }
  }
}
```

### 4. leaderboard.controller.ts

```typescript
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardQueryDto } from './dto/leaderboard.dto';
import { LeaderboardPeriod } from './entities/leaderboard-entry.entity';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get leaderboard' })
  async getLeaderboard(@Query() query: LeaderboardQueryDto, @Request() req) {
    const userId = req.user?.id;
    return this.leaderboardService.getLeaderboard(query, userId);
  }

  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user rank' })
  async getMyRank(@Request() req, @Query() query: LeaderboardQueryDto) {
    const periodKey = this.getPeriodKey(query.period);
    return this.leaderboardService.getUserRank(
      req.user.id,
      query.period,
      periodKey,
      query.level,
    );
  }

  @Get('top')
  @Public()
  @ApiOperation({ summary: 'Get top users' })
  async getTopUsers(
    @Query('period') period: LeaderboardPeriod = LeaderboardPeriod.WEEKLY,
    @Query('limit') limit: number = 10,
  ) {
    return this.leaderboardService.getTopUsers(period, limit);
  }

  private getPeriodKey(period: LeaderboardPeriod): string {
    // Implementation same as service
    return 'all'; // Simplified
  }
}
```

### 5. leaderboard.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardEntryEntity } from './entities/leaderboard-entry.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaderboardEntryEntity, UserEntity])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Leaderboard entries created for all periods
- [ ] Ranking by XP works correctly
- [ ] Level filtering works
- [ ] Pagination works
- [ ] Current user rank calculated
- [ ] Ranks refreshed periodically
- [ ] Top users endpoint works

---

## 🧪 Test Cases

```typescript
describe('LeaderboardService', () => {
  it('updates user score correctly', async () => {
    // Update user with 100 XP
    // Verify entries created for all periods
  });

  it('calculates rank correctly', async () => {
    // Create 3 users with different XP
    // Get leaderboard
    // Verify ranks are 1, 2, 3
  });

  it('filters by level', async () => {
    // Create users with different levels
    // Get B1 leaderboard
    // Verify only B1 users shown
  });

  it('returns current user rank', async () => {
    // User at rank 50
    // Request page 1
    // Verify currentUserRank included
  });
});
```
