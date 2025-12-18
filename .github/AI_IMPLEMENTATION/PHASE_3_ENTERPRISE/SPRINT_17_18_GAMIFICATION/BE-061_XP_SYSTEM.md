# BE-061: XP System & Transactions

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-061 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 17-18 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 5h |
| **Dependencies** | BE-059 |

---

## 🎯 Objective

Implement XP (Experience Points) system:
- XP transaction logging
- Level calculation from XP
- XP multipliers
- Integration with user stats
- Level up notifications

---

## 📝 Implementation

### 1. entities/xp-transaction.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum XpSourceType {
  PRACTICE = 'practice',
  EXAM = 'exam',
  ACHIEVEMENT = 'achievement',
  STREAK = 'streak',
  BONUS = 'bonus',
  GOAL = 'goal',
  REFERRAL = 'referral',
}

@Entity('xp_transactions')
export class XpTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  amount: number;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: XpSourceType,
  })
  sourceType: XpSourceType;

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  multiplier: number;

  @Column({ name: 'base_amount' })
  baseAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 2. xp.config.ts

```typescript
export const XP_CONFIG = {
  // Base XP values
  sources: {
    practice_complete: 10,
    exam_complete: 50,
    exam_passed: 25,        // bonus for passing
    perfect_score: 25,      // bonus for 100%
    high_score: 10,         // bonus for 80%+
    streak_day: 5,          // per day maintained
    streak_week: 50,        // bonus at 7 days
    streak_month: 200,      // bonus at 30 days
    first_of_day: 5,        // first activity of the day
  },

  // Level thresholds (XP required for each level)
  levels: [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    600,    // Level 4
    1000,   // Level 5
    1500,   // Level 6
    2200,   // Level 7
    3000,   // Level 8
    4000,   // Level 9
    5200,   // Level 10
    6600,   // Level 11
    8200,   // Level 12
    10000,  // Level 13
    12000,  // Level 14
    14500,  // Level 15
    17500,  // Level 16
    21000,  // Level 17
    25000,  // Level 18
    30000,  // Level 19
    36000,  // Level 20
  ],

  // Multipliers
  multipliers: {
    premium: 1.5,           // Premium users
    weekend: 1.2,           // Weekend bonus
    event: 2.0,             // Special events
    streak_7: 1.1,          // 7+ day streak
    streak_30: 1.2,         // 30+ day streak
    streak_100: 1.5,        // 100+ day streak
  },

  // Daily cap (optional, to prevent abuse)
  dailyCap: 1000,
};

export function calculateLevel(xp: number): number {
  for (let i = XP_CONFIG.levels.length - 1; i >= 0; i--) {
    if (xp >= XP_CONFIG.levels[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function xpForNextLevel(currentXp: number): { current: number; required: number; progress: number } {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelIndex = currentLevel;

  if (nextLevelIndex >= XP_CONFIG.levels.length) {
    return { current: currentXp, required: currentXp, progress: 100 };
  }

  const currentLevelXp = XP_CONFIG.levels[currentLevel - 1];
  const nextLevelXp = XP_CONFIG.levels[nextLevelIndex];
  const xpInCurrentLevel = currentXp - currentLevelXp;
  const xpRequired = nextLevelXp - currentLevelXp;
  const progress = Math.floor((xpInCurrentLevel / xpRequired) * 100);

  return {
    current: xpInCurrentLevel,
    required: xpRequired,
    progress,
  };
}
```

### 3. dto/xp.dto.ts

```typescript
import { IsNumber, IsEnum, IsString, IsOptional, Min } from 'class-validator';
import { XpSourceType } from '../entities/xp-transaction.entity';

export class AddXpDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(XpSourceType)
  sourceType: XpSourceType;

  @IsString()
  @IsOptional()
  sourceId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class XpSummaryDto {
  totalXp: number;
  level: number;
  xpForNextLevel: {
    current: number;
    required: number;
    progress: number;
  };
  recentTransactions: XpTransactionDto[];
  dailyXp: number;
  weeklyXp: number;
}

export class XpTransactionDto {
  id: string;
  amount: number;
  sourceType: XpSourceType;
  description: string;
  createdAt: Date;
}
```

### 4. xp.service.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { XpTransactionEntity, XpSourceType } from './entities/xp-transaction.entity';
import { UserStatsEntity } from '../../users/entities/user-stats.entity';
import { XP_CONFIG, calculateLevel, xpForNextLevel } from './xp.config';
import { AddXpDto, XpSummaryDto } from './dto/xp.dto';
import { startOfDay, startOfWeek, isWeekend } from 'date-fns';

@Injectable()
export class XpService {
  private readonly logger = new Logger(XpService.name);

  constructor(
    @InjectRepository(XpTransactionEntity)
    private xpTransactionRepo: Repository<XpTransactionEntity>,
    @InjectRepository(UserStatsEntity)
    private userStatsRepo: Repository<UserStatsEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async addXp(dto: AddXpDto): Promise<XpTransactionEntity> {
    const { userId, amount, sourceType, sourceId, description } = dto;

    // Calculate multiplier
    const multiplier = await this.calculateMultiplier(userId);
    const finalAmount = Math.floor(amount * multiplier);

    // Check daily cap
    const todayXp = await this.getTodayXp(userId);
    const cappedAmount = Math.min(
      finalAmount,
      XP_CONFIG.dailyCap - todayXp,
    );

    if (cappedAmount <= 0) {
      this.logger.log(`User ${userId} reached daily XP cap`);
      return null;
    }

    // Create transaction
    const transaction = this.xpTransactionRepo.create({
      userId,
      amount: cappedAmount,
      baseAmount: amount,
      multiplier,
      sourceType,
      sourceId,
      description,
    });
    await this.xpTransactionRepo.save(transaction);

    // Update user stats
    const oldLevel = await this.getUserLevel(userId);
    await this.updateUserStats(userId, cappedAmount);
    const newLevel = await this.getUserLevel(userId);

    // Check for level up
    if (newLevel > oldLevel) {
      this.eventEmitter.emit('xp.levelUp', {
        userId,
        oldLevel,
        newLevel,
      });
      this.logger.log(`User ${userId} leveled up: ${oldLevel} -> ${newLevel}`);
    }

    this.logger.log(
      `User ${userId} earned ${cappedAmount} XP (base: ${amount}, multiplier: ${multiplier})`,
    );

    return transaction;
  }

  async addXpForActivity(
    userId: string,
    activityType: 'practice' | 'exam',
    score?: number,
    isPassed?: boolean,
  ): Promise<void> {
    const baseXp =
      activityType === 'practice'
        ? XP_CONFIG.sources.practice_complete
        : XP_CONFIG.sources.exam_complete;

    await this.addXp({
      userId,
      amount: baseXp,
      sourceType:
        activityType === 'practice' ? XpSourceType.PRACTICE : XpSourceType.EXAM,
      description: `Hoàn thành ${activityType === 'practice' ? 'luyện tập' : 'bài thi'}`,
    });

    // Bonus XP
    if (score !== undefined) {
      if (score === 10 || score === 100) {
        await this.addXp({
          userId,
          amount: XP_CONFIG.sources.perfect_score,
          sourceType: XpSourceType.BONUS,
          description: 'Điểm tuyệt đối',
        });
      } else if (score >= 8 || score >= 80) {
        await this.addXp({
          userId,
          amount: XP_CONFIG.sources.high_score,
          sourceType: XpSourceType.BONUS,
          description: 'Điểm cao',
        });
      }
    }

    if (isPassed && activityType === 'exam') {
      await this.addXp({
        userId,
        amount: XP_CONFIG.sources.exam_passed,
        sourceType: XpSourceType.BONUS,
        description: 'Đỗ bài thi',
      });
    }

    // First activity of the day bonus
    const todayCount = await this.xpTransactionRepo.count({
      where: {
        userId,
        sourceType: XpSourceType.PRACTICE,
        createdAt: MoreThan(startOfDay(new Date())),
      },
    });

    if (todayCount === 1) {
      await this.addXp({
        userId,
        amount: XP_CONFIG.sources.first_of_day,
        sourceType: XpSourceType.BONUS,
        description: 'Hoạt động đầu tiên trong ngày',
      });
    }
  }

  async addStreakXp(userId: string, streakDays: number): Promise<void> {
    // Daily streak XP
    await this.addXp({
      userId,
      amount: XP_CONFIG.sources.streak_day,
      sourceType: XpSourceType.STREAK,
      description: `Streak ngày ${streakDays}`,
    });

    // Milestone bonuses
    if (streakDays === 7) {
      await this.addXp({
        userId,
        amount: XP_CONFIG.sources.streak_week,
        sourceType: XpSourceType.STREAK,
        description: 'Streak 1 tuần',
      });
    } else if (streakDays === 30) {
      await this.addXp({
        userId,
        amount: XP_CONFIG.sources.streak_month,
        sourceType: XpSourceType.STREAK,
        description: 'Streak 1 tháng',
      });
    }
  }

  async getUserSummary(userId: string): Promise<XpSummaryDto> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    const totalXp = stats?.xp || 0;

    const recentTransactions = await this.xpTransactionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const today = startOfDay(new Date());
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const dailyXp = await this.getXpInRange(userId, today, new Date());
    const weeklyXp = await this.getXpInRange(userId, weekStart, new Date());

    return {
      totalXp,
      level: calculateLevel(totalXp),
      xpForNextLevel: xpForNextLevel(totalXp),
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        sourceType: t.sourceType,
        description: t.description,
        createdAt: t.createdAt,
      })),
      dailyXp,
      weeklyXp,
    };
  }

  async getTransactionHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: XpTransactionEntity[]; total: number }> {
    const [items, total] = await this.xpTransactionRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }

  async getUserLevel(userId: string): Promise<number> {
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    return calculateLevel(stats?.xp || 0);
  }

  private async calculateMultiplier(userId: string): Promise<number> {
    let multiplier = 1.0;

    // Weekend bonus
    if (isWeekend(new Date())) {
      multiplier *= XP_CONFIG.multipliers.weekend;
    }

    // Streak multiplier
    const stats = await this.userStatsRepo.findOne({ where: { userId } });
    const streak = stats?.currentStreak || 0;

    if (streak >= 100) {
      multiplier *= XP_CONFIG.multipliers.streak_100;
    } else if (streak >= 30) {
      multiplier *= XP_CONFIG.multipliers.streak_30;
    } else if (streak >= 7) {
      multiplier *= XP_CONFIG.multipliers.streak_7;
    }

    // TODO: Check for premium status
    // TODO: Check for active events

    return Math.round(multiplier * 100) / 100;
  }

  private async getTodayXp(userId: string): Promise<number> {
    const today = startOfDay(new Date());
    return this.getXpInRange(userId, today, new Date());
  }

  private async getXpInRange(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    const result = await this.xpTransactionRepo
      .createQueryBuilder('xp')
      .select('COALESCE(SUM(xp.amount), 0)', 'total')
      .where('xp.user_id = :userId', { userId })
      .andWhere('xp.created_at BETWEEN :start AND :end', { start, end })
      .getRawOne();

    return parseInt(result.total, 10);
  }

  private async updateUserStats(userId: string, xpAmount: number): Promise<void> {
    await this.userStatsRepo
      .createQueryBuilder()
      .update(UserStatsEntity)
      .set({
        xp: () => `xp + ${xpAmount}`,
        level: () => `(
          SELECT GREATEST(1, (
            SELECT COUNT(*) + 1 FROM (
              VALUES (0), (100), (300), (600), (1000), (1500), (2200), (3000), (4000), (5200)
            ) AS levels(xp_threshold)
            WHERE xp_threshold <= xp + ${xpAmount}
          ))
        )`,
      })
      .where('userId = :userId', { userId })
      .execute();
  }
}
```

### 5. xp.controller.ts

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
import { XpService } from './xp.service';

@ApiTags('XP')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('xp')
export class XpController {
  constructor(private xpService: XpService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get XP summary for current user' })
  async getSummary(@Request() req) {
    return this.xpService.getUserSummary(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get XP transaction history' })
  async getHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.xpService.getTransactionHistory(req.user.id, page, limit);
  }

  @Get('level')
  @ApiOperation({ summary: 'Get current level' })
  async getLevel(@Request() req) {
    const level = await this.xpService.getUserLevel(req.user.id);
    return { level };
  }
}
```

### 6. xp.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XpTransactionEntity } from './entities/xp-transaction.entity';
import { UserStatsEntity } from '../../users/entities/user-stats.entity';
import { XpService } from './xp.service';
import { XpController } from './xp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([XpTransactionEntity, UserStatsEntity])],
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService],
})
export class XpModule {}
```

---

## ✅ Acceptance Criteria

- [ ] XP transactions logged correctly
- [ ] Level calculation works
- [ ] Multipliers applied correctly
- [ ] Daily XP cap enforced
- [ ] Level up event emitted
- [ ] User stats updated
- [ ] XP summary endpoint works
- [ ] Transaction history paginated

---

## 🧪 Test Cases

```typescript
describe('XpService', () => {
  it('adds XP correctly', async () => {
    // Add 50 XP
    // Verify transaction created
    // Verify user stats updated
  });

  it('applies multipliers', async () => {
    // User with 10-day streak
    // Add 100 base XP
    // Verify multiplier applied
  });

  it('triggers level up event', async () => {
    // User at 95 XP (Level 1)
    // Add 10 XP
    // Verify level up event emitted
  });

  it('enforces daily cap', async () => {
    // Add 900 XP
    // Try to add 200 more
    // Verify only 100 added (cap 1000)
  });

  it('calculates level correctly', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(5200)).toBe(10);
  });
});
```
